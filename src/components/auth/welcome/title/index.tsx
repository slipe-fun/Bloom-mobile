import { authAnimationIn, quickSpring, springy, springyChar } from '@constants/animations'
import { useTranslation } from 'react-i18next'
import { Image, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { scheduleOnUI } from 'react-native-worklets'
import { styles } from './Title.styles'

const ITEMS = ['B', 'L', 'img', 'M', '!'] as const

const Hoverable = ({ i, hovered, onLayout, children }) => {
  const style = useAnimatedStyle(() => {
    'worklet'
    const h = hovered.value === i
    const any = hovered.value !== -1

    return {
      transform: [{ scale: withSpring(h ? 1.35 : 1, springy) }],
      opacity: withSpring(any && !h ? 0.35 : 1, quickSpring),
      zIndex: h ? 1 : 0,
    }
  })

  return (
    <Animated.View onLayout={(e) => onLayout(i, e.nativeEvent.layout)} style={style}>
      {children}
    </Animated.View>
  )
}

export default function AuthTitle() {
  const { t } = useTranslation('auth')

  const hovered = useSharedValue(-1)
  const layouts = useSharedValue([])

  const onLayout = (i, l) => {
    scheduleOnUI(
      (index, layout) => {
        'worklet'
        const next = [...layouts.value]
        next[index] = layout
        layouts.value = next
      },
      i,
      l,
    )
  }

  const update = (x, y) => {
    'worklet'
    const arr = layouts.value

    for (let i = 0; i < arr.length; i++) {
      const l = arr[i]
      if (l && x >= l.x && x <= l.x + l.width && y >= l.y && y <= l.y + l.height) {
        hovered.value = i
        return
      }
    }

    hovered.value = -1
  }

  const gesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => update(e.x, e.y))
    .onChange((e) => update(e.x, e.y))
    // biome-ignore lint/suspicious/noAssignInExpressions: <explation>
    .onFinalize(() => (hovered.value = -1))

  const descStyle = useAnimatedStyle(() => ({
    opacity: withSpring(hovered.value !== -1 ? 0.35 : 1, quickSpring),
  }))

  return (
    <View style={styles.titleContainer}>
      <GestureDetector gesture={gesture}>
        <Animated.View entering={authAnimationIn(springyChar(1, true))} style={styles.row}>
          {ITEMS.map((item, i) => (
            <Hoverable key={item} i={i} hovered={hovered} onLayout={onLayout}>
              {item === 'img' ? (
                <Image source={require('@assets/auth/eyes.png')} style={styles.eye} />
              ) : (
                <Text style={styles.char}>{item}</Text>
              )}
            </Hoverable>
          ))}
        </Animated.View>
      </GestureDetector>

      <Animated.Text entering={authAnimationIn(springyChar(2, true))} style={[styles.description, descStyle]}>
        {t('auth:welcome.subtitle')}
      </Animated.Text>
    </View>
  )
}
