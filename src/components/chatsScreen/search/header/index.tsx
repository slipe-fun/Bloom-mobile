import { useInsets } from '@hooks'
import { useCallback } from 'react'
import { type LayoutChangeEvent, Text, type ViewStyle } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Header.styles'

type SearchHeaderProps = {
  scrollY: SharedValue<number>
  headerHeight: number
  setHeaderHeight: (height: number) => void
}

export default function SearchHeader({ scrollY, headerHeight, setHeaderHeight }: SearchHeaderProps): React.JSX.Element {
  const insets = useInsets()

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout
    setHeaderHeight(height)
  }, [])

  const animatedViewStyle = useAnimatedStyle((): ViewStyle => {
    return {
      opacity: interpolate(scrollY.get(), [0, headerHeight - insets.top], [1, 0], 'clamp'),
    }
  }, [headerHeight])

  return (
    <Animated.View onLayout={onLayout} style={[animatedViewStyle, styles.header(true, insets.top + 12)]}>
      <Text style={styles.title(true)}>Поиск</Text>
    </Animated.View>
  )
}
