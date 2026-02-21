import { charAnimationIn, charAnimationOut, getFadeIn, getFadeOut, springy } from '@constants/animations'
import React, { useCallback, useEffect, useRef } from 'react'
import type { LayoutChangeEvent } from 'react-native'
import { Pressable, TextInput, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './OtpInput.styles'

interface OTPInputProps {
  length?: number
  value: string
  onChange: (v: string) => void
}

export default function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
  const inputRef = useRef<TextInput>(null)
  const indicatorX = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)
  const cellLayouts = useRef<number[]>(Array(length).fill(0))

  const activeIndex = Math.min(value.length, length)

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

      if (index === activeIndex && indicatorWidth.value === 0) {
        indicatorWidth.value = width
        indicatorX.value = x
      }
    },
    [activeIndex],
  )

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(indicatorX.value, springy) }],
    width: indicatorWidth.value,
  }))

  useEffect(() => {
    const x = cellLayouts.current[activeIndex]
    if (x !== undefined && typeof x === 'number') {
      indicatorX.value = withSpring(x, springy)
    }
  }, [activeIndex])

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />
        {Array.from({ length }).map((_, i) => {
          const char = value[i]
          return (
            <React.Fragment key={char}>
              {i === 3 && <View style={styles.separator} />}

              <View style={styles.cell} onLayout={(e) => onLayoutCell(e, i)}>
                {char ? (
                  <Animated.Text key={char} entering={charAnimationIn()} exiting={charAnimationOut()} style={styles.char(false)}>
                    {char}
                  </Animated.Text>
                ) : (
                  <Animated.Text key={char} entering={getFadeIn()} exiting={getFadeOut()} style={styles.char(true)}>
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
      />
    </Pressable>
  )
}
