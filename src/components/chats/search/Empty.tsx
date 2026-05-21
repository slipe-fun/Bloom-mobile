import { DashedBox, Icon, Loader } from '@components/ui'
import { getFadeIn, getFadeOut } from '@constants/animations'
import { useInsets } from '@hooks'
import { useTranslation } from 'react-i18next'
import { Text } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Search.styles'

export type SearchStatus = 'notFound' | 'loading' | 'emptyHistory' | 'default' | 'success'

interface EmptyProps {
  status: SearchStatus
}

export default function Empty({ status }: EmptyProps) {
  const { theme } = useUnistyles()
  const insets = useInsets()
  const { t } = useTranslation('common')
  const keyboard = useReanimatedKeyboardAnimation()

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateY: Math.min(0, (keyboard.height.get() + insets.realTop) / 2) }] }
  }, [insets])

  return (
    <Animated.View style={[styles.loaderWrapper, animatedStyle]}>
      {status === 'emptyHistory' ? (
        <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.emptyWrapper}>
          <DashedBox strokeColor={theme.colors.switcher} dashLength={12} gapLength={12} width={100} height={100} borderRadius={28}>
            <Icon size={58} color={theme.colors.switcher} icon="magnifyingglass" />
          </DashedBox>
          <Text style={styles.emptyTitle}>{t('common:chats.search.emptyHistory.title')}</Text>
          <Text style={styles.emptySubTitle}>{t('common:chats.search.emptyHistory.subTitle')}</Text>
        </Animated.View>
      ) : status === 'notFound' ? (
        <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.emptyWrapper}>
          <DashedBox strokeColor={theme.colors.switcher} dashLength={12} gapLength={12} width={200} height={100} borderRadius={28}>
            <Text style={styles.emptyNotFound}>¯\_(ツ)_/¯</Text>
          </DashedBox>
          <Text style={styles.emptyTitle}>{t('common:chats.search.notFound.title')}</Text>
          <Text style={styles.emptySubTitle}>{t('common:chats.search.notFound.subTitle')}</Text>
        </Animated.View>
      ) : status === 'loading' ? (
        <Loader size={34} />
      ) : null}
    </Animated.View>
  )
}
