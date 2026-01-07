import addKeysToDump from '@api/lib/keys/addKeysToDump'
import getChatFromStorage from '@lib/getChatFromStorage'
import setChatKeysToStorage from '@lib/setChatKeysToStorage'
import decrypt from '@lib/skid/decrypt'
import generateKeys from '@lib/skid/generateKeys'
import { decrypt as sskDecrypt } from '@lib/skid/serversideKeyEncryption'
import useStorageStore from '@stores/storage'
import { createContext, useContext, useEffect, useState } from 'react'
import getChats from '../lib/chats/getChats'
import { useWebSocket } from './WebSocketContext'

const ChatsContext = createContext(null)

export default function ChatsProvider({ children }) {
  // chats variable
  const [chats, setChats] = useState([])
  // websocket context
  const ws = useWebSocket()
  // storages
  const { mmkv, realm } = useStorageStore()

  function safeObject(obj) {
    if (!obj) return
    return JSON.parse(JSON.stringify(obj))
  }

  async function decryptMessage(_chat, message) {
    // get chat from mmkv storage
    const chat = await getChatFromStorage(message?.chat_id)

    if (!chat) return

    // get current user chat keys
    const myKeys = chat?.keys?.my
    // get recipient chat keys
    const recipientKeys = chat?.keys?.recipient
    // get general chat key
    const key = chat?.key

    try {
      // if kyber message sent by recipient then decrypt using both key pairs
      // or if message dont have encapsulated_key decrypt using just ciphertext, nonce and chat key (skid soft mode)
      return {
        ...(message?.encapsulated_key
          ? decrypt(message, myKeys, recipientKeys, false)
          : sskDecrypt(message?.ciphertext, message?.nonce, key)),
        chat_id: message?.chat_id,
        id: message?.id,
        seen: message?.seen,
        nonce: message?.nonce,
      }
    } catch (error) {
      // if kyber message sent by user (current session user) decrypt using only his keys
      if (error.message === 'invalid polyval tag') {
        try {
          return {
            ...decrypt(message, myKeys, myKeys, true),
            chat_id: message?.chat_id,
            id: message?.id,
            seen: message?.seen,
            nonce: message?.nonce,
          }
        } catch {}
      }
    }
  }

  async function sort(chats) {
    const enrichedChats = await Promise.all(
      chats?.map(async (chat) => {
        const realmResult = realm.objects('Message').filtered('chat_id == $0', chat?.id).sorted('date', true)[0]

        const localLastMessage = realmResult ? safeObject(realmResult) : null

        let decryptedLastMessage = null
        const msg = chat?.last_message

        const isEncrypted = msg && (msg.ciphertext || msg.encapsulated_key)

        if (msg) {
          if (isEncrypted) {
            try {
              decryptedLastMessage = await decryptMessage(chat, msg)
            } catch (e) {
              console.warn('Decryption failed', e)
            }
          } else {
            decryptedLastMessage = msg
          }
        }

        const localTime = localLastMessage?.date ? new Date(localLastMessage.date).getTime() : 0
        const remoteTime = decryptedLastMessage?.date ? new Date(decryptedLastMessage.date).getTime() : 0

        let finalLastMessage

        if (localTime === 0 && remoteTime === 0) {
          finalLastMessage = null
        } else if (localTime >= remoteTime) {
          finalLastMessage = localLastMessage
        } else {
          finalLastMessage = decryptedLastMessage
        }

        return {
          ...chat,
          last_message: finalLastMessage,
        }
      }),
    )

    return enrichedChats.sort((a, b) => {
      const dateA = a.last_message?.date ? new Date(a.last_message.date) : 0
      const dateB = b.last_message?.date ? new Date(b.last_message.date) : 0
      return dateB - dateA
    })
  }

  useEffect(() => {
    if (ws) {
      ;(async () => {
        try {
          // get chats from api
          const _chats = await getChats(ws)
          if (_chats) setChats(await sort(_chats))
        } catch (error) {
          console.log(error)
        }
      })()

      // websocket message listener
      ws.addEventListener('message', async (msg) => {
        try {
          // parse socket message
          let message
          try {
            message = JSON.parse(msg?.data)
          } catch {
            return
          }

          // if someone from chat changed keys change them in mmkv storage
          if (message?.type === 'keys_added') {
            await setChatKeysToStorage(message?.chat_id, {
              kyberPublicKey: message?.kyber_public_key,
              ecdhPublicKey: message?.ecdh_public_key,
              edPublicKey: message?.ed_public_key,
            })
          } else if (message?.chat) {
            // chat created socket
            // parse chats from mmkv storage
            let _chats
            try {
              _chats = JSON.parse(mmkv.getString('chats'))
            } catch {
              _chats = []
            }

            // generate current user encryption keys
            const myKeys = generateKeys()

            // send current user public keys
            ws.send(
              JSON.stringify({
                type: 'add_keys',
                chat_id: message?.chat?.id,
                kyber_public_key: myKeys.kyberPublicKey,
                ecdh_public_key: myKeys.ecdhPublicKey,
                ed_public_key: myKeys.edPublicKey,
              }),
            )

            // add chat to mmkv storage
            _chats = [
              ..._chats,
              {
                id: message?.chat?.id,
                key: message?.chat?.encryption_key,
                keys: {
                  my: { ...myKeys },
                  recipient: {},
                },
              },
            ]

            // send dump
            addKeysToDump(mmkv, { chat_id: message?.chat?.id, ...myKeys })

            // save changes
            mmkv.set('chats', JSON.stringify(_chats))

            // add new chat to chats var
            setChats((prev) => {
              const next = [...prev, message.chat]
              sort(next).then((sorted) => setChats(sorted))
              return next
            })
          }
        } catch {}
      })
    }
  }, [ws])

  useEffect(() => {
    const listeners = []

    ;(async () => {
      chats.forEach((chat) => {
        // get all chat messages
        const messages = realm.objects('Message').filtered('chat_id == $0', chat.id)

        // realm listener
        const listener = (_collection, changes) => {
          if (changes.insertions.length > 0) {
            // change chat last message if last message changed in local realm storage
            setChats((prev) => {
              const updated = prev.map((c) => (c.id === chat.id ? { ...c, last_message: safeObject(messages.sorted('date', true)[0]) } : c))

              updated.sort((a, b) => {
                const dateA = a.last_message?.date ? new Date(a.last_message.date).getTime() : 0
                const dateB = b.last_message?.date ? new Date(b.last_message.date).getTime() : 0
                return dateB - dateA
              })

              return updated
            })
          }
        }

        // init listener
        messages.addListener(listener)
        listeners.push({ messages, listener })
      })
    })()
  }, [chats])

  return <ChatsContext.Provider value={chats}>{children}</ChatsContext.Provider>
}

export const useChatList = () => useContext(ChatsContext)
