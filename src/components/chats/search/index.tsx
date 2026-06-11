import { getFadeIn, getFadeOut } from '@constants/animations'
import { useInsets, useUsersSearch } from '@hooks'
import type { User } from '@interfaces'
import { FlashList, type ListRenderItem } from '@shopify/flash-list'
import useFooterStore from '@stores/footer'
import { useCallback, useMemo, useState } from 'react'
import Animated, { LayoutAnimationConfig, useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated'
import { FOOTER_HEIGHT } from '../footer'
import Empty from './Empty'
import SearchHeader from './header'
import FloatingHeader from './header/FloatingHeader'
import { styles } from './Search.styles'
import SearchUser from './searchUser'

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList)

export default function Search() {
  const search = useFooterStore((state) => state.search)
  const searchValue = useFooterStore((state) => state.searchValue)
  const scrollY = useSharedValue<number>(0)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const { users, status, loadMore } = useUsersSearch(searchValue)
  const insets = useInsets()

  const footerHeight = FOOTER_HEIGHT + insets.bottom

  const keyExtractor = useCallback((item: User) => String(item.id), [])

  const renderItem: ListRenderItem<User> = useCallback(
    ({ item }) => <SearchUser user={item} />,

    [],
  )

  const listHeader = useMemo(
    () => <SearchHeader headerHeight={headerHeight} scrollY={scrollY} setHeaderHeight={setHeaderHeight} />,
    [scrollY, setHeaderHeight],
  )

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.set(event.contentOffset.y)
    },
  })

  if (!search) return null

  return (
    <Animated.View entering={getFadeIn()} exiting={getFadeOut()} style={styles.container}>
      <FloatingHeader scrollY={scrollY} headerHeight={headerHeight} />
      <AnimatedFlashList
        onScroll={scrollHandler}
        onEndReached={loadMore}
        ListHeaderComponent={listHeader}
        keyExtractor={keyExtractor}
        style={styles.list}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: footerHeight }}
        data={users}
        renderItem={renderItem}
      />
      <LayoutAnimationConfig skipEntering skipExiting>
        <Empty status={status} />
      </LayoutAnimationConfig>
    </Animated.View>
  )
}
