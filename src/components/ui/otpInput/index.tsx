import { getCharEnter, getCharExit, getFadeIn, getFadeOut, springy } from '@constants/animations'
import React, { act, useCallback, useEffect, useRef } from 'react'
import type { LayoutChangeEvent, LayoutRectangle } from 'react-native'
import { Pressable, TextInput, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { styles } from './OtpInput.styles'

type OTPInputProps = {
  length?: number
  value: string
  onChange: (v: string) => void
}

export default function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
  const inputRef = useRef<TextInput>(null)
  const activeIndex = Math.min(value.length, length)
  const indicatorX = useSharedValue(0)
  const indicatorWidth = useSharedValue(0)
  const layouts = useRef<(LayoutRectangle | undefined)[]>([])

  const onPress = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const onChangeText = useCallback(
    (text: string) => {
      const numericText = text.replace(/[^0-9]/g, '')
      if (numericText.length <= length) {
        onChange(numericText)
      }
    },
    [length, onChange],
  )

  const onLayoutCell = useCallback(
    (event: LayoutChangeEvent, index: number) => {
      const layout = event.nativeEvent.layout
      layouts.current[index] = layout

      if (index === activeIndex && indicatorWidth.value === 0) {
        indicatorWidth.value = layout.width
      }
    },
    [activeIndex],
  )

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorWidth.value || 0,
  }))

  useEffect(() => {
    const layout = layouts.current[activeIndex]
    if (layout && typeof layout.x === 'number') {
      indicatorX.value = withSpring(layout.x, springy)
    }
  }, [activeIndex, indicatorX, indicatorWidth])

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.row}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />
        {Array.from({ length }).map((_, i) => {
          const showSeparator = i === 3

          const char = value[i] ?? ''
          return (
            <>
              {showSeparator && <View key={`${i}-separator`} style={styles.separator} />}
              <View key={i} style={styles.cell} onLayout={(e) => onLayoutCell(e, i)}>
                {char ? (
                  <Animated.Text key={`char-${char}`} entering={getCharEnter()} exiting={getCharExit()} style={styles.char(false)}>
                    {char}
                  </Animated.Text>
                ) : (
                  <Animated.Text entering={getFadeIn()} exiting={getFadeOut()} key={`placeholder-${i}`} style={styles.char(true)}>
                    0
                  </Animated.Text>
                )}
              </View>
            </>
          )
        })}
      </View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        maxLength={length}
        style={styles.hiddenInput}
        autoFocus={false}
        caretHidden={true}
      />
    </Pressable>
  )
}
