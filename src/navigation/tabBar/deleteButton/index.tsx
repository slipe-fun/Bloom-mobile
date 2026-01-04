import { Icon } from '@components/ui'
import {
  charAnimationIn,
  charAnimationOut,
  layoutAnimationSpringy,
  quickSpring,
  vSlideAnimationIn,
  vSlideAnimationOut,
} from '@constants/animations'
import useChatsStore from '@stores/chats'
import { useMemo } from 'react'
import type { ViewStyle } from 'react-native'
import Animated, { LayoutAnimationConfig, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './DeleteButton.styles'

export default function TabBarActionButtonDelete(): React.JSX.Element {
  const { selectedChats } = useChatsStore()
  const { theme } = useUnistyles()

  const countChars = useMemo(() => selectedChats.length.toString().split(''), [selectedChats])

  const animatedWrapperStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: withSpring(selectedChats.length > 0 ? 1 : 0.5, quickSpring),
    }),
  )

  return (
    <Animated.View layout={layoutAnimationSpringy} entering={vSlideAnimationIn} exiting={vSlideAnimationOut}>
      <Animated.View layout={layoutAnimationSpringy} style={[styles.deleteWrapper, animatedWrapperStyle]}>
        <LayoutAnimationConfig skipEntering skipExiting>
          <Icon size={26} icon="trash" color={theme.colors.white} />

          {selectedChats.length > 0 && (
            <Animated.View layout={layoutAnimationSpringy} style={styles.deleteCharStack}>
              {countChars.map((char, i) => (
                <Animated.Text
                  key={`${char}-${i}`}
                  style={styles.deleteChar}
                  entering={charAnimationIn}
                  exiting={charAnimationOut}
                  numberOfLines={1}
                >
                  {char}
                </Animated.Text>
              ))}
            </Animated.View>
          )}
        </LayoutAnimationConfig>
      </Animated.View>
    </Animated.View>
  )
}
