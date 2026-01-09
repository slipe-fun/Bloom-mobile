import { useInsets } from '@hooks'
import MaskedView from '@react-native-masked-view/masked-view'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import type React from 'react'
import { useMemo } from 'react'
import { Platform, type StyleProp, type ViewStyle } from 'react-native'
import { easeGradient } from 'react-native-easing-gradient'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

type GradientDirection = 'top-to-bottom' | 'bottom-to-top' | 'bottom-left-to-top-right'

type GradientBlurProps = {
  direction?: GradientDirection
  ref?: React.Ref<MaskedView>
  style?: StyleProp<ViewStyle>
  keyboard?: boolean
}

export default function GradientBlur({ direction = 'bottom-to-top', ref, style, keyboard }: GradientBlurProps) {
  const { theme } = useUnistyles()
  const insets = useInsets()

  const { start, end } = useMemo(() => {
    switch (direction) {
      case 'top-to-bottom':
        return { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0.5 } }
      case 'bottom-left-to-top-right':
        return { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } }
      default:
        return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 0.5 } }
    }
  }, [direction])

  const { colors, locations } = useMemo(
    () =>
      easeGradient({
        colorStops: {
          0: { color: 'transparent' },
          0.5: { color: theme.colors.background },
          1: { color: theme.colors.background },
        },
      }),
    [theme.colors.background],
  )

  return (
    <>
      {Platform.OS !== 'android' && (
        <MaskedView
          ref={ref}
          style={[StyleSheet.absoluteFill, style]}
          maskElement={
            <LinearGradient start={start} end={end} locations={locations as any} colors={colors as any} style={StyleSheet.absoluteFill} />
          }
        >
          <BlurView style={StyleSheet.absoluteFill} intensity={16} tint="systemChromeMaterialDark" />
        </MaskedView>
      )}

      <LinearGradient
        start={start}
        end={end}
        colors={['transparent', theme.colors.gradientBlur]}
        style={[StyleSheet.absoluteFill, keyboard ? styles.gradient(insets.bottom) : null, style]}
      />
    </>
  )
}

const styles = StyleSheet.create({
  gradient: (bottom: number) => ({
    transform: [{ translateY: bottom }],
  }),
})
