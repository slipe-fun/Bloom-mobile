import { Avatar, Button, Checkbox } from '@components/ui'
import Icon from '@components/ui/Icon'
import { getCharEnter, getCharExit, getFadeIn, getFadeOut, layoutAnimationSpringy, springyChar } from '@constants/animations'
import { useChatItem } from '@hooks'
import type { ChatView } from '@interfaces'
import type React from 'react'
import { useMemo } from 'react'
import { Pressable, Text, View } from 'react-native'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Chat.styles'

type ChatProps = {
  chat: ChatView
  isSearch?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)
const AnimatedCheckbox = Animated.createAnimatedComponent(Checkbox)

export default function Chat({ chat, isSearch = false }: ChatProps): React.JSX.Element {
  const { theme } = useUnistyles()
  const { selected, edit, pinned, animatedMetaRowStyle, animatedShiftStyle, openChat, pin, select } = useChatItem(chat)

  const recipient = chat?.recipient
  const lastMessage = chat?.lastMessage

  const timeChars = useMemo(() => (!isSearch ? lastMessage?.time?.split('') || [] : null), [lastMessage?.time, isSearch])

  return (
    <AnimatedPressable entering={getFadeIn()} onPress={edit ? select : openChat} style={styles.chat}>
      <LayoutAnimationConfig skipEntering skipExiting>
        {edit && (
          <>
            <Animated.View style={styles.pinButtonWrapper} key="pinButton" exiting={getFadeOut()} entering={getFadeIn()}>
              <Button
                style={styles.pinButton(pinned)}
                onPress={pin}
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
            <AnimatedCheckbox
              style={{ position: 'absolute', left: 16 }}
              entering={getFadeIn()}
              exiting={getFadeOut()}
              onTouch={select}
              value={selected}
            />
          </>
        )}
        <Animated.View style={[styles.avatarWrapper, animatedShiftStyle]}>
          <Avatar size={!isSearch ? 'lg' : 'md'} image={chat?.avatar} username={recipient?.username} />
        </Animated.View>
        <Animated.View style={[styles.content, animatedShiftStyle]}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{recipient?.username}</Text>

            <Animated.View style={[styles.metaRow, animatedMetaRowStyle]}>
              {!isSearch && (
                <Animated.View layout={layoutAnimationSpringy} style={styles.charStack}>
                  {timeChars.map((char, i) => (
                    <Animated.Text
                      key={char}
                      style={styles.secondary(false)}
                      entering={getCharEnter(springyChar(i))}
                      exiting={getCharExit(springyChar(i))}
                      numberOfLines={1}
                    >
                      {char}
                    </Animated.Text>
                  ))}
                </Animated.View>
              )}
              <Icon icon="chevron.right" size={16} color={theme.colors.secondaryText} />
            </Animated.View>
          </View>

          {!isSearch ? (
            <Animated.Text
              entering={getCharEnter()}
              exiting={getCharExit()}
              key={lastMessage.content}
              style={styles.secondary(edit)}
              numberOfLines={2}
            >
              {lastMessage.content}
            </Animated.Text>
          ) : (
            <Text numberOfLines={1} style={styles.secondary(edit)}>
              @{recipient?.username}
            </Text>
          )}
        </Animated.View>
      </LayoutAnimationConfig>
      <View style={styles.separator} />
    </AnimatedPressable>
  )
}
