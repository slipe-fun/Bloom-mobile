import Header from '@components/settings'
import UserId from '@components/settings/UserId'
import { SettingsGroup } from '@components/ui'
import { SETTINGS_SECTIONS } from '@constants/settings'
import { useInsets, useMe } from '@hooks'
import useSettingsScreenStore from '@stores/settings'
import useStorageStore from '@stores/storage'
import { useRouter } from 'expo-router'
import { useMemo } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import Transition from 'react-native-screen-transitions'
import { StyleSheet } from 'react-native-unistyles'

const AnimatedScrollView = Transition.createTransitionAwareComponent(Animated.ScrollView, { isScrollable: true })

export default function Settings() {
  const scrollY = useSharedValue(0)
  const insets = useInsets()
  const { push, replace } = useRouter()
  const mmkv = useStorageStore((state) => state.mmkv)
  const headerHeight = useSettingsScreenStore((state) => state.headerHeight)
  const { user, loading } = useMe()

  const settingsList = useMemo(
    () => SETTINGS_SECTIONS({ theme: 'Dark', language: 'English', push, storage: mmkv, replace }),
    [push, mmkv, SETTINGS_SECTIONS],
  )

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.set(e.contentOffset.y)
    },
  })

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} user={user} loading={loading} />
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
