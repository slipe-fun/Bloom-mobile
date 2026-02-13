import { normalSpring } from '@constants/easings'
import { Blur, Canvas, ColorMatrix, Group, Paint, Rect, RoundedRect } from '@shopify/react-native-skia'
import { useEffect, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { interpolate, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { scheduleOnRN } from 'react-native-worklets'
import { styles } from './Message.styles'

interface StatusBubbleProps {
  isActive: boolean
  width: number
  height: number
  setMountFinished: (value: boolean) => void
}

export default function StatusBubble({ isActive, width, height, setMountFinished }: StatusBubbleProps) {
  const { theme } = useUnistyles()
  const progress = useSharedValue(0)
  const { width: screenWidth } = useWindowDimensions()

  const canvasHeight = height * 2

  const cx2 = useDerivedValue(() => {
    const start = screenWidth + width
    const end = screenWidth - width - 32
    return interpolate(progress.value, [0, 1], [start, end])
  })

  const rectWidth = useDerivedValue(() => {
    const w = interpolate(progress.value, [1, 0], [width, width / 2])
    return w
  })

  const rectHeight = useDerivedValue(() => {
    const h = interpolate(progress.value, [1, 0], [height, height / 2])
    return h
  })

  const y = useDerivedValue(() => {
    const offset = interpolate(progress.value, [1, 0], [height / 2, height / 4])
    return offset
  })

  useEffect(() => {
    progress.value = withSpring(isActive ? 1 : 0, normalSpring, (_finished) => scheduleOnRN(setMountFinished, true))
  }, [isActive])

  const layer = useMemo(() => {
    return (
      <Paint>
        <Blur blur={6} />
        <ColorMatrix
          matrix={[
            // R, G, B, A, Bias (Offset)
            // prettier-ignore
            1, 0, 0, 0, 0,
            // prettier-ignore
            0, 1, 0, 0, 0,
            // prettier-ignore
            0, 0, 1, 0, 0,
            // prettier-ignore
            0, 0, 0, 20, -10,
          ]}
        />
      </Paint>
    )
  }, [])

  return (
    <Canvas style={styles.statusCanvas(canvasHeight)}>
      <Group layer={layer}>
        <Rect x={screenWidth - 16} y={0} width={screenWidth} height={canvasHeight} color={theme.colors.black} />
        <RoundedRect r={24} x={cx2} y={y} width={rectWidth} height={rectHeight} color={theme.colors.primary} />
      </Group>
    </Canvas>
  )
}
