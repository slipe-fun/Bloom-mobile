import Empty from '@components/chat/Empty'
import Footer from '@components/chat/footer'
import Header from '@components/chat/header'
import type { ListItem, OnItemPressEvent } from '@modules/hybrid-list-view/src/HybridListView.types'
import { HybridListView } from '@modules/hybrid-list-view/src/HybridListViewModule'
import { useLocalSearchParams } from 'expo-router'
import { View } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export default function Chat() {
  const { chat } = useLocalSearchParams()
  const { theme } = useUnistyles()

  const mockData: ListItem[] = [
    { id: 1, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 2, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 3, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 4, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 5, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 6, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 7, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 8, content: 'Элемент 1', seen: false, date: '123', me: true },
    { id: 9, content: 'Элемент 1', seen: false, date: '123', me: true },
  ]

  // Статичный фоллбек для примера работы:
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
      <HybridListView data={mockData} theme={listTheme} onItemPress={handlePress} style={styles.list} />
      {/* <Empty /> */}
      <Header />
      <Footer />
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
