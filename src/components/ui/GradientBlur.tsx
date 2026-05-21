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
  behindKeyboard?: boolean
}

const DIRECTIONS: Record<GradientDirection, { start: { x: number; y: number }; end: { x: number; y: number } }> = {
  'top-to-bottom': { start: { x: 0.5, y: 1 }, end: { x: 0.5, y: 0 } },
  'bottom-left-to-top-right': { start: { x: 0.5, y: 0 }, end: { x: 1, y: 1 } },
  'bottom-to-top': { start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
}

export default function GradientBlur({ direction = 'bottom-to-top', ref, style, keyboard, gray, behindKeyboard }: GradientBlurProps) {
  const { theme, rt } = useUnistyles()
  const insets = useInsets()

  const isDark = rt.themeName.includes('dark')
  const tint: BlurTint = gray ? (isDark ? 'dark' : 'light') : isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'

  const { mask, grad } = useMemo(() => {
    const c = theme.colors
    const [cEnd, cMid, cStart] = gray
      ? [c.grayGradientBlurEnd, c.grayGradientBlurMiddle, c.grayGradientBlurStart]
      : [c.gradientBlurEnd, c.gradientBlurMiddle, c.gradientBlurStart]

    const easing = Easing.bezier(0.42, 0, 0.58, 1)
    const extraColorStopsPerTransition = 20

    return {
      mask: easeGradient({
        colorStops: {
          0: { color: cEnd },
          [behindKeyboard ? 0.085 : 0.4]: { color: cMid },
          1: { color: cStart },
        },
        easing,
        extraColorStopsPerTransition,
      }),
      grad: easeGradient({
        colorStops: {
          0: { color: cEnd },
          [behindKeyboard ? 0.2 : 0.85]: { color: cStart },
        },
        easing,
        extraColorStopsPerTransition,
      }),
    }
  }, [theme, gray, behindKeyboard])

  const gradientStyles = [StyleSheet.absoluteFill, keyboard && { transform: [{ translateY: insets.bottom }] }, style]

  const { start, end } = DIRECTIONS[direction]

  return (
    <>
      <MaskedView
        ref={ref}
        pointerEvents="none"
        style={gradientStyles}
        maskElement={
          <LinearGradient
            start={start}
            end={end}
            locations={mask.locations as any}
            colors={mask.colors as any}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <BlurView style={StyleSheet.absoluteFill} intensity={25} tint={tint} />
      </MaskedView>
      <LinearGradient
        pointerEvents="none"
        start={start}
        end={end}
        locations={grad.locations as any}
        colors={grad.colors as any}
        style={gradientStyles}
      />
    </>
  )
}
