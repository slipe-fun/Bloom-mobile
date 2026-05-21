import { DashedBox, Icon, Loader } from '@components/ui'
import { getFadeIn, getFadeOut } from '@constants/animations'
import { useInsets } from '@hooks'
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
          <Text style={styles.emptyTitle}>No search history</Text>
          <Text style={styles.emptySubTitle}>Do your first search to see it in history</Text>
        </Animated.View>
      ) : status === 'notFound' ? (
        <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.emptyWrapper}>
          <DashedBox strokeColor={theme.colors.switcher} dashLength={12} gapLength={12} width={200} height={100} borderRadius={28}>
            <Text style={styles.emptyNotFound}>¯\_(ツ)_/¯</Text>
          </DashedBox>
          <Text style={styles.emptyTitle}>No results yet.</Text>
          <Text style={styles.emptySubTitle}>No result found for your request</Text>
        </Animated.View>
      ) : status === 'loading' ? (
        <Loader size={34} />
      ) : null}
    </Animated.View>
  )
}
