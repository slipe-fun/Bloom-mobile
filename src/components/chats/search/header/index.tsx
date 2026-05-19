import { quickSpring } from '@constants/easings'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import { useCallback } from 'react'
import { type LayoutChangeEvent, Text } from 'react-native'
import Animated, { type SharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './Header.styles'

type SearchHeaderProps = {
  scrollY: SharedValue<number>
  headerHeight: number
  setHeaderHeight: (height: number) => void
}

export default function SearchHeader({ scrollY, headerHeight, setHeaderHeight }: SearchHeaderProps) {
  const insets = useInsets()

  const topInset = insets.top + base.spacing.xl

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout

    if (headerHeight === 0) {
      setHeaderHeight(height)
    }
  }, [])

  const animatedViewStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(scrollY.get() >= topInset / 2 ? 0 : 1, quickSpring),
    }
  }, [headerHeight, topInset])

  return (
    <Animated.View onLayout={onLayout} style={[animatedViewStyle, styles.header(topInset)]}>
      <Text style={styles.title(true)}>Поиск</Text>
    </Animated.View>
  )
}
