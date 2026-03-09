import { base } from '@design/base'
import { useMemo } from 'react'
import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface Insets {
  top: number
  bottom: number
  realBottom: number
  realTop: number
}

export default function useInsets(): Insets {
  const insets = useSafeAreaInsets()

  return useMemo(() => {
    const isIos = Platform.OS === 'ios'
    const iosVersion = isIos ? parseInt(String(Platform.Version), 10) : 0
    const isIos26 = isIos && iosVersion >= 26

    const bottom = isIos ? (isIos26 ? base.spacing.xxxl : insets.bottom) : insets.bottom + base.spacing.sm

    const top = insets.top + base.spacing.sm

    return {
      top,
      bottom,
      realBottom: insets.bottom,
      realTop: insets.top,
    }
  }, [insets, base])
}
