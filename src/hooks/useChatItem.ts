import { useChatList } from '@api/providers/ChatsContext'
import { useWebSocket } from '@api/providers/WebSocketContext'
import { quickSpring } from '@constants/easings'
import { ROUTES } from '@constants/routes'
import type { ChatView } from '@interfaces'
import { useNavigation } from '@react-navigation/native'
import useChatsStore from '@stores/chats'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import { useCallback, useEffect, useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { Haptics } from 'react-native-nitro-haptics'
import { type AnimatedStyle, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

type CreateChatResponse = {
  chat?: {
    id: string
  }
}

type useChatItem = {
  selected: boolean
  edit: boolean
  pinned: boolean
  animatedMetaRowStyle: AnimatedStyle<ViewStyle>
  animatedShiftStyle: AnimatedStyle<ViewStyle>
  openChat: () => void
  pin: () => void
  select: () => void
}

export default function useChatNavigation(chat: ChatView): useChatItem {
  const navigation = useNavigation()
  const chats = useChatList()
  const ws = useWebSocket()
  const { userID } = useTokenTriggerStore()
  const { edit, selectedChats, toggleChat } = useChatsStore()
  const animationFinished = useSharedValue<boolean>(true)

  const recipient = chat?.recipient
  const targetId = recipient?.id || chat?.id

  const pinned = useMemo(() => false, [])

  const selected = useMemo(() => selectedChats.includes(chat.id), [selectedChats])

  const animatedMetaRowStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: withSpring(edit ? 0 : 1, quickSpring),
      transform: [{ translateX: withSpring(edit ? -24 : 0, quickSpring) }],
    }),
  )

  const animatedShiftStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ translateX: withSpring(edit ? 44 : 0, quickSpring, (finished) => animationFinished.set(finished)) }],
    }),
  )

  const openChat = useCallback(() => {
    const existingChat = chats?.find((c) => c?.members?.some((m) => m?.id === userID) && c?.members?.some((m) => m?.id === targetId))

    if (existingChat) {
      // @ts-expect-error
      navigation.navigate(ROUTES.chat, {
        chat: { ...chat, id: existingChat.id },
      })
      return
    }

    ws.send(JSON.stringify({ type: 'create_chat', recipient: targetId }))

    const handleMessage = (event: MessageEvent<string>) => {
      const message: CreateChatResponse = JSON.parse(event.data)
      if (message?.chat) {
        ws.removeEventListener('message', handleMessage)
        // @ts-expect-error
        navigation.navigate(ROUTES.chat, {
          chat: { ...chat, id: message.chat.id },
        })
      }
    }

    ws.addEventListener('message', handleMessage)
  }, [chats, userID, targetId, chat, navigation, ws])

  const pin = useCallback(() => {
    console.log(1)
  }, [])

  const select = useCallback(() => {
    Haptics.impact('light')
    toggleChat(chat.id)
  }, [chat.id, toggleChat])

  useEffect(() => {
    animationFinished.set(false)
  }, [edit])

  return {
    selected,
    edit,
    pinned,
    animatedMetaRowStyle,
    animatedShiftStyle,
    openChat,
    pin,
    select,
  }
}
