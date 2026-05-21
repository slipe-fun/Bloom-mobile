import { useChatList } from '@api/providers/ChatsContext'
import Chat from '@components/chats/chat'
import Empty from '@components/chats/empty'
import Footer, { FOOTER_HEIGHT } from '@components/chats/footer'
import Header from '@components/chats/header'
import Search from '@components/chats/search'
import { SIZE_MAP } from '@components/ui/button/constats'
import { fastSpring } from '@constants/easings'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { Chat as ChatType } from '@interfaces'
import { FlashList } from '@shopify/flash-list'
import useFooterStore from '@stores/footer'
import { useCallback } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, { LayoutAnimationConfig, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

export default function Chats() {
  const search = useFooterStore((state) => state.search)
  const { chats } = useChatList()
  const { height } = useWindowDimensions()
  const insets = useInsets()

  const footerHeight = FOOTER_HEIGHT + insets.bottom
  const lastIndex = chats?.length - 1

  const headerHeight = insets.top + base.spacing.md + SIZE_MAP.md

  const animatedViewStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withSpring(search ? -height / 10 : 0, fastSpring) }],
    opacity: withSpring(search ? 0 : 1, fastSpring),
  }))

  const keyExtractor = useCallback((item: ChatType) => {
    return String(item?.id)
  }, [])

  const renderItem = useCallback(
    ({ item, index }: { item: ChatType; index: number }) => {
      return <Chat chat={item} isLast={index === lastIndex} />
    },
    [lastIndex],
  )

  return (
    <>
      <Footer />
      <Search />
      <Animated.View style={[styles.container, animatedViewStyle]}>
        <FlashList
          data={chats}
          style={styles.list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator
          automaticallyAdjustsScrollIndicatorInsets={false}
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: footerHeight,
          }}
          scrollIndicatorInsets={{
            top: headerHeight,
            bottom: footerHeight,
          }}
        />
        <LayoutAnimationConfig skipEntering skipExiting>
          {chats?.length === 0 ? <Empty /> : null}
        </LayoutAnimationConfig>
        <Header />
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  list: {
    flex: 1,
  },
}))
