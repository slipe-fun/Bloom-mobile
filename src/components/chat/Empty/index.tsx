import { DashedBox, Icon } from '@components/ui'
import { getFadeIn, getFadeOut } from '@constants/animations'
import { useInsets } from '@hooks'
import { useTranslation } from 'react-i18next'
import { Text, View } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { styles } from './Empty.styles'

export default function Empty() {
  const insets = useInsets()
  const { t } = useTranslation('chat')
  const keyboard = useReanimatedKeyboardAnimation()

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: Math.min(0, (keyboard.height.get() + insets.top + 8) / 2) }] }
  }, [insets])

  return (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} pointerEvents="none" style={[styles.container, animatedStyle]}>
      <View style={styles.wrapper}>
        <DashedBox
          uniProps={(theme) => ({ color: theme.colors.switcher })}
          dashLength={12}
          gapLength={12}
          width={100}
          height={100}
          borderRadius={28}
        >
          <Icon size={58} uniProps={(theme) => ({ color: theme.colors.switcher })} icon="message" />
        </DashedBox>
        <Text style={styles.title}>{t('chat:empty.title')}</Text>
        <Text style={styles.subTitleWrapper}>
          <Text style={styles.subTitle}>{t('chat:empty.subTitleFirst')}</Text>
          <Text style={styles.action}>{t('chat:empty.subTitleMessage')}</Text>
          <Text style={styles.subTitle}>{t('chat:empty.subTitleSecond')}</Text>
        </Text>
      </View>
    </Animated.View>
  )
}
