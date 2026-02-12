import EmptyModal from '@components/chatScreen/emptyModal'
import Footer from '@components/chatScreen/footer'
import Header from '@components/chatScreen/header'
import Message from '@components/chatScreen/message'
import { useChatController, useChatKeyboard, useInsets } from '@hooks'
import type { Message as MessageType } from '@interfaces'
import { FlashList, type FlashListRef } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { KeyboardStickyView } from 'react-native-keyboard-controller'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export default function Chat() {
  const { chat } = useLocalSearchParams<{ chat: string }>()
  const mountTimestamp = useRef(Date.now())
  const listRef = useRef<FlashListRef<MessageType>>(null)
  const [footerHeight, setFooterHeight] = useState<number>(0)
  const insets = useInsets()
  const { theme } = useUnistyles()
  const { height } = useChatKeyboard()
  const { messages, seenID, addMessage, nextPage, _chat } = useChatController({ chat, listRef: listRef.current })

  const headerHeight = insets.top + 44 + theme.spacing.md

  const renderItem = useCallback(
    ({ item }: { item: MessageType }) => {
      const grouped = !item?.groupEnd && !item?.groupStart
      const marginBottom = grouped ? theme.spacing.sm : item?.groupEnd ? theme.spacing.lg : theme.spacing.sm

      const messageTime = new Date(item.date).getTime()

      const shouldAnimate = messageTime > mountTimestamp.current

      return <Message seen={seenID >= item?.id} message={item} marginBottom={marginBottom} shouldAnimate={shouldAnimate} />
    },
    [seenID],
  )

  const keyExtractor = useCallback((item) => {
    return String((item as MessageType).id)
  }, [])

  const onStartReached = () => {
    nextPage()
    mountTimestamp.current = Date.now()
  }

  return (
    <View style={styles.container}>
      <Header chat={_chat} />
      <EmptyModal chat={_chat} visible={messages.length === 0} />
      {messages.length > 0 && footerHeight && (
        <KeyboardStickyView style={styles.list}>
          <FlashList
            data={messages}
            ref={listRef}
            ListHeaderComponent={<View style={{ height: height, width: '100%' }} />}
            renderItem={renderItem}
            onStartReachedThreshold={0.5}
            maintainVisibleContentPosition={{
              disabled: true,
              startRenderingFromBottom: true,
            }}
            onStartReached={onStartReached}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContent(footerHeight, headerHeight)}
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          />
        </KeyboardStickyView>
      )}

      <Footer listRef={listRef.current} setFooterHeight={setFooterHeight} footerHeight={footerHeight} onSend={addMessage} />
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
  listContent: (paddingBottom: number, paddingTop: number) => ({
    paddingHorizontal: theme.spacing.lg,
    paddingBottom,
    gap: theme.spacing.sm,
    paddingTop: paddingTop + theme.spacing.md,
  }),
}))
