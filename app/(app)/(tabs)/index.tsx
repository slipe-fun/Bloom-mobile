import { useChatList } from '@api/providers/ChatsContext'
import Chat from '@components/chats/chat'
import Header from '@components/chats/header'
import Search from '@components/chats/search'
import { EmptyModal } from '@components/ui'
import { fastSpring } from '@constants/easings'
import type { Chat as ChatType } from '@interfaces'
import { FlashList } from '@shopify/flash-list'
import useChatsScreenStore from '@stores/chats'
import useTabBarStore from '@stores/tabBar'
import { useCallback } from 'react'
import type { ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'

export default function TabChats() {
  const { headerHeight } = useChatsScreenStore()
  const { height, search } = useTabBarStore()
  const { chats } = useChatList()

  const lastIndex = chats?.length - 1

  const animatedViewStyle = useAnimatedStyle(
    (): ViewStyle => ({
      opacity: withSpring(search ? 0 : 1, fastSpring),
    }),
  )

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
      <Search />
      <Animated.View style={[styles.container, animatedViewStyle]}>
        <Header />
        <FlashList
          data={chats}
          style={styles.list}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator
          automaticallyAdjustsScrollIndicatorInsets={false}
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: height,
          }}
          scrollIndicatorInsets={{
            top: headerHeight,
            bottom: height,
          }}
        />
        {chats?.length === 0 ? (
          <EmptyModal text="У вас еще нет ни одного чата! Создайте свой первый чат!" icon="message" color="primary" />
        ) : null}
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
