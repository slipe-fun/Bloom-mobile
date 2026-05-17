import { getFadeOut, reversedZoomAnimationIn } from '@constants/animations'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Empty.styles'
import ListShuffle from './listShuffle'

export default function Empty() {
  const keyboard = useReanimatedKeyboardAnimation()
  const { t } = useTranslation('common')

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] }
  })
  return (
    <Animated.View entering={reversedZoomAnimationIn} exiting={getFadeOut()} style={[styles.container, animatedStyle]}>
      <ListShuffle />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('common:chats.empty.title')}</Text>
        <Text style={styles.subTitle}>{t('common:chats.empty.subTitle')}</Text>
      </View>
    </Animated.View>
  )
}
