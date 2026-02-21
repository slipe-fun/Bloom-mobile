/** biome-ignore-all lint/suspicious/noArrayIndexKey: true */
import { charAnimationIn, charAnimationOut, getFadeIn, getFadeOut, springy } from '@constants/animations'
import React, { useCallback, useEffect, useRef } from 'react'
import type { LayoutChangeEvent, ViewStyle } from 'react-native'
import { Pressable, TextInput, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './OtpInput.styles'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (v: string) => void
  autoFocus?: boolean
  separatorIndex?: number
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  autoFocus = false,
  separatorIndex = Math.floor(length / 2),
}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null)

  const indicatorX = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)
  const indicatorOpacity = useSharedValue(1)
  const cellLayouts = useRef<number[]>(Array(length).fill(0))

  const activeIndex = value.length
  const indicatorIndex = Math.min(activeIndex, length - 1)
  const isComplete = activeIndex === length

  const onPress = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const onChangeText = useCallback(
    (text: string) => {
      const cleaned = text.replace(/[^0-9]/g, '')
      if (cleaned.length <= length) {
        onChange(cleaned)
      }
    },
    [length, onChange],
  )

  const onLayoutCell = useCallback(
    (event: LayoutChangeEvent, index: number) => {
      const { x, width } = event.nativeEvent.layout
      cellLayouts.current[index] = x

      if (index === indicatorIndex && indicatorWidth.value === 0) {
        indicatorWidth.value = width
        indicatorX.value = x
      }
    },
    [indicatorIndex, indicatorWidth, indicatorX],
  )

  const indicatorStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [{ translateX: indicatorX.value }, { scale: interpolate(indicatorOpacity.get(), [0, 1], [1.2, 1]) }],
      width: indicatorWidth.value,
      opacity: indicatorOpacity.value,
    }),
  )

  useEffect(() => {
    const x = cellLayouts.current[indicatorIndex]
    if (x !== undefined && typeof x === 'number') {
      indicatorX.value = withSpring(x, springy)
    }

    indicatorOpacity.value = withSpring(isComplete ? 0 : 1, springy)
  }, [indicatorIndex, isComplete, indicatorX, indicatorOpacity])

  return (
    <Pressable onPress={onPress} style={styles.container} accessible={false}>
      <View style={styles.row} pointerEvents="none">
        <Animated.View style={[styles.indicator, indicatorStyle]} />

        {Array.from({ length }).map((_, i) => {
          const char = value[i]
          const isPlaceholder = !char

          return (
            <React.Fragment key={`cell-fragment-${i}`}>
              {i === separatorIndex && <View style={styles.separator} />}
              <View style={styles.cell} onLayout={(e) => onLayoutCell(e, i)}>
                {!isPlaceholder ? (
                  <Animated.Text
                    key={`char-${char}-${i}`}
                    entering={charAnimationIn()}
                    exiting={charAnimationOut()}
                    style={styles.char(false)}
                  >
                    {char}
                  </Animated.Text>
                ) : (
                  <Animated.Text key={`placeholder-${i}`} entering={getFadeIn()} exiting={getFadeOut()} style={styles.char(true)}>
                    0
                  </Animated.Text>
                )}
              </View>
            </React.Fragment>
          )
        })}
      </View>

      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        returnKeyType="done"
        maxLength={length}
        style={styles.hiddenInput}
        caretHidden
        autoFocus={autoFocus}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        importantForAutofill="yes"
        autoCorrect={false}
      />
    </Pressable>
  )
}
