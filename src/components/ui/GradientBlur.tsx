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

interface GradientBlurProps {
  direction?: GradientDirection
  ref?: React.Ref<MaskedView>
  style?: StyleProp<ViewStyle>
  keyboard?: boolean
}

export default function GradientBlur({ direction = 'bottom-to-top', ref, style, keyboard }: GradientBlurProps) {
  const { theme } = useUnistyles()
  const insets = useInsets()

  const gradientStyles = [StyleSheet.absoluteFill, keyboard ? styles.gradient(insets.bottom) : null, style]

  const { start, end } = useMemo(() => {
    switch (direction) {
      case 'top-to-bottom':
        return { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } }
      case 'bottom-left-to-top-right':
        return { start: { x: 0.5, y: 0 }, end: { x: 1, y: 1 } }
      default:
        return { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } }
    }
  }, [direction])

  const { colors, locations } = useMemo(
    () =>
      easeGradient({
        colorStops: {
          0: { color: theme.colors.gradientBlurEnd },
          0.5: { color: theme.colors.gradientBlurStart },
          1: { color: theme.colors.gradientBlurMiddle },
        },
      }),
    [theme],
  )

  return (
    <>
      {Platform.OS !== 'android' && (
        <MaskedView
          ref={ref}
          style={gradientStyles}
          maskElement={
            <LinearGradient start={start} end={end} locations={locations as any} colors={colors as any} style={StyleSheet.absoluteFill} />
          }
        >
          <BlurView style={StyleSheet.absoluteFill} intensity={30} tint="systemChromeMaterialDark" />
        </MaskedView>
      )}

      <LinearGradient start={start} end={end} locations={locations as any} colors={colors as any} style={gradientStyles} />
    </>
  )
}

const styles = StyleSheet.create({
  gradient: (bottom: number) => ({
    transform: [{ translateY: bottom }],
  }),
})
