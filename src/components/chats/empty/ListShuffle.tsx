import { quickSpring } from '@constants/animations'
import { useEffect } from 'react'
import { View, type ViewStyle } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Empty.styles'

interface ListCard {
  style: ViewStyle
  overlayStyle: ViewStyle
  data: any
}

export default function ListShuffle() {
  const progress = useSharedValue(0)

  const animatedFrontStyle = useAnimatedStyle(() => ({
    backgroundColor: 'yellow',
    transform: [{ translateY: interpolate(progress.get(), [2, 3], [24, 0]) }],
  }))

  const animatedMiddleStyle = useAnimatedStyle(() => ({
    backgroundColor: 'red',
    transform: [
      { translateY: interpolate(progress.get(), [1, 2], [24, 0]) },
      { scale: interpolate(progress.get(), [2, 3], [1, 0.9], 'clamp') },
    ],
  }))

  const animatedBackStyle = useAnimatedStyle(() => ({
    backgroundColor: 'green',
    transform: [
      { translateY: interpolate(progress.get(), [0, 1], [24, 0]) },
      { scale: interpolate(progress.get(), [1, 2, 3], [1, 0.9, 0.8], 'clamp') },
    ],
  }))

  const animatedFrontOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1, 2, 3], [1, 1, 1, 0], 'clamp'),
  }))

  const animatedMiddleOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1, 2, 3], [1, 1, 0, 0.4], 'clamp'),
  }))

  const animatedBackOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1, 2, 3], [1, 0, 0.4, 0.8]),
  }))

  useEffect(() => {
    progress.set(withSpring(0, quickSpring))
  })

  return (
    <View style={styles.shuffleContainer}>
      {/* <ListCard /> */}
      <ListCard style={animatedBackStyle} overlayStyle={animatedBackOverlayStyle} />
      <ListCard style={animatedMiddleStyle} overlayStyle={animatedMiddleOverlayStyle} />
      <ListCard style={animatedFrontStyle} overlayStyle={animatedFrontOverlayStyle} />
    </View>
  )
}

function ListCard({ style, overlayStyle, data }: ListCard) {
  return (
    <Animated.View style={[styles.shuffleCard, style]}>
      <Animated.View style={[styles.cardOverlay, overlayStyle]} />
    </Animated.View>
  )
}
