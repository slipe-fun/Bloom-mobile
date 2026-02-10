import encryptAndSendMessage from '@api/lib/messages/hooks/encryptAndSendMessage'
import getChangesOfSeenMessagesStatus from '@api/lib/messages/hooks/getChangesOfSeenMessagesStatus'
import getMessagesFromApi from '@api/lib/messages/hooks/getMessagesFromApi'
import getMessagesFromLocalStorage from '@api/lib/messages/hooks/getMessagesFromLocalStorage'
import getNewMessagesFromMessageSocket from '@api/lib/messages/hooks/getNewMessagesFromMessageSocket'
import sendSeenSocket from '@api/lib/messages/hooks/sendSeenSocket'
import loadMessages from '@api/lib/messages/loadMessages'
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
  const { mmkv } = useStorageStore()

  const nextPage = async () => await loadMessages(mmkv, chat_id, messages, setMessages)

  // ENCRYPT AND SEND MESSAGE
  const addMessage = async (content, reply_to) => encryptAndSendMessage(mmkv, ws, content, reply_to, messages, setMessages, chat_id)

  const messagesWithDates = useMemo(() => {
    return addDateHeaders([...messages]).reverse()
  }, [messages])

  // GET MESSAGES FROM API
  useEffect(() => {
    getMessagesFromApi(mmkv, setMessages, chat_id)
  }, [chat_id])

  // GET MESSAGES FROM LOCAL STORAGE
  useEffect(() => {
    getMessagesFromLocalStorage(mmkv, chat_id, setMessages)
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
    sendSeenSocket(ws, chat_id, messages, setMessages)
  }, [messages])

  return { messages: messagesWithDates, addMessage, nextPage }
}
