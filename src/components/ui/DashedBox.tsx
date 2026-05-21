import { useEffect, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import Svg, { Rect } from 'react-native-svg'

const AnimatedRect = Animated.createAnimatedComponent(Rect)

export default function SeamlessDashedBorder({
  children,
  width,
  height,
  borderRadius = 26,
  dashLength = 15,
  gapLength = 15,
  strokeWidth = 4,
  strokeColor = '#000',
  duration = 1500,
}) {
  const dashOffset = useSharedValue(0)

  const inset = strokeWidth / 2
  const rectWidth = width - strokeWidth
  const rectHeight = height - strokeWidth
  const r = borderRadius

  const { actualDash, actualGap, actualPattern } = useMemo(() => {
    const perimeter = 2 * (rectWidth - 2 * r) + 2 * (rectHeight - 2 * r) + 2 * Math.PI * r

    const desiredPattern = dashLength + gapLength

    const dashCount = Math.max(1, Math.round(perimeter / desiredPattern))

    const pattern = perimeter / dashCount

    return {
      actualDash: pattern * (dashLength / desiredPattern),
      actualGap: pattern * (gapLength / desiredPattern),
      actualPattern: pattern,
    }
  }, [rectWidth, rectHeight, r, dashLength, gapLength])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dashOffset.get(),
  }))

  useEffect(() => {
    dashOffset.set(0)
    dashOffset.set(
      withRepeat(
        withTiming(-actualPattern, {
          duration: duration,
          easing: Easing.linear,
        }),
        -1,
        false,
      ),
    )
  }, [actualPattern, duration])

  return (
    <View style={[{ width, height }, styles.container]}>
      <View style={styles.svgWrapper}>
        <Svg width="100%" height="100%">
          <AnimatedRect
            x={inset}
            y={inset}
            width={rectWidth}
            height={rectHeight}
            rx={r}
            ry={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${actualDash}, ${actualGap}`}
            strokeLinecap="round"
            animatedProps={animatedProps}
          />
        </Svg>
      </View>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
})
