import { EmptyModal } from '@components/ui'
import { getFadeIn, getFadeOut } from '@constants/animations'
import { useUsersSearch } from '@hooks'
import type { SearchUser as SearchUserType } from '@interfaces'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import useTabBarStore from '@stores/tabBar'
import { useCallback, useState } from 'react'
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import SearchHeader from './header'
import FloatingHeader from './header/FloatingHeader'
import { styles } from './Search.styles'
import SearchUser from './SearchUser'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

export default function Search() {
  const { search, searchValue, height } = useTabBarStore()
  const scrollY = useSharedValue<number>(0)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const { users, status, loadMore } = useUsersSearch(searchValue)

  const ss = ''
  const lastIndex = users?.length - 1

  const isStoryEmpty: boolean = !!ss && search
  const isEmpty: boolean = status === 'empty' || status === 'error'

  const keyExtractor = useCallback((item: SearchUserType) => {
    return String(item.id)
  }, [])

  const renderItem: ListRenderItem<SearchUserType> = useCallback(
    ({ item, index }) => {
      return <SearchUser user={item} isLast={index === lastIndex} />
    },
    [lastIndex],
  )

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  return search ? (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.container}>
      <FloatingHeader scrollY={scrollY} headerHeight={headerHeight} />
      <AnimatedFlashList
        key="search"
        onScroll={scrollHandler}
        onEndReached={() => loadMore()}
        ListHeaderComponent={<SearchHeader headerHeight={headerHeight} scrollY={scrollY} setHeaderHeight={setHeaderHeight} />}
        keyExtractor={keyExtractor}
        style={styles.list}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        automaticallyAdjustsScrollIndicatorInsets={false}
        contentContainerStyle={{ paddingBottom: height }}
        scrollIndicatorInsets={{
          top: headerHeight,
          bottom: height,
        }}
        data={users}
        renderItem={renderItem}
      />
      {isStoryEmpty ? (
        <EmptyModal key="emptyStory" text="В истории поиска пусто... Введите свой первый запрос!" icon="magnifyingglass" color="primary" />
      ) : isEmpty ? (
        <EmptyModal key="emptyResult" text={`К сожалению, по запросу "${searchValue}" ничего не найдено.`} icon="eye.slashed" color="red" />
      ) : null}
    </Animated.View>
  ) : null
}
