import useMessages from '@api/hooks/encryption/useMessages'
import EmptyModal from '@components/chatScreen/emptyModal'
import Footer from '@components/chatScreen/footer'
import Header from '@components/chatScreen/header'
import Message from '@components/chatScreen/message'
import type { Chat as ChatType, Message as MessageType } from '@interfaces'
import { FlashList } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { KeyboardStickyView, useKeyboardState } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'

export default function Chat() {
  const { chat } = useLocalSearchParams<{ chat: string }>()

  const _chat = JSON.parse(chat) as ChatType

  const { messages, addMessage } = useMessages(_chat?.id)
  const [seenId, setSeenId] = useState<number>(0)
  const [footerHeight, setFooterHeight] = useState<number>(0)
  const height = useKeyboardState((state) => state.height)
  const [ss, sss] = useState(0)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const [lastMessageId, setLastMessageId] = useState<number>(0)

  const renderItem = useCallback(
    ({ item, index }: { item: MessageType; index: number }) => {
      if (item?.type === 'date_header') {
        return null
      }

      const prevItem = messages[index - 1]
      const nextItem = messages[index + 1]

      const CHAT_TIME_WINDOW = 5 * 60 * 1000

      const isGroupStart =
        !prevItem ||
        prevItem.author_id !== item.author_id ||
        new Date(item.date).getTime() - new Date(prevItem.date).getTime() > CHAT_TIME_WINDOW

      const isGroupEnd =
        !nextItem ||
        nextItem.author_id !== item.author_id ||
        new Date(nextItem.date).getTime() - new Date(item.date).getTime() > CHAT_TIME_WINDOW

      return <Message seen={seenId === item?.id} message={item} isGroupEnd={isGroupEnd} isGroupStart={isGroupStart} />
    },
    [seenId, lastMessageId, messages],
  )

  const keyExtractor = useCallback((item: MessageType, index: number) => {
    return String(index)
  }, [])

  useEffect(() => {
    let lastSeen = 0
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i]
      if (m?.seen && m?.isMe) {
        lastSeen = m.id
        break
      }
    }
    setSeenId(lastSeen)
    setLastMessageId(messages.length ? messages[messages.length - 1]?.id : 0)
  }, [messages.length, messages])

  return (
    <View style={styles.container}>
      <Header onLayout={setHeaderHeight} chat={_chat} />
      <EmptyModal chat={_chat} visible={messages.length === 0} />
      <KeyboardStickyView style={styles.list}>
        <FlashList
          data={messages}
          ListHeaderComponent={<View style={{ height: ss, width: '100%', backgroundColor: 'red' }} />}
          renderItem={renderItem}
          maintainVisibleContentPosition={{
            autoscrollToBottomThreshold: 0.2,
            startRenderingFromBottom: true,
          }}
          keyExtractor={keyExtractor}
          contentContainerStyle={[styles.listContent, { paddingBottom: footerHeight + 12, paddingTop: headerHeight }]}
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        />
      </KeyboardStickyView>
      <Footer setFooterHeight={setFooterHeight} footerHeight={footerHeight} onSend={addMessage} />
    </View>
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
  listContent: {
    paddingHorizontal: theme.spacing.lg,
  },
}))
