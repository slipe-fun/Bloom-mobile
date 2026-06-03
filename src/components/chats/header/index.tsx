import { useWebSocket } from '@api/providers/WebSocketContext'
import { Avatar, GradientBlur } from '@components/ui'
import { getFadeIn, getFadeOut, springy } from '@constants/animations'
import { ICON_PRESSABLE_SCALE } from '@constants/animations/values'
import { useInsets } from '@hooks'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import Animated, { type SharedValue, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import { styles } from './header.styles'
import Title from './Title'

interface HeaderProps {
  scrollY: SharedValue<number>
}

export type Status = 'connected' | 'connecting'

const AnimatedAvatar = Animated.createAnimatedComponent(Avatar)

export default function Header({ scrollY }: HeaderProps) {
  const ws = useWebSocket()
  const insets = useInsets()
  const { push } = useRouter()
  const [status, setStatus] = useState<Status>('connecting')
  const scale = useSharedValue(1)

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? ICON_PRESSABLE_SCALE : 1, springy))
  }

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, -scrollY.get() / 5) }],
  }))

  useEffect(() => {
    if (ws?.readyState === ws?.OPEN) {
      setStatus('connected')
    } else {
      setStatus('connecting')
    }
  }, [ws])

  return (
    <Animated.View style={[styles.header(insets.top), animatedStyle]}>
      <GradientBlur direction="top-to-bottom" />
      <Title scrollY={scrollY} state={status} />
      <Transition.Boundary.Trigger
        onTouchStart={() => handlePress(true)}
        onTouchMove={() => handlePress(false)}
        onTouchEnd={() => handlePress(false)}
        // @ts-expect-error
        entering={getFadeIn()}
        exiting={getFadeOut()}
        id="avatar"
        onPress={() => push('/(app)/Settings')}
      >
        <AnimatedAvatar
          style={[styles.avatar, animatedAvatarStyle]}
          image="https://i.pinimg.com/736x/77/5b/a5/775ba539f6a59d678ee01d0353646e88.jpg"
          size="md"
          userId="dk3k293KK"
        />
      </Transition.Boundary.Trigger>
    </Animated.View>
  )
}
