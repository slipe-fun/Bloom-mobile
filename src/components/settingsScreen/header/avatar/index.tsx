import { Avatar } from '@components/ui'
import { useInsets } from '@hooks'
import type { User } from '@interfaces'
import type { SkImage } from '@shopify/react-native-skia'
import { Blur, Canvas, Fill, Group, Image, makeImageFromView, Paint, Shader, Skia } from '@shopify/react-native-skia'
import useSettingsScreenStore from '@stores/settings'
import { useEffect, useRef, useState } from 'react'
import { AppState, Platform, useWindowDimensions, type View } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import { gooeyShader } from './shader'

interface HeaderAvatarProps {
  scrollY: SharedValue<number>
  user: User
}

export default function HeaderAvatar({ scrollY, user }: HeaderAvatarProps) {
  const insets = useInsets()
  const START_Y = insets.top + 15

  const snapEndPosition = useSettingsScreenStore((state) => state.snapEndPosition)
  const { width } = useWindowDimensions()
  const avatarRef = useRef<View>(null)
  const [capturedImage, setCapturedImage] = useState<SkImage | null>(null)
  const isFocused = useSharedValue(AppState.currentState === 'active')

  const CENTER_X = width / 2
  const ISLAND_WIDTH = 90
  const ISLAND_HEIGHT = 32
  const ISLAND_Y = Platform.OS === 'android' ? -ISLAND_HEIGHT : ISLAND_HEIGHT / 2
  const ISLAND_R = 0

  const CARD_SIZE = 100
  const CARD_R = CARD_SIZE / 2
  const CANVAS_HEIGHT = CARD_SIZE + START_Y

  const cardY = useDerivedValue(() => Math.min(START_Y, START_Y - scrollY.value))

  const animationProgress = useDerivedValue(() => {
    return interpolate(cardY.value, [-ISLAND_Y, START_Y], [0.35, 1], 'clamp')
  })

  const currentRadius = useDerivedValue(() => CARD_R * animationProgress.value)

  const uniforms = useDerivedValue(() => {
    return {
      islandCenter: [CENTER_X, ISLAND_Y],
      islandHalfSize: [ISLAND_WIDTH / 2, ISLAND_Y],
      islandRadius: ISLAND_R,
      ballCenter: [CENTER_X, cardY.value + CARD_R],
      ballRadius: currentRadius.value,
      gooeyness: 40.0,
    }
  })

  const clipPath = useDerivedValue(() => {
    const path = Skia.Path.Make()
    path.addCircle(CENTER_X, cardY.value + CARD_R, currentRadius.value)
    return path
  })

  const imageBlur = useDerivedValue(() => {
    return interpolate(cardY.value, [-ISLAND_Y, START_Y], [8, 0], 'clamp')
  })

  const canvasAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value > 0.01 && isFocused.value ? 1 : 0,
    transform: [{ translateY: interpolate(scrollY.value, [0, snapEndPosition], [0, snapEndPosition], 'clamp') }],
  }))

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value > 0.01 ? 0 : 1,
    top: START_Y,
    position: 'absolute',
  }))

  useEffect(() => {
    let isMounted = true

    const captureAvatar = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))

      if (isMounted && avatarRef.current) {
        try {
          const snapshot = await makeImageFromView(avatarRef)
          if (isMounted) {
            setCapturedImage(snapshot)
          }
        } catch (error) {
          console.warn('Failed to capture avatar image:', error)
        }
      }
    }

    captureAvatar()

    return () => {
      isMounted = false
    }
  }, [user])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      isFocused.value = nextAppState === 'active'
    })

    return () => {
      subscription.remove()
    }
  }, [isFocused])
  return (
    <>
      <Animated.View style={[{ width: '100%', height: CANVAS_HEIGHT, zIndex: 10 }, canvasAnimatedStyle]} pointerEvents="none">
        <Canvas style={{ flex: 1, backgroundColor: 'transparent' }}>
          <Fill>
            <Shader source={gooeyShader} uniforms={uniforms} />
          </Fill>
          {capturedImage && (
            <Group
              layer={
                <Paint blendMode="srcATop" opacity={animationProgress}>
                  <Blur blur={imageBlur} />
                </Paint>
              }
            >
              <Group clip={clipPath}>
                <Image image={capturedImage} x={CENTER_X - CARD_R} y={cardY} width={CARD_SIZE} height={CARD_SIZE} fit="cover" />
              </Group>
            </Group>
          )}
        </Canvas>
      </Animated.View>

      <Animated.View ref={avatarRef} collapsable={false} style={avatarAnimatedStyle}>
        <Avatar size="2xl" image={user?.avatar} username={user?.username || user?.display_name} />
      </Animated.View>
    </>
  )
}
