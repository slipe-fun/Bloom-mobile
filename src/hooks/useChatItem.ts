import addChatToStorage from '@api/lib/chats/addChatToStorage'
import createChat from '@api/lib/chats/create'
import { useChatList } from '@api/providers/ChatsContext'
import { quickSpring } from '@constants/easings'
import type { ChatView } from '@interfaces'
import useChatsStore from '@stores/chats'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import type { ViewStyle } from 'react-native'
import { Haptics } from 'react-native-nitro-haptics'
import { type AnimatedStyle, interpolateColor, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

interface useChatItem {
  selected: boolean
  edit: boolean
  pinned: boolean
  animatedChatStyle: AnimatedStyle<ViewStyle>
  animatedMetaRowStyle: AnimatedStyle<ViewStyle>
  animatedShiftStyle: AnimatedStyle<ViewStyle>
  pin: () => void
  select: () => void
  handlePress: (inn?: boolean) => void
  onPressHandler: () => void
}

export default function useChatNavigation(chat: ChatView): useChatItem {
  const router = useRouter()
  const { theme } = useUnistyles()
  const { userID } = useTokenTriggerStore()
  const { edit, selectedChats, toggleChat, setEdit } = useChatsStore()
  const { chats, addChat } = useChatList()
  const pressedValue = useSharedValue(0)
  const timer = useRef<NodeJS.Timeout>(null)
  const ignorePress = useRef(false)

  const targetId = chat.recipient?.id || chat.id
  const selected = useMemo(() => selectedChats.includes(chat.id), [selectedChats, chat.id])

  const animatedMetaRowStyle = useAnimatedStyle(() => ({
    opacity: withSpring(edit ? 0 : 1, quickSpring),
    transform: [{ translateX: withSpring(edit ? -24 : 0, quickSpring) }],
  }))

  const animatedShiftStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(edit ? 44 : 0, quickSpring) }],
  }))

  const animatedChatStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(pressedValue.get(), [0, 1], ['transparent', theme.colors.foreground]),
  }))

  const nav = (id: string) => router.push({ pathname: '/chat/[chat]', params: { chat: JSON.stringify({ ...chat, id }) } })

  const openChat = useCallback(async () => {
    //const exist = chats?.find((c) => c.members?.some((m) => m?.id === userID) && c.members?.some((m) => m?.id === targetId))
    //if (exist) return nav(exist.id)
    console.log(targetId)
    const res = await createChat(targetId)
    if (res) {
      addChat(res)
      nav(res?.id)
    }
  }, [chats, userID, targetId])

  const select = useCallback(() => {
    Haptics.impact('light')
    toggleChat(chat.id)
  }, [chat.id, toggleChat])

  const handlePress = useCallback(
    (inn = true) => {
      if (edit) return pressedValue.set(withSpring(0, quickSpring))

      if (inn) {
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null
        }
        ignorePress.current = false
        timer.current = setTimeout(() => {
          setEdit(true)
          ignorePress.current = true
          select()
        }, 400)
      } else {
        if (timer.current) {
          clearTimeout(timer.current)
          timer.current = null
        }
      }

      pressedValue.set(withSpring(inn ? 1 : 0, quickSpring))
    },
    [edit, select],
  )

  const onPressHandler = useCallback(() => {
    if (ignorePress.current) {
      ignorePress.current = false
      return
    }
    edit ? select() : openChat()
  }, [edit, select, openChat])

  useEffect(() => () => clearTimeout(timer.current), [])

  return {
    selected,
    edit,
    pinned: false,
    animatedChatStyle,
    animatedMetaRowStyle,
    animatedShiftStyle,
    pin: useCallback(() => console.log(1), []),
    select,
    handlePress,
    onPressHandler,
  }
}
