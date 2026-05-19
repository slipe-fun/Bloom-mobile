import { useInsets } from '@hooks'
import MaskedView from '@react-native-masked-view/masked-view'
import { type BlurTint, BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import type React from 'react'
import { useMemo } from 'react'
import { Easing, type StyleProp, type ViewStyle } from 'react-native'
import { easeGradient } from 'react-native-easing-gradient'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

type GradientDirection = 'top-to-bottom' | 'bottom-to-top' | 'bottom-left-to-top-right'

interface GradientBlurProps {
  direction?: GradientDirection
  ref?: React.Ref<MaskedView>
  style?: StyleProp<ViewStyle>
  keyboard?: boolean
  gray?: boolean
}

export default function GradientBlur({ direction = 'bottom-to-top', ref, style, keyboard, gray }: GradientBlurProps) {
  const { theme, rt } = useUnistyles()
  const insets = useInsets()

  const gradientStyles = [StyleSheet.absoluteFill, keyboard ? styles.gradient(insets.bottom) : null, style]

  const tint: BlurTint = rt.themeName.includes('dark')
    ? !gray
      ? 'systemChromeMaterialDark'
      : 'dark'
    : !gray
      ? 'systemChromeMaterialLight'
      : 'light'

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
        colorStops: !gray
          ? {
              0: { color: theme.colors.gradientBlurEnd },
              0.4: { color: theme.colors.gradientBlurMiddle },
              1: { color: theme.colors.gradientBlurStart },
            }
          : {
              0: { color: theme.colors.grayGradientBlurEnd },
              0.4: { color: theme.colors.grayGradientBlurMiddle },
              1: { color: theme.colors.grayGradientBlurStart },
            },
        easing: Easing.bezier(0.42, 0, 0.58, 1),
        extraColorStopsPerTransition: 20,
      }),
    [theme, gray],
  )

  const { colors: gradientColors, locations: gradientLocations } = useMemo(
    () =>
      easeGradient({
        colorStops: !gray
          ? {
              0: { color: theme.colors.gradientBlurEnd },
              0.85: { color: theme.colors.gradientBlurStart },
            }
          : {
              0: { color: theme.colors.grayGradientBlurEnd },
              0.85: { color: theme.colors.grayGradientBlurStart },
            },
        easing: Easing.bezier(0.42, 0, 0.58, 1),
        extraColorStopsPerTransition: 20,
      }),
    [theme],
  )
  return (
    <>
      <MaskedView
        ref={ref}
        pointerEvents="none"
        style={gradientStyles}
        maskElement={
          <LinearGradient start={start} end={end} locations={locations as any} colors={colors as any} style={StyleSheet.absoluteFill} />
        }
      >
        <BlurView style={StyleSheet.absoluteFill} intensity={25} tint={tint} />
      </MaskedView>
      <LinearGradient
        pointerEvents="none"
        start={start}
        end={end}
        // onLayout={(e) => console.log(e.nativeEvent.layout)}
        locations={gradientLocations as any}
        colors={gradientColors as any}
        style={gradientStyles}
      />
    </>
  )
}

const styles = StyleSheet.create({
  gradient: (bottom: number) => ({
    transform: [{ translateY: bottom }],
  }),
})
