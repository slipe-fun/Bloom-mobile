import Empty from '@components/chat/Empty'
import Footer from '@components/chat/footer'
import Header from '@components/chat/header'
import { SIZE_MAP } from '@components/ui/button/constats'
import { base } from '@design/base'
import { useChatController, useInsets } from '@hooks'
import type { OnItemPressEvent } from '@modules/hybridlist'
import { HybridListView } from '@modules/hybridlist'
import useChatStore from '@stores/chat'
import { View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export default function Chat() {
  const insets = useInsets()
  const { theme } = useUnistyles()
  const chat = useChatStore((state) => state.chat)
  const { messages, seenID, addMessage, nextPage } = useChatController({ chat })

  const FOOTER_HEIGHT = SIZE_MAP.md + base.spacing.lg
  const HEADER_HEIGHT = SIZE_MAP.md + base.spacing.xxxl + 16 + insets.top

  const listTheme = {
    backgroundColor: theme.colors.background,
    textColor: theme.colors.text,
    secondaryTextColor: theme.colors.secondaryText,
    primaryColor: theme.colors.primary,
    whiteColor: theme.colors.white,
    foregroundColor: theme.colors.foreground,
  }

  const handlePress = (event: OnItemPressEvent) => {
    const { index, item } = event.nativeEvent
    console.log(`Нажат элемент #${index}:`, item)
  }

  return (
    <View style={styles.container}>
      <HybridListView
        contentInsetTop={HEADER_HEIGHT}
        contentInsetBottom={FOOTER_HEIGHT}
        data={messages}
        theme={listTheme}
        lastSeenId={seenID}
        onItemPress={handlePress}
        style={styles.list}
      />
      {messages.length < 1 && <Empty />}
      <Header chat={chat} />
      <Footer handleSend={(event) => addMessage(event?.content)} />
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
}))
