import Header from '@components/settings'
import UserId from '@components/settings/UserId'
import { SettingsGroup } from '@components/ui'
import { SETTINGS_SECTIONS } from '@constants/settings'
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

  const settingsList = SETTINGS_SECTIONS({ theme: 'Dark', language: 'English' })

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} user={user} loading={false} />
      <AnimatedScrollView
        contentContainerStyle={styles.list(headerHeight, insets.bottom)}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator={false}
      >
        <UserId user={user} scrollY={scrollY} />
        {settingsList.map((item, _i) => (
          <SettingsGroup section={item} key={item.id} />
        ))}
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
    gap: theme.spacing.lg,
    paddingTop,
    paddingHorizontal: theme.spacing.lg,
  }),
}))
