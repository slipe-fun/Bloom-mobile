import Header from '@components/settings'
import UserId from '@components/settings/UserId'
import { SettingsGroup } from '@components/ui'
import { SETTINGS_SECTIONS } from '@constants/settings'
import { useInsets, useMe } from '@hooks'
import { useSettingsStore } from '@stores/settings'
import { useSettingsHeaderStore } from '@stores/settingsHeader'
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
  const headerHeight = useSettingsHeaderStore((state) => state.headerHeight)
  const theme = useSettingsStore((state) => state.theme)
  const language = useSettingsStore((state) => state.language)
  const snapPosition = useSettingsHeaderStore((state) => state.snapPosition)
  const { user, loading } = useMe()

  const settingsList = useMemo(
    () => SETTINGS_SECTIONS({ theme: theme, language: language, push, storage: mmkv, replace }),
    [push, mmkv, theme, language],
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
        snapToOffsets={[0, headerHeight - snapPosition / 1.4]}
        decelerationRate={1}
        snapToEnd={false}
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
    paddingTop,
    paddingHorizontal: theme.spacing.lg,
  }),
}))
