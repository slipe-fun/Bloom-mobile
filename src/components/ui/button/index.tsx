import { quickSpring } from '@constants/easings'
import { BlurView } from 'expo-blur'
import React, { type ComponentProps, useMemo } from 'react'
import { Pressable, type StyleProp, Text, type TextStyle, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { styles } from './Button.styles'
import { SIZE_MAP, type Size } from './constats'

type Variant = 'icon' | 'text' | 'textIcon'

interface ButtonProps extends ComponentProps<typeof Pressable> {
  ref?: React.Ref<any>
  variant?: Variant
  label?: string
  size?: Size
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  icon?: React.JSX.Element | null | boolean
  children?: React.ReactNode
  blur?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export default function Button({
  ref,
  variant = 'text',
  label = '',
  size = 'md',
  children,
  icon,
  style,
  labelStyle,
  blur = false,
  ...props
}: ButtonProps) {
  const { theme } = useUnistyles()
  const opacity = useSharedValue(1)

  let paddingHorizontal = 0
  if (variant !== 'icon') {
    switch (size) {
      case 'sm':
      case 'md':
        paddingHorizontal = theme.spacing.lg
        break
      case 'lg':
      case 'xl':
        paddingHorizontal = theme.spacing.xl
        break
      default:
        paddingHorizontal = theme.spacing.lg
    }
  }

  const handlePress = (inn: boolean = true) => {
    opacity.value = withSpring(inn ? 0.8 : 1, quickSpring)
  }

  const animatedPressabelStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const buttonStyle = useMemo(
    () => styles.button({ size: SIZE_MAP[size], isIcon: variant === 'icon', paddingHorizontal, blur, isTextIcon: variant === 'textIcon' }),
    [size, variant, paddingHorizontal, blur],
  )
  return (
    <AnimatedPressable
      onPressIn={() => handlePress(true)}
      onPressOut={() => handlePress(false)}
      style={[buttonStyle, style, animatedPressabelStyle]}
      ref={ref}
      {...props}
    >
      {blur && (
        <BlurView style={StyleSheet.absoluteFill} experimentalBlurMethod="dimezisBlurView" intensity={40} tint="systemChromeMaterialDark" />
      )}
      {icon}
      {label && <Text style={[styles.label(SIZE_MAP[size]), labelStyle]}>{label}</Text>}
      {children}
    </AnimatedPressable>
  )
}
