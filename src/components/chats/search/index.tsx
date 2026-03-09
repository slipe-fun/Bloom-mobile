import { EmptyModal } from '@components/ui'
import { getFadeIn, getFadeOut } from '@constants/animations'
import { useUsersSearch } from '@hooks'
import type { SearchUser as SearchUserType } from '@interfaces'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import useTabBarStore from '@stores/tabBar'
import { useCallback, useMemo, useState } from 'react'
import { ActivityIndicator, View } from 'react-native' // Добавили ActivityIndicator
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

  const lastIndex = users.length - 1
  const isInitialLoading = status === 'loading' && users.length === 0
  const isNotFound = (status === 'empty' || status === 'error') && users.length === 0

  const isHistoryEmpty = !searchValue && search

  const keyExtractor = useCallback((item: SearchUserType) => String(item.id), [])

  const renderItem: ListRenderItem<SearchUserType> = useCallback(
    ({ item, index }) => <SearchUser user={item} isLast={index === lastIndex} />,
    [lastIndex],
  )

  const listHeader = useMemo(
    () => <SearchHeader headerHeight={headerHeight} scrollY={scrollY} setHeaderHeight={setHeaderHeight} />,
    [scrollY, setHeaderHeight],
  )

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  if (!search) return null

  return (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.container}>
      <FloatingHeader scrollY={scrollY} headerHeight={headerHeight} />

      {!isInitialLoading && (
        <AnimatedFlashList
          key="search"
          onScroll={scrollHandler}
          onEndReached={loadMore}
          ListHeaderComponent={listHeader}
          keyExtractor={keyExtractor}
          style={styles.list}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: height }}
          data={users}
          renderItem={renderItem}
        />
      )}

      {isInitialLoading && (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#999" />
        </View>
      )}

      {isHistoryEmpty ? (
        <EmptyModal key="emptyStory" text="В истории поиска пусто... Введите свой первый запрос!" icon="magnifyingglass" color="primary" />
      ) : isNotFound ? (
        <EmptyModal key="emptyResult" text={`К сожалению, по запросу "${searchValue}" ничего не найдено.`} icon="eye.slashed" color="red" />
      ) : null}
    </Animated.View>
  )
}
