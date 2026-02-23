import Header from '@components/settingsScreen'
import UserEmail from '@components/settingsScreen/UserEmail'
import { SettingsGroup } from '@components/ui'
import { SETTINGS_SECTIONS } from '@constants/settings'
import { useMe } from '@hooks'
import useSettingsScreenStore from '@stores/settings'
import useTabBarStore from '@stores/tabBar'
import { useMemo } from 'react'
import { View } from 'react-native'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

export default function TabSettings() {
  const { snapEndPosition, headerHeight } = useSettingsScreenStore()
  const height = useTabBarStore((state) => state.height)
  const scrollY = useSharedValue(0)
  const { user } = useMe()

  const data = useMemo(
    () =>
      SETTINGS_SECTIONS({
        username: user?.username || 'Без юзернейма',
        description: user?.description || 'Без описания',
        friends: user?.friends_count,
        theme: 'Светлое',
        language: 'Русский',
      }),
    [user],
  )

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.set(e.contentOffset.y)
    },
  })

  return (
    <View style={styles.container}>
      <Header scrollY={scrollY} user={user} />
      <Animated.ScrollView
        onScroll={scrollHandler}
        decelerationRate="fast"
        snapToOffsets={[0, headerHeight]}
        snapToAlignment="start"
        contentContainerStyle={styles.list(height, headerHeight)}
        showsVerticalScrollIndicator={false}
      >
        <UserEmail user={user} />
        {data.map((item, _index) => (
          <SettingsGroup key={item.id} section={item} />
        ))}
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: (paddingBottom: number, paddingTop: number) => ({
    paddingBottom,
    paddingTop: paddingTop - theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
  }),
}))
