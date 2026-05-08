import { styles } from '@components/settings/Header.styles'
import { Avatar } from '@components/ui'
import { SIZE_MAP } from '@components/ui/avatar'
import { useInsets } from '@hooks'
import type { User } from '@interfaces'
import type { SkImage } from '@shopify/react-native-skia'
import { Blur, Canvas, Fill, Group, Image, makeImageFromView, Paint, Shader } from '@shopify/react-native-skia'
import useSettingsScreenStore from '@stores/settings'
import { useEffect, useMemo, useRef, useState } from 'react'
import { AppState, useWindowDimensions, type View } from 'react-native'
import Animated, { interpolate, type SharedValue, useAnimatedStyle, useDerivedValue, useSharedValue } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import { gooeyShader } from './shader'

interface HeaderAvatarProps {
  scrollY: SharedValue<number>
  user: User
  loading: boolean
}

const ISLAND_WIDTH = 90
const ISLAND_HEIGHT = 32
const IMAGE_BLUR = 20
const ISLAND_Y = ISLAND_HEIGHT / 2
const ISLAND_R = 0
const CARD_SIZE = SIZE_MAP['2xl']
const CARD_R = CARD_SIZE / 2

export default function HeaderAvatar({ scrollY, user, loading }: HeaderAvatarProps) {
  const insets = useInsets()
  const { width } = useWindowDimensions()

  const snapEndPosition = useSettingsScreenStore((state) => state.snapEndPosition)
  const headerHeight = useSettingsScreenStore((state) => state.headerHeight)

  const avatarRef = useRef<View>(null)
  const [capturedImage, setCapturedImage] = useState<SkImage | null>(null)
  const isFocused = useSharedValue(AppState.currentState === 'active')

  const { START_Y, CENTER_X, CANVAS_HEIGHT } = useMemo(() => {
    const startY = insets.top + 15
    return {
      START_Y: startY,
      CENTER_X: width / 2,
      CANVAS_HEIGHT: CARD_SIZE + startY,
    }
  }, [insets.top, width])

  const cardY = useDerivedValue(() => Math.min(START_Y, START_Y - scrollY.value))

  const animationProgress = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, CANVAS_HEIGHT / 1.5], [1, 0.1], 'clamp')
  })

  const currentRadius = useDerivedValue(() => CARD_R * animationProgress.value)

  const uniforms = useDerivedValue(() => {
    return {
      islandCenter: [CENTER_X, ISLAND_Y],
      islandHalfSize: [ISLAND_WIDTH / 2, ISLAND_Y],
      islandRadius: ISLAND_R,
      ballCenter: [CENTER_X, cardY.value + CARD_R],
      ballRadius: currentRadius.value,
      gooeyness: 35.0,
    }
  })

  const clipRRect = useDerivedValue(() => {
    const r = currentRadius.value
    return {
      rect: { x: CENTER_X - r, y: cardY.value + CARD_R - r, width: r * 2, height: r * 2 },
      rx: r,
      ry: r,
    }
  })

  const imageBlur = useDerivedValue(() => {
    return interpolate(scrollY.value, [0, CANVAS_HEIGHT / 1.5], [0, IMAGE_BLUR], 'clamp')
  })

  const canvasAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: scrollY.value > 0.01 && isFocused.value ? 1 : 0,
      transform: [{ translateY: interpolate(scrollY.value, [0, headerHeight / 1.62], [0, snapEndPosition], 'clamp') }],
    }),
    [headerHeight, snapEndPosition],
  )

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrollY.value > 0.01 ? 0 : 1,
    top: START_Y,
    position: 'absolute',
    width: 100,
    height: 100,
  }))

  const captureAvatar = async () => {
    await new Promise(requestAnimationFrame)

    if (avatarRef.current && !loading) {
      try {
        const snapshot = await makeImageFromView(avatarRef)
        setCapturedImage((prevImage) => {
          if (prevImage) {
            prevImage.dispose()
          }
          return snapshot
        })
      } catch (error) {
        console.warn('Failed to capture avatar img:', error)
      }
    }
  }

  useEffect(() => {
    return () => {
      capturedImage?.dispose()
    }
  }, [capturedImage])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      isFocused.set(nextAppState === 'active')
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
              <Group clip={clipRRect}>
                <Image image={capturedImage} x={CENTER_X - CARD_R} y={cardY} width={CARD_SIZE} height={CARD_SIZE} fit="cover" />
              </Group>
            </Group>
          )}
        </Canvas>
      </Animated.View>
      <Transition.Boundary.View ref={avatarRef as any} style={avatarAnimatedStyle} id="avatar">
        <Avatar size="2xl" onLoadEnd={captureAvatar} style={styles.avatar} image={user.avatar} userId={user.id} />
      </Transition.Boundary.View>
    </>
  )
}
