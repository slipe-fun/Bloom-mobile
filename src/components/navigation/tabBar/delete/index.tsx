import { Button, Icon } from '@components/ui'
import {
  charAnimationIn,
  charAnimationOut,
  layoutAnimation,
  quickSpring,
  vSlideAnimationIn,
  vSlideAnimationOut,
} from '@constants/animations'
import useChatsStore from '@stores/chats'
import { useEffect, useMemo } from 'react'
import Animated, { interpolateColor, LayoutAnimationConfig, useAnimatedProps, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './Delete.styles'

export default function TabBarDelete() {
  const { selectedChats } = useChatsStore()
  const { theme } = useUnistyles()
  const animatedTheme = useAnimatedTheme()
  const color = useSharedValue(0)

  const countChars = useMemo(() => selectedChats.length.toString().split(''), [selectedChats])

  const hasSelected: boolean = selectedChats.length > 0

  const animatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(color.get(), [0, 1], [animatedTheme.value.colors.secondaryText, animatedTheme.value.colors.red]),
  }))

  useEffect(() => {
    color.set(withSpring(hasSelected ? 1 : 0, quickSpring))
  }, countChars)

  return (
    <Animated.View pointerEvents="box-only" style={styles.container} entering={vSlideAnimationIn} exiting={vSlideAnimationOut}>
      <Button size="lg" variant="text" layout={layoutAnimation}>
        <LayoutAnimationConfig skipEntering skipExiting>
          <Animated.View layout={layoutAnimation} style={styles.deleteCharStack}>
            {countChars.map((char) => (
              <Animated.Text
                key={char}
                style={styles.deleteChar}
                entering={charAnimationIn()}
                exiting={charAnimationOut()}
                numberOfLines={1}
              >
                {char}
              </Animated.Text>
            ))}
            <Animated.Text layout={layoutAnimation} style={styles.subTitle}>
              {' '}
              Selected
            </Animated.Text>
          </Animated.View>
        </LayoutAnimationConfig>
      </Button>
      <Button disabled={!hasSelected} variant="icon" size="lg" key="tabBarBackButton">
        <Icon size={28} icon="trash" animatedProps={animatedProps} color={theme.colors.secondaryText} />
      </Button>
    </Animated.View>
  )
}
