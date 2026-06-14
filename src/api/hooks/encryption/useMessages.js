import encryptAndSendMessage from '@api/lib/messages/hooks/encryptAndSendMessage'
import getChangesOfSeenMessagesStatus from '@api/lib/messages/hooks/getChangesOfSeenMessagesStatus'
import getMessagesFromApi from '@api/lib/messages/hooks/getMessagesFromApi'
import getMessagesFromLocalStorage from '@api/lib/messages/hooks/getMessagesFromLocalStorage'
import getNewMessagesFromMessageSocket from '@api/lib/messages/hooks/getNewMessagesFromMessageSocket'
import sendSeenSocket from '@api/lib/messages/hooks/sendSeenSocket'
import loadMessages from '@api/lib/messages/loadMessages'
import uniqueById from '@api/lib/utils/uniqueById'
// import addDateHeaders from '@api/lib/utils/date/addDateHeaders'
import { useMessagesList } from '@api/providers/MessagesContext'
import { useSeenMessagesList } from '@api/providers/SeenMessagesContext'
import { useWebSocket } from '@api/providers/WebSocketContext'
import useChatStore from '@stores/chat'
import useStorageStore from '@stores/storage'
import { useEffect, useMemo, useState } from 'react'

export default function (chat_id) {
  const [messages, setMessages] = useState([])

  // socket variables
  const { messages: newMessages, clear: clearNewMessages } = useMessagesList()
  const { seenMessages: newSeenMessages, clear: clearNewSeenMessages } = useSeenMessagesList()
  const ws = useWebSocket()
  const chat = useChatStore((state) => state.chat)

  // storages
  const { mmkv, ensureMMKV } = useStorageStore()

  const messagesWithDates = useMemo(() => {
    return uniqueById([...messages]).sort((a, b) => new Date(b.raw_date) - new Date(a.raw_date))
  }, [messages])

  const nextPage = async () => {
    const storage = mmkv ?? (await ensureMMKV())
    return loadMessages(storage, chat_id, messagesWithDates, setMessages)
  }

  // ENCRYPT AND SEND MESSAGE
  const addMessage = async (content, reply_to) => {
    const storage = mmkv ?? (await ensureMMKV())
    return encryptAndSendMessage(storage, ws, content, reply_to, messagesWithDates, setMessages, chat_id, chat?.me?.id, chat?.key)
  }

  // GET MESSAGES FROM API
  useEffect(() => {
    if (!mmkv) {
      return
    }

    getMessagesFromApi(mmkv, setMessages, chat_id)
  }, [mmkv, chat_id])

  // GET MESSAGES FROM LOCAL STORAGE
  useEffect(() => {
    if (!mmkv) {
      return
    }

    getMessagesFromLocalStorage(mmkv, chat_id, setMessages)
  }, [mmkv, chat_id])

  // GET NEW MESSAGES FROM MESSAGE SOCKET
  useEffect(() => {
    if (!mmkv) {
      return
    }

    getNewMessagesFromMessageSocket(mmkv, setMessages, newMessages, chat_id, messagesWithDates, clearNewMessages)
  }, [mmkv, newMessages, chat_id, messagesWithDates])

  // GET CHANGES OF SEEN MESSAGES STATUS
  useEffect(() => {
    getChangesOfSeenMessagesStatus(newSeenMessages, chat_id, setMessages, clearNewSeenMessages)
  }, [newSeenMessages, chat_id])

  // SEND SEEN SOCKET
  useEffect(() => {
    sendSeenSocket(ws, chat_id, messagesWithDates, setMessages)
  }, [messagesWithDates])

  return { messages: messagesWithDates, addMessage, nextPage }
}
