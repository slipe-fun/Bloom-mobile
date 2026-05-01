import { authAnimationIn, quickSpring, springy, springyChar } from '@constants/animations'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './Title.styles'

const HoverableElement = ({ index, hoveredIndex, onLayout, children }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const isHovered = hoveredIndex.value === index
    const isAnyHovered = hoveredIndex.value !== -1

    return {
      transform: [{ scale: withSpring(isHovered ? 1.35 : 1, springy) }],
      opacity: withSpring(isAnyHovered && !isHovered ? 0.35 : 1, quickSpring),
      zIndex: isHovered ? 1 : 0,
    }
  })

  return (
    <Animated.View onLayout={(e) => onLayout(index, e.nativeEvent.layout)} style={animatedStyle}>
      {children}
    </Animated.View>
  )
}

export default function AuthTitle() {
  const { t } = useTranslation('auth')

  const hoveredIndex = useSharedValue(-1)
  const layouts = useSharedValue({})

  const layoutsRef = useRef({})

  const handleLayout = (index, layout) => {
    layoutsRef.current[index] = layout
    layouts.value = { ...layoutsRef.current }
  }

  const updateHover = (x, y) => {
    'worklet'
    let found = -1
    const currentLayouts = layouts.value

    for (let i = 0; i < 5; i++) {
      const layout = currentLayouts[i]
      if (layout) {
        if (x >= layout.x && x <= layout.x + layout.width && y >= layout.y && y <= layout.y + layout.height) {
          found = i
          break
        }
      }
    }
    hoveredIndex.value = found
  }

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => updateHover(e.x, e.y))
    .onChange((e) => updateHover(e.x, e.y))
    .onFinalize(() => {
      hoveredIndex.value = -1
    })

  const descriptionStyle = useAnimatedStyle(() => {
    const isAnyHovered = hoveredIndex.value !== -1
    return {
      opacity: withSpring(isAnyHovered ? 0.35 : 1, quickSpring),
    }
  })

  return (
    <View style={styles.titleContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          entering={authAnimationIn(springyChar(1, true))}
          style={[styles.bloom, { flexDirection: 'row', alignItems: 'center' }]}
        >
          <HoverableElement index={0} hoveredIndex={hoveredIndex} onLayout={handleLayout}>
            <Text style={styles.char}>B</Text>
          </HoverableElement>

          <HoverableElement index={1} hoveredIndex={hoveredIndex} onLayout={handleLayout}>
            <Text style={styles.char}>L</Text>
          </HoverableElement>

          <HoverableElement index={2} hoveredIndex={hoveredIndex} onLayout={handleLayout}>
            <Image style={{ width: 64, height: 64 }} source={require('@assets/auth/eyes.png')} />
          </HoverableElement>

          <HoverableElement index={3} hoveredIndex={hoveredIndex} onLayout={handleLayout}>
            <Text style={styles.char}>M</Text>
          </HoverableElement>

          <HoverableElement index={4} hoveredIndex={hoveredIndex} onLayout={handleLayout}>
            <Text style={styles.char}>!</Text>
          </HoverableElement>
        </Animated.View>
      </GestureDetector>

      <Animated.Text entering={authAnimationIn(springyChar(2, true))} style={[styles.description, descriptionStyle]}>
        {t('auth:welcome.subtitle')}
      </Animated.Text>
    </View>
  )
}
