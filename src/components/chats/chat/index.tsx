import { Avatar, Button, Checkbox } from '@components/ui'
import Icon from '@components/ui/Icon'
import { charAnimationIn, charAnimationOut, getFadeIn, getFadeOut, layoutAnimationSpringy, springyChar } from '@constants/animations'
import { useChatItem } from '@hooks'
import type { Chat as ChatType, ChatView } from '@interfaces'
import formatSentTime from '@lib/formatSentTime'
import useTokenTriggerStore from '@stores/tokenTriggerStore'
import { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Chat.styles'

interface ChatProps {
  chat: ChatType
  isLast?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedCheckbox = Animated.createAnimatedComponent(Checkbox)

export default function Chat({ chat, isLast = false }: ChatProps) {
  const userID = useTokenTriggerStore((state) => state.userID)
  const { theme } = useUnistyles()

  const lastMessage = {
    time: chat?.last_message?.date ? formatSentTime(chat?.last_message?.date) : '',
    content: chat?.last_message?.content || 'Чат создан',
  }

  const timeChars = useMemo(() => lastMessage?.time?.split('') || [], [lastMessage?.time])
  const recipient = useMemo(() => chat.members?.find((member) => member.id !== userID), [chat, chat.members, userID])
  const chatData = useMemo(
    (): ChatView => ({
      lastMessage,
      recipient,
      id: chat.id,
      avatar: '',
      unreadCount: 0,
    }),
    [chat.id, lastMessage, recipient],
  )
  const { selected, edit, pinned, animatedMetaRowStyle, animatedShiftStyle, animatedChatStyle, pin, select, handlePress, onPressHandler } =
    useChatItem(chatData, false)

  return (
    <AnimatedPressable
      onPressIn={() => handlePress(true)}
      onPressOut={() => handlePress(false)}
      entering={getFadeIn()}
      onPress={onPressHandler}
      style={[styles.chat, animatedChatStyle]}
    >
      <LayoutAnimationConfig skipEntering skipExiting>
        {edit && (
          <>
            <Animated.View style={styles.pinButtonWrapper} key="pinButton" exiting={getFadeOut()} entering={getFadeIn()}>
              <Button
                style={styles.pinButton(pinned)}
                onPress={pin}
                elevated={false}
                size="sm"
                icon={
                  pinned ? (
                    <Icon size={24} icon="star.slashed" color={theme.colors.red} />
                  ) : (
                    <Icon size={24} icon="star" color={theme.colors.yellow} />
                  )
                }
                variant="icon"
              />
            </Animated.View>
            <AnimatedCheckbox style={styles.checkbox} entering={getFadeIn()} exiting={getFadeOut()} onTouch={select} value={selected} />
          </>
        )}
        <Animated.View style={[styles.avatarWrapper, animatedShiftStyle]}>
          <Avatar size="lg" image={chat?.avatar} username={recipient?.username || recipient?.display_name} />
        </Animated.View>
        <Animated.View style={[styles.content, animatedShiftStyle]}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{recipient?.display_name || recipient?.username}</Text>

            <Animated.View style={[styles.metaRow, animatedMetaRowStyle]}>
              <Animated.View layout={layoutAnimationSpringy} style={styles.charStack}>
                {timeChars.map((char, i) => (
                  <Animated.Text
                    key={`${i}-${char}`}
                    style={styles.secondary(false)}
                    entering={charAnimationIn(springyChar(i), false)}
                    exiting={charAnimationOut(springyChar(i), false)}
                    numberOfLines={1}
                  >
                    {char}
                  </Animated.Text>
                ))}
              </Animated.View>
              <Icon icon="chevron.right" size={16} color={theme.colors.secondaryText} />
            </Animated.View>
          </View>

          <Animated.Text
            entering={getFadeIn()}
            exiting={getFadeOut()}
            key={lastMessage?.content}
            style={styles.secondary(edit)}
            numberOfLines={2}
          >
            {lastMessage?.content}
          </Animated.Text>
        </Animated.View>
      </LayoutAnimationConfig>
      {!isLast && <View style={styles.separator('lg')} />}
    </AnimatedPressable>
  )
}
