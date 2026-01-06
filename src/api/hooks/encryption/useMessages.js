import encryptAndSendMessage from '@api/lib/messages/hooks/encryptAndSendMessage'
import getChangesOfSeenMessagesStatus from '@api/lib/messages/hooks/getChangesOfSeenMessagesStatus'
import getMessagesFromApi from '@api/lib/messages/hooks/getMessagesFromApi'
import getMessagesFromLocalRealmStorage from '@api/lib/messages/hooks/getMessagesFromLocalRealmStorage'
import getNewMessagesFromMessageSocket from '@api/lib/messages/hooks/getNewMessagesFromMessageSocket'
import sendSeenSocket from '@api/lib/messages/hooks/sendSeenSocket'
import addDateHeaders from '@api/lib/utils/date/addDateHeaders'
import { useMessagesList } from '@api/providers/MessagesContext'
import { useSeenMessagesList } from '@api/providers/SeenMessagesContext'
import { useWebSocket } from '@api/providers/WebSocketContext'
import useStorageStore from '@stores/storage'
import { useEffect, useMemo, useState } from 'react'

export default function (chat_id) {
  const [messages, setMessages] = useState([])

  // socket variables
  const { messages: newMessages, clear: clearNewMessages } = useMessagesList()
  const { seenMessages: newSeenMessages, clear: clearNewSeenMessages } = useSeenMessagesList()
  const ws = useWebSocket()

  // storages
  const { mmkv, realm } = useStorageStore()

  // ENCRYPT AND SEND MESSAGE
  const addMessage = async (content, reply_to) => encryptAndSendMessage(realm, mmkv, ws, content, reply_to, messages, setMessages, chat_id)

  const messagesWithDates = useMemo(() => {
    return addDateHeaders(messages)
  }, [messages])

  // GET MESSAGES FROM API
  useEffect(() => {
    getMessagesFromApi(realm, mmkv, setMessages, chat_id)
  }, [chat_id])

  // GET MESSAGES FROM LOCAL REALM STORAGE
  useEffect(() => {
    getMessagesFromLocalRealmStorage(realm, mmkv, chat_id, setMessages)
  }, [chat_id])

  // GET NEW MESSAGES FROM MESSAGE SOCKET
  useEffect(() => {
    getNewMessagesFromMessageSocket(mmkv, setMessages, newMessages, chat_id, messages, clearNewMessages)
  }, [newMessages, chat_id, messages])

  // GET CHANGES OF SEEN MESSAGES STATUS
  useEffect(() => {
    getChangesOfSeenMessagesStatus(newSeenMessages, chat_id, setMessages, clearNewSeenMessages)
  }, [newSeenMessages, chat_id])

  // SEND SEEN SOCKET
  useEffect(() => {
    sendSeenSocket(realm, ws, chat_id, messages, setMessages)
  }, [messages])

  return { messages: messagesWithDates, addMessage }
}
