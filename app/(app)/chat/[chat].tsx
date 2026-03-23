import EmptyModal from '@components/chatScreen/emptyModal'
import Footer from '@components/chatScreen/footer'
import Header from '@components/chatScreen/header'
import Message from '@components/chatScreen/message'
import { base } from '@design/base'
import { useChatController, useInsets } from '@hooks'
import type { Message as MessageType } from '@interfaces'
import { FlashList, type FlashListRef } from '@shopify/flash-list'
import { useLocalSearchParams } from 'expo-router'
import { useCallback, useRef, useState } from 'react'
import { View } from 'react-native'
import { KeyboardChatScrollView, type KeyboardChatScrollViewProps } from 'react-native-keyboard-controller'
import { StyleSheet } from 'react-native-unistyles'

export default function Chat() {
  const { chat } = useLocalSearchParams<{ chat: string }>()

  const mountTimestamp = useRef(Date.now())
  const listRef = useRef<FlashListRef<MessageType>>(null)

  const [footerHeight, setFooterHeight] = useState<number>(0)

  const insets = useInsets()
  const { messages, seenID, addMessage, nextPage, _chat } = useChatController({ chat, listRef: listRef.current })

  const headerHeight = insets.top + 44 + base.spacing.md

  const renderItem = useCallback(
    ({ item }: { item: MessageType }) => {
      const grouped = !item.groupEnd && !item.groupStart
      const marginBottom = grouped ? base.spacing.xs : item.groupEnd ? base.spacing.lg : base.spacing.xs

      const messageTime = typeof item.date === 'number' ? item.date : new Date(item.date).getTime()
      const shouldAnimate = messageTime > mountTimestamp.current

      return <Message seen={seenID >= item.id} message={item} marginBottom={marginBottom} shouldAnimate={shouldAnimate} />
    },
    [seenID],
  )

  const renderScrollComponent = useCallback(
    (props: KeyboardChatScrollViewProps) => (
      <KeyboardChatScrollView
        {...props}
        contentInsetAdjustmentBehavior="never"
        keyboardDismissMode="on-drag"
        offset={base.spacing.lg}
        automaticallyAdjustContentInsets={false}
        keyboardLiftBehavior="always"
      />
    ),
    [],
  )

  const handleStartReached = useCallback(() => {
    nextPage()
    mountTimestamp.current = Date.now()
  }, [nextPage])

  const keyExtractor = useCallback((item: MessageType) => String(item.id), [])

  return (
    <View style={styles.container}>
      <Header chat={_chat} />
      <EmptyModal chat={_chat} visible={messages.length === 0} />
      <FlashList
        data={messages}
        ref={listRef}
        renderItem={renderItem}
        onStartReachedThreshold={0.5}
        maintainVisibleContentPosition={{
          startRenderingFromBottom: true,
        }}
        onStartReached={handleStartReached}
        keyExtractor={keyExtractor}
        renderScrollComponent={renderScrollComponent}
        contentContainerStyle={styles.listContent(footerHeight, headerHeight)}
        showsVerticalScrollIndicator={false}
      />

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
    paddingTop: paddingTop + theme.spacing.md,
  }),
}))
