import useMessages from '@api/hooks/encryption/useMessages'
import EmptyModal from '@components/chatScreen/emptyModal'
import Footer from '@components/chatScreen/footer'
import Header from '@components/chatScreen/header'
import Message from '@components/chatScreen/message'
import type { Chat as ChatType, Message as MessageType } from '@interfaces'
import type { LegendListRef } from '@legendapp/list'
import { KeyboardAvoidingLegendList } from '@legendapp/list/keyboard'
import { useCallback, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

interface ChatScreenProps {
  route: {
    params: {
      chat: ChatType
    }
  }
}

export default function Chat({ route }: ChatScreenProps) {
  const { chat } = route.params

  const { messages, addMessage } = useMessages(chat?.id)
  const [seenId, setSeenId] = useState<number>(0)
  const [footerHeight, setFooterHeight] = useState<number>(0)
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const [lastMessageId, setLastMessageId] = useState<number>(0)
  const listRef = useRef<LegendListRef>(null)

  const renderItem = useCallback(
    ({ item, index }: { item: MessageType; index: number }) => {
      if (item?.type === 'date_header') {
        return
      }

      const prevItem = messages[index - 1]
      const nextItem = messages[index + 1]

      return <Message key={item?.nonce} seen={seenId === item?.id} message={item} prevItem={prevItem} nextItem={nextItem} />
    },
    [seenId, lastMessageId, footerHeight, messages, footerHeight],
  )

  const keyExtractor = useCallback((item: MessageType, index: number) => {
    return String(item?.nonce ?? item?.id ?? index)
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
      <Header onLayout={setHeaderHeight} chat={chat} />
      <EmptyModal chat={chat} visible={messages.length === 0} />
      <KeyboardAvoidingLegendList
        data={messages}
        renderItem={renderItem}
        alignItemsAtEnd
        maintainScrollAtEnd
        ref={listRef}
        keyExtractor={keyExtractor}
        style={styles.list}
        contentInset={{ bottom: footerHeight, top: headerHeight }}
        contentContainerStyle={[styles.listContent]}
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      />
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
