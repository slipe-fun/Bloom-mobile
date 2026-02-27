import { EMOJI_AVATARS } from '@constants/emojiAvatars'
import FastImage, { type ImageStyle as FastImageStyle } from '@d11/react-native-fast-image'
import { Image, type ImageProps, type ImageStyle, type StyleProp, View } from 'react-native'
import { styles } from './Avatar.styles'

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

interface AvatarProps extends Omit<ImageProps, 'source'> {
  size?: Size
  square?: boolean
  style?: StyleProp<ImageStyle>
  imageStyle?: StyleProp<FastImageStyle>
  image?: string
  username?: string
  ref?: React.Ref<any>
}

export const SIZE_MAP: Record<Size, number> = {
  sm: 40,
  md: 44,
  lg: 52,
  xl: 68,
  '2xl': 100,
  '3xl': 128,
}

export default function Avatar({
  size = 'md',
  square = false,
  style,
  image,
  imageStyle,
  username = '',
  ref = null,
  ...props
}: AvatarProps) {
  const dimension = SIZE_MAP[size]
  const letter = username[0]?.toLowerCase()
  const emojiResult = EMOJI_AVATARS[letter]

  const avatarStyle = styles.avatar({
    height: dimension,
    square,
    image: Boolean(image),
    padding: dimension / 4.5,
    backgroundColor: emojiResult?.color,
  })

  return (
    <View ref={ref} style={!image ? [avatarStyle, style] : undefined}>
      {image ? (
        // @ts-expect-error
        <FastImage {...props} source={{ uri: image }} style={[avatarStyle, imageStyle]} />
      ) : (
        <Image {...props} source={emojiResult?.emoji} style={styles.emoji} />
      )}
    </View>
  )
}
