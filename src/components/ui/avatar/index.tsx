import { EMOJI_AVATARS } from '@constants/emojiAvatars'
import FastImage, { type ImageStyle as FastImageStyle } from '@d11/react-native-fast-image'
import type React from 'react'
import { useMemo } from 'react'
import { Image, type ImageStyle, type StyleProp, View } from 'react-native'
import { styles } from './Avatar.styles'

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

type AvatarProps = {
  size?: Size
  square?: boolean
  style?: StyleProp<ImageStyle>
  imageStyle?: StyleProp<FastImageStyle>
  image?: string | undefined
  username?: string
  ref?: React.Ref<any>
}

export default function Avatar({
  size = 'md',
  square = false,
  style,
  image,
  imageStyle,
  username = '',
  ref = null,
}: AvatarProps): React.ReactNode {
  const SIZE_MAP: Record<Size, number> = {
    sm: 40,
    md: 44,
    lg: 52,
    xl: 68,
    '2xl': 100,
    '3xl': 128,
  }

  const emojiResult = EMOJI_AVATARS[username?.toLowerCase().slice(0, 1)]

  const avatarStyle = useMemo(
    () =>
      styles.avatar({ height: SIZE_MAP[size], square, image: !!image, padding: SIZE_MAP[size] / 4.5, backgroundColor: emojiResult?.color }),
    [size, square, emojiResult, image],
  )

  return image ? (
    <View ref={ref}>
      <FastImage source={{ uri: image }} style={[avatarStyle, imageStyle]} />
    </View>
  ) : (
    <View ref={ref} style={[avatarStyle, style]}>
      <Image source={emojiResult?.emoji} style={styles.emoji} />
    </View>
  )
}
