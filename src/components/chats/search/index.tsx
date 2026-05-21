import { EmptyModal, Loader } from '@components/ui'
import { getFadeIn, getFadeOut } from '@constants/animations'
import { useInsets, useUsersSearch } from '@hooks'
import type { SearchUser as SearchUserType } from '@interfaces'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import useFooterStore from '@stores/footer'
import { useCallback, useMemo, useState } from 'react'
import { View } from 'react-native'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'
import { FOOTER_HEIGHT } from '../footer'
import SearchHeader from './header'
import FloatingHeader from './header/FloatingHeader'
import { styles } from './Search.styles'
import SearchUser from './SearchUser'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

export default function Search() {
  const search = useFooterStore((state) => state.search)
  const searchValue = useFooterStore((state) => state.searchValue)
  const scrollY = useSharedValue<number>(0)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  // const { users, status, loadMore } = useUsersSearch(searchValue)
  const keyboard = useReanimatedKeyboardAnimation()
  const insets = useInsets()

  const footerHeight = FOOTER_HEIGHT + insets.bottom
  const lastIndex = [].length - 1
  // const isInitialLoading = status === 'loading' && users.length === 0
  // const isNotFound = (status === 'empty' || status === 'error') && users.length === 0
  // const isHistoryEmpty = !searchValue && search

  const keyExtractor = useCallback((item: SearchUserType) => String(item.id), [])

  const renderItem: ListRenderItem<SearchUserType> = useCallback(
    // ({ item, index }) => <SearchUser user={item} isLast={index === lastIndex} />,
    ({ item, index }) => <View style={{ height: 150, width: '100%', backgroundColor: 'white', marginBottom: 24 }} />,
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

  const animatedStyles = useAnimatedStyle(() => {
    return { transform: [{ translateY: keyboard.height.value / 2 }] }
  })

  if (!search) return null

  return (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.container}>
      <FloatingHeader scrollY={scrollY} headerHeight={headerHeight} />

      {/* {!isInitialLoading && ( */}
      <AnimatedFlashList
        key="search"
        onScroll={scrollHandler}
        // onEndReached={loadMore}
        ListHeaderComponent={listHeader}
        // keyExtractor={keyExtractor}
        style={styles.list}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: footerHeight }}
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={renderItem}
      />
      {/* )} */}

      {/* {isInitialLoading && ( */}
      {/* <Animated.View style={[styles.loaderWrapper, animatedStyles]}>
        <Loader size={32} />
      </Animated.View> */}
      {/* )} */}

      {/* {isHistoryEmpty ? (
        <EmptyModal key="emptyStory" text="В истории поиска пусто... Введите свой первый запрос!" icon="magnifyingglass" color="primary" />
      ) : isNotFound ? (
        <EmptyModal key="emptyResult" text={`К сожалению, по запросу "${searchValue}" ничего не найдено.`} icon="eye.slashed" color="red" />
      ) : null} */}
    </Animated.View>
  )
}
