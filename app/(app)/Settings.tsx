import Header from '@components/settings'
import UserId from '@components/settings/UserId'
import { useInsets } from '@hooks'
import type { User } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import { View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import { StyleSheet } from 'react-native-unistyles'

const AnimatedScrollView = Transition.createTransitionAwareComponent(Animated.ScrollView, { isScrollable: true })

const user: User = {
  display_name: 'FORTUNA 812',
  id: 'dk3k293KK',
  description: '',
  avatar: 'https://i.pinimg.com/736x/77/5b/a5/775ba539f6a59d678ee01d0353646e88.jpg',
}

export default function Settings() {
  const scrollY = useSharedValue(0)
  const insets = useInsets()
  const headerHeight = useSettingsScreenStore((state) => state.headerHeight)

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.set(e.contentOffset.y)
    },
  })
  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} user={user} loading={false} />
      <AnimatedScrollView
        contentContainerStyle={styles.list(headerHeight, insets.bottom)}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        <UserId user={user} scrollY={scrollY} />
        <View style={{ height: 220, width: '100%', backgroundColor: 'white', opacity: 1, borderRadius: 34, borderCurve: 'continuous' }} />
        <View style={{ height: 220, width: '100%', backgroundColor: 'white', opacity: 1, borderRadius: 34, borderCurve: 'continuous' }} />
        <View style={{ height: 220, width: '100%', backgroundColor: 'white', opacity: 1, borderRadius: 34, borderCurve: 'continuous' }} />
        <View style={{ height: 220, width: '100%', backgroundColor: 'white', opacity: 1, borderRadius: 34, borderCurve: 'continuous' }} />
      </AnimatedScrollView>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grayBackground,
  },
  list: (paddingTop: number, paddingBottom: number) => ({
    paddingBottom,
    paddingTop,
    paddingHorizontal: theme.spacing.lg,
  }),
}))
