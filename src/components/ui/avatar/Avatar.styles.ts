import { StyleSheet } from 'react-native-unistyles'

type AvatarStyleProps = {
  height: number
  square: boolean
  image: boolean
  padding: number
}

export const styles = StyleSheet.create((theme) => ({
  avatar: ({ height, square, image, padding }: AvatarStyleProps) => ({
    aspectRatio: 1,
    height,
    overflow: 'hidden',
    borderRadius: square ? theme.radius.md : theme.radius.full,
    padding: image ? 0 : padding,
    backgroundColor: image ? theme.colors.foreground : 'transparent',
  }),
  emoji: {
    width: '100%',
    height: '100%',
  },
}))
