import useStorageStore from '@stores/storage'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { useKeyboardState, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import type { SharedValue } from 'react-native-reanimated'

interface UseChatKeyboard {
  progress: SharedValue<number>
  height: number
}

const FALLBACK_HEIGHT = Platform.OS === 'ios' ? 320 : 300

export default function useChatKeyboard(): UseChatKeyboard {
  const mmkv = useStorageStore((state) => state.mmkv)
  const keyboardHeight = useKeyboardState((s) => s.height)
  const { progress } = useReanimatedKeyboardAnimation()
  const [height, setHeight] = useState<number>(() => {
    const stored = mmkv.getNumber('keyboardHeight')
    return stored ? stored : FALLBACK_HEIGHT
  })

  const hasSavedRealHeight = useRef(false)

  useEffect(() => {
    if (keyboardHeight === height) return

    setHeight(keyboardHeight)

    if (!hasSavedRealHeight.current) {
      mmkv.set('keyboardHeight', keyboardHeight)
      hasSavedRealHeight.current = true
    }
  }, [keyboardHeight, height, mmkv])

  return { progress, height }
}
