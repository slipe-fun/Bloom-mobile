import Header from '@components/settingsScreen/header'
import FloatingHeader from '@components/settingsScreen/header/FloatingHeader'
import { SettingsGroup } from '@components/ui'
import { SETTINGS_SECTIONS } from '@constants/settings'
import { useMe, useSnapScroll } from '@hooks'
import type { SettingsSection } from '@interfaces'
import { AnimatedLegendList } from '@legendapp/list/reanimated'
import useSettingsScreenStore from '@stores/settings'
import useTabBarStore from '@stores/tabBar'
import type React from 'react'
import { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import { styles } from './Settings.styles'

export default function SettingsScreen(): React.JSX.Element {
  const { snapEndPosition } = useSettingsScreenStore()
  const { tabBarHeight } = useTabBarStore()
  const { scrollY, animatedRef, scrollHandler } = useSnapScroll<any>(snapEndPosition)
  const { user, error, loading } = useMe()

  const data = useMemo(
    () =>
      SETTINGS_SECTIONS({
        username: user?.username,
        description: user?.description,
        friends: user?.friends_count,
        theme: 'Светлое',
        language: 'Русский',
      }),
    [user],
  )

  const keyExtractor = useCallback((item: SettingsSection) => {
    return item?.id
  }, [])

  const renderItem = useCallback(({ item }: { item: SettingsSection }) => {
    return <SettingsGroup section={item} />
  }, [])

  return (
    <View style={styles.container}>
      <FloatingHeader scrollY={scrollY} user={user} />
      <AnimatedLegendList
        ref={animatedRef}
        keyExtractor={keyExtractor}
        ListHeaderComponent={<Header scrollY={scrollY} user={user} />}
        onScroll={scrollHandler}
        contentContainerStyle={styles.list(tabBarHeight)}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
      />
    </View>
  )
}
