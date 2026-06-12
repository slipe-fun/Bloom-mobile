import Empty from '@components/chat/Empty'
import Footer from '@components/chat/footer'
import Header from '@components/chat/header'
import { SIZE_MAP } from '@components/ui/button/constats'
import { base } from '@design/base'
import { useInsets } from '@hooks'
import type { ListItem, OnItemPressEvent } from '@modules/hybridlist'
import { HybridListView } from '@modules/hybridlist'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export default function Chat() {
  const { _chat } = useLocalSearchParams()
  const insets = useInsets()
  const { theme } = useUnistyles()
  const [data, setData] = useState<ListItem[]>([])

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
        data={data}
        theme={listTheme}
        onItemPress={handlePress}
        style={styles.list}
      />
      {data.length < 1 && <Empty />}
      <Header />
      <Footer handleSend={(event) => setData((prev) => [...prev, event])} />
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
