import { AVATAR_COLORS, DEFAULT_AVATARS } from '@constants/avatars'
import FastImage, { type FastImageProps, type ImageStyle as FastImageStyle } from '@d11/react-native-fast-image'
import { getHashCode } from '@lib/getHashCode'
import { LinearGradient } from 'expo-linear-gradient'
import { useMemo } from 'react'
import { type StyleProp, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { styles } from './Avatar.styles'

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

interface AvatarProps extends Omit<FastImageProps, 'source'> {
  size?: Size
  square?: boolean
  style?: StyleProp<FastImageStyle>
  imageStyle?: StyleProp<FastImageStyle>
  image?: string
  userId?: string
  ref?: React.Ref<any>
}

export const SIZE_MAP: Record<Size, number> = {
  sm: 40,
  md: 44,
  lg: 56,
  xl: 68,
  '2xl': 100,
  '3xl': 128,
  '4xl': 160,
}

export default function Avatar({ size = 'md', square = false, style, image, imageStyle, userId = '', ref = null, ...props }: AvatarProps) {
  const dimension = SIZE_MAP[size]

  const avatarDefault = useMemo(() => {
    if (image) return null

    const hash = getHashCode(userId || 'guest')

    const colorIndex = hash % AVATAR_COLORS.length

    const iconIndex = Math.floor(hash / AVATAR_COLORS.length) % DEFAULT_AVATARS.length

    return {
      color: AVATAR_COLORS[colorIndex],
      icon: DEFAULT_AVATARS[iconIndex],
    }
  }, [userId, image])

  const avatarStyle = styles.avatar({
    height: dimension,
    square,
    image: Boolean(image),
    padding: dimension / 5,
  })

  return (
    <View ref={ref} style={!image ? [avatarStyle, style] : undefined}>
      {image ? (
        <FastImage {...props} source={{ uri: image }} style={[avatarStyle, imageStyle]} />
      ) : (
        <>
          <LinearGradient start={[0.5, 1]} end={[0.5, 0]} colors={avatarDefault.color} style={StyleSheet.absoluteFill} />
          <FastImage {...props} source={avatarDefault?.icon} style={styles.emoji} />
        </>
      )}
    </View>
  )
}
