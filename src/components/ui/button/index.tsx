import { springy } from '@constants/animations'
import { ICON_PRESSABLE_SCALE, PRESSABLE_INPUT_SCALE } from '@constants/animations/values'
import { base } from '@design/base'
import { type BlurTint, BlurView } from 'expo-blur'
import type React from 'react'
import type { ComponentProps } from 'react'
import { Pressable, type StyleProp, Text, type TextStyle, type ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Button.styles'
import { SIZE_MAP, type Size } from './constats'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

type Variant = 'icon' | 'text' | 'textIcon'

interface ButtonProps extends ComponentProps<typeof AnimatedPressable> {
  ref?: React.Ref<any>
  variant?: Variant
  label?: string
  size?: Size
  style?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  overlayStyle?: StyleProp<ViewStyle>
  icon?: React.JSX.Element | null | boolean
  children?: React.ReactNode
  elevated?: boolean
  blur?: boolean
}

export default function Button({
  ref,
  variant = 'text',
  label = '',
  size = 'md',
  children,
  icon,
  overlayStyle,
  style,
  labelStyle,
  elevated = true,
  blur = true,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1)
  const { rt } = useUnistyles()

  const isDark = rt.themeName.includes('dark')
  const tint: BlurTint = isDark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'
  let paddingHorizontal = 0

  if (variant !== 'icon') {
    switch (size) {
      case 'sm':
      case 'md':
        paddingHorizontal = base.spacing.lg
        break
      case 'lg':
      case 'xl':
        paddingHorizontal = base.spacing.xl
        break
      default:
        paddingHorizontal = base.spacing.lg
    }
  }

  const handlePress = (inn: boolean = true) => {
    scale.set(withSpring(inn ? (variant !== 'icon' ? PRESSABLE_INPUT_SCALE : ICON_PRESSABLE_SCALE) : 1, springy))
  }

  const animatedPressabelStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }))

  const buttonStyle = styles.button({
    size: SIZE_MAP[size],
    isIcon: variant === 'icon',
    paddingHorizontal,
    elevated,
    isTextIcon: variant === 'textIcon',
  })

  return (
    // @ts-expect-error
    <AnimatedPressable
      onTouchStart={() => handlePress(true)}
      onTouchMove={() => handlePress(false)}
      onTouchEnd={() => handlePress(false)}
      style={[buttonStyle, style, animatedPressabelStyle]}
      ref={ref}
      {...props}
    >
      {elevated && (
        <>
          {blur && <BlurView tint={tint} style={styles.blur} intensity={50} />}
          <Animated.View style={[styles.borderOverlay, overlayStyle]} />
        </>
      )}
      {icon}
      {label && (
        <Text numberOfLines={1} style={[styles.label(SIZE_MAP[size]), labelStyle]}>
          {label}
        </Text>
      )}
      {children}
    </AnimatedPressable>
  )
}
