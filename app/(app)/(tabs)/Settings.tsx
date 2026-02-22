import Header from '@components/settingsScreen'
import FloatingHeader from '@components/settingsScreen/FloatingHeader'
import { SettingsGroup } from '@components/ui'
import { SETTINGS_SECTIONS } from '@constants/settings'
import { useMe, useSnapScroll } from '@hooks'
import type { SettingsSection } from '@interfaces'
import { AnimatedLegendList } from '@legendapp/list/reanimated'
import useSettingsScreenStore from '@stores/settings'
import useTabBarStore from '@stores/tabBar'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export default function TabSettings() {
  const { snapEndPosition, headerHeight } = useSettingsScreenStore()
  const height = useTabBarStore((state) => state.height)
  const { scrollY, animatedRef, scrollHandler } = useSnapScroll<any>(snapEndPosition)
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

  const keyExtractor = useCallback((item: SettingsSection) => {
    return item?.id
  }, [])

  const renderItem = useCallback(
    ({ item }: { item: SettingsSection }) => {
      return <SettingsGroup section={item} />
    },
    [data],
  )

  return (
    <View style={styles.container}>
      {/* <FloatingHeader scrollY={scrollY} user={user} /> */}
      <Header scrollY={scrollY} user={user} />
      <AnimatedLegendList
        ref={animatedRef}
        keyExtractor={keyExtractor}
        // ListHeaderComponent={<Header scrollY={scrollY} user={user} />}
        onScroll={scrollHandler}
        contentContainerStyle={styles.list(height, headerHeight)}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
      />
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
    paddingTop,
    paddingHorizontal: theme.spacing.lg,
  }),
}))
