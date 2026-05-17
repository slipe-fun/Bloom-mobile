import { quickSpring } from '@constants/animations'
import { data } from '@constants/emptyStates'
import type { ChatsEmptyCardData } from '@interfaces'
import { useEffect } from 'react'
import { Image, View, type ViewStyle } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Empty.styles'

interface ListCard {
  style: ViewStyle
  overlayStyle: ViewStyle
  data: ChatsEmptyCardData
}

export default function ListShuffle() {
  const progress = useSharedValue(0)

  const animatedFrontStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1, 2, 3], [0, 0, 0, 1], 'clamp'),
    transform: [{ translateY: interpolate(progress.get(), [2, 3], [24, 0]) }],
  }))

  const animatedMiddleStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: interpolate(progress.get(), [0, 1, 2, 3], [0, 0, 1, 1], 'clamp'),
      transform: [
        { translateY: interpolate(progress.get(), [1, 2, 3], [24, 0, -28]) },
        { scale: interpolate(progress.get(), [2, 3], [1, 0.9], 'clamp') },
      ],
    }),
  )

  const animatedBackStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: interpolate(progress.get(), [0, 1, 2, 3], [0, 1, 1, 1], 'clamp'),
      transform: [
        { translateY: interpolate(progress.get(), [0, 1, 2, 3], [24, 0, -28, -54]) },
        { scale: interpolate(progress.get(), [1, 2, 3], [1, 0.9, 0.8], 'clamp') },
      ],
    }),
  )

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
    progress.set(withSpring(3, quickSpring))
  })

  return (
    <View style={styles.shuffleContainer}>
      {/* <ListCard /> */}
      <ListCard data={data[2]} style={animatedBackStyle} overlayStyle={animatedBackOverlayStyle} />
      <ListCard data={data[1]} style={animatedMiddleStyle} overlayStyle={animatedMiddleOverlayStyle} />
      <ListCard data={data[0]} style={animatedFrontStyle} overlayStyle={animatedFrontOverlayStyle} />
    </View>
  )
}

function ListCard({ style, overlayStyle, data }: ListCard) {
  return (
    <Animated.View style={[styles.shuffleCard, style]}>
      <Animated.View style={[styles.cardOverlay, overlayStyle]} />
      <Image source={data?.avatar} style={styles.avatar} />
      <View style={styles.textContainer}>
        <View style={[styles.namePlaceholder, { width: `${data?.nameWidth * 13}%` }]} />
        <View style={[styles.messagePlaceholder, { width: `${data?.messageWidth * 13}%` }]} />
      </View>
    </Animated.View>
  )
}
