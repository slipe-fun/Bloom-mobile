import addChatToStorage from '@api/lib/chats/addChatToStorage'
import createChatRequest from '@api/lib/chats/create'
import { useChatList } from '@api/providers/ChatsContext'
import { quickSpring } from '@constants/easings'
import type { ChatView } from '@interfaces'
import useChatsStore from '@stores/chats'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import { Haptics } from 'react-native-nitro-haptics'
import { type AnimatedStyle, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

interface useChatItem {
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
  const router = useRouter()

  const { userID } = useTokenTriggerStore()
  const { edit, selectedChats, toggleChat } = useChatsStore()
  const animationFinished = useSharedValue<boolean>(true)
  const { chats, addChat } = useChatList()

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

  const redirect = (id) =>
    router.push({
      pathname: '/chat/[chat]',
      params: {
        chat: JSON.stringify({ ...chat, id }),
      },
    })

  const openChat = async () => {
    const existingChat = chats?.find((c) => c?.members?.some((m) => m?.id === userID) && c?.members?.some((m) => m?.id === targetId))

    if (existingChat) {
      redirect(existingChat?.id)
      return
    }

    const response = await createChatRequest(targetId)

    if (response) {
      addChatToStorage(response?.id, response?.encryption_key)
      addChat(response)

      redirect(response?.id)
      return
    }
  }

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
