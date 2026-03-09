import { useInsets } from '@hooks'
import { useCallback, useRef } from 'react'
import { type LayoutChangeEvent, Text } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'

type SearchHeaderProps = {
  scrollY: SharedValue<number>
  headerHeight: number
  setHeaderHeight: (height: number) => void
}

export default function SearchHeader({ scrollY, headerHeight, setHeaderHeight }: SearchHeaderProps) {
  const insets = useInsets()

  const lastHeight = useRef(headerHeight)

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout

      if (height > 0 && height !== lastHeight.current) {
        lastHeight.current = height
        if (height !== headerHeight) {
          setHeaderHeight(height)
        }
      }
    },
    [headerHeight, setHeaderHeight],
  )

  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.get(), [0, insets.top], [1, 0], 'clamp'),
    }
  }, [headerHeight, insets.top])

  return (
    <Animated.View onLayout={onLayout} style={[animatedViewStyle, styles.header(insets.top + 16)]}>
      <Text style={styles.title(true)}>Поиск</Text>
    </Animated.View>
  )
}
