import LottieView from 'lottie-react-native'
import { useImperativeHandle, useRef } from 'react'

export type AnimatedIconRef = {
  play: () => void
  reset: () => void
}

interface AnimatedIconProps {
  source: any
  size?: number
  loop?: boolean
  autoPlay?: boolean
  color?: string
  ref?: any
}

export default function AnimatedIcon({ source, size = 28, loop = false, autoPlay = false, color = '#ffffff', ref }: AnimatedIconProps) {
  const animationRef = useRef<LottieView>(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      animationRef.current?.play()
    },

    reset: () => {
      animationRef.current?.reset()
    },
  }))

  return (
    <LottieView
      ref={animationRef}
      source={source}
      loop={loop}
      autoPlay={autoPlay}
      resizeMode="contain"
      style={{
        width: size,
        height: size,
      }}
      colorFilters={[
        {
          keypath: 'Primary',
          color,
        },
      ]}
    />
  )
}
