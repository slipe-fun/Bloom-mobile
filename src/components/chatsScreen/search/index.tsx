import { EmptyModal } from '@components/ui'
import { getFadeIn, getFadeOut } from '@constants/animations'
import { useInsets, useUsersSearch } from '@hooks'
import type { SearchUser } from '@interfaces'
import { AnimatedLegendList } from '@legendapp/list/reanimated'
import useTabBarStore from '@stores/tabBar'
import { useCallback, useState } from 'react'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import Chat from '../chat'
import SearchHeader from './header'
import FloatingHeader from './header/FloatingHeader'
import { styles } from './Search.styles'

export default function Search(): React.JSX.Element {
  const { isSearch, searchValue, tabBarHeight } = useTabBarStore()
  const insets = useInsets()
  const scrollY = useSharedValue<number>(0)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const { users, status, loadMore } = useUsersSearch(searchValue)

  const ss = ''

  const isStoryEmpty: boolean = !!ss && isSearch
  const isEmpty: boolean = status === 'empty' || status === 'error'

  const keyExtractor = useCallback((item: SearchUser) => {
    return String(item.id)
  }, [])

  const renderItem = useCallback(({ item }: { item: SearchUser }) => {
    return <Chat isSearch chat={{ recipient: item }} />
  }, [])

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  return isSearch ? (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.container}>
      <FloatingHeader scrollY={scrollY} headerHeight={headerHeight} />
      <AnimatedLegendList
        key="search"
        onScroll={scrollHandler}
        onEndReached={() => loadMore()}
        ListHeaderComponent={<SearchHeader headerHeight={headerHeight} scrollY={scrollY} setHeaderHeight={setHeaderHeight} />}
        keyExtractor={keyExtractor}
        style={styles.list}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        contentContainerStyle={{ paddingBottom: tabBarHeight }}
        scrollIndicatorInsets={{
          top: headerHeight - insets.realTop,
          bottom: tabBarHeight - insets.realBottom,
        }}
        data={users}
        renderItem={renderItem}
      />
      {isStoryEmpty ? (
        <EmptyModal key="emptyStory" text="В истории поиска пусто... Введите свой первый запрос!" icon="magnifyingglass" color="primary" />
      ) : isEmpty ? (
        <EmptyModal
          key="emptyResult"
          text={`К сожалению... по запросу "${searchValue}" ничего не найдено. Попробуйте снова`}
          icon="eye.slashed"
          color="red"
        />
      ) : null}
    </Animated.View>
  ) : null
}
