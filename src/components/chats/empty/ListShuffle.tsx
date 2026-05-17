import { quickSpring } from '@constants/animations'
import { data } from '@constants/emptyStates'
import type { ChatsEmptyCardData } from '@interfaces'
import { useEffect } from 'react'
import { Image, View, type ViewStyle } from 'react-native'
import Animated, {
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
} from 'react-native-reanimated'
import { styles } from './Empty.styles'

interface ListCardProps {
  data: ChatsEmptyCardData
  index: number
  progress: SharedValue<number>
}

const CARDS_ANIMATION_CONFIG = [
  {
    opacity: [0, 0, 0, 1],
    translateY: [24, 24, 24, 0],
    scale: [1, 1, 1, 1],
    overlayOpacity: [1, 1, 1, 0],
  },
  {
    opacity: [0, 0, 1, 1],
    translateY: [24, 24, 0, -28],
    scale: [1, 1, 1, 0.9],
    overlayOpacity: [1, 1, 0, 0.4],
  },
  {
    opacity: [0, 1, 1, 1],
    translateY: [24, 0, -28, -54],
    scale: [1, 1, 0.9, 0.8],
    overlayOpacity: [1, 0, 0.4, 0.8],
  },
]

export default function ListShuffle() {
  const progress = useSharedValue(1)

  useEffect(() => {
    progress.set(
      withRepeat(
        withSequence(
          withDelay(1500, withSpring(1, quickSpring)),
          withDelay(1500, withSpring(2, quickSpring)),
          withDelay(1500, withSpring(3, quickSpring)),
        ),
        -1,
      ),
    )
  }, [])

  return (
    <View style={styles.shuffleContainer}>
      {[2, 1, 0].map((index) => (
        <ListCard key={index} data={data[index]} index={index} progress={progress} />
      ))}
    </View>
  )
}

function ListCard({ data, index, progress }: ListCardProps) {
  const config = CARDS_ANIMATION_CONFIG[index]

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: interpolate(progress.get(), [0, 1, 2, 3], config.opacity, 'clamp'),
      transform: [
        { translateY: interpolate(progress.get(), [0, 1, 2, 3], config.translateY, 'clamp') },
        { scale: interpolate(progress.get(), [0, 1, 2, 3], config.scale, 'clamp') },
      ],
    }),
  )

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.get(), [0, 1, 2, 3], config.overlayOpacity, 'clamp'),
  }))

  const nameWidth = (data.nameWidth ?? 0) * 13
  const messageWidth = (data.messageWidth ?? 0) * 13

  return (
    <Animated.View style={[styles.shuffleCard, animatedStyle]}>
      <Animated.View style={[styles.cardOverlay, overlayStyle]} />
      {data?.avatar && <Image source={data.avatar} style={styles.avatar} />}
      <View style={styles.textContainer}>
        <View style={[styles.namePlaceholder, { width: `${nameWidth}%` }]} />
        <View style={[styles.messagePlaceholder, { width: `${messageWidth}%` }]} />
      </View>
    </Animated.View>
  )
}
