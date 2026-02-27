import SearchUser from '@components/chats/search/SearchUser'
import { Button, GradientBlur, Icon } from '@components/ui'
import { API_URL } from '@constants/api'
import { useInsets } from '@hooks'
import type { SearchUser as SearchUserType, User } from '@interfaces'
import axios from 'axios'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { type ListRenderItem, Text, View } from 'react-native'
import Transition from 'react-native-screen-transitions'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export default function NewMessage() {
  const [users, setUsers] = useState<User[]>([])
  const insets = useInsets()
  const [_loadingUsers, setLoadingUsers] = useState(false)
  const { theme } = useUnistyles()
  const router = useRouter()

  const lastIndex = users?.length - 1

  const headerHeight = theme.spacing.lg + theme.spacing.md + 44

  const renderItem: ListRenderItem<SearchUserType> = useCallback(
    ({ item, index }) => {
      return <SearchUser user={item} isLast={index === lastIndex} />
    },
    [lastIndex],
  )

  const keyExtractor = useCallback((item: User) => {
    return String(item?.id)
  }, [])

  const handlePress = () => {
    router.back()
  }

  useEffect(() => {
    const abortController = new AbortController()

    const fetchUsers = async () => {
      setLoadingUsers(true)
      try {
        const response = await axios.get<User[]>(`${API_URL}/users`, {
          signal: abortController.signal,
        })
        setUsers(response.data)
      } catch (_error) {
      } finally {
        setLoadingUsers(false)
      }
    }

    fetchUsers()

    return () => {
      abortController.abort()
    }
  }, [])
  return (
    <View style={styles.container}>
      <Transition.FlatList
        style={{ flex: 1 }}
        keyExtractor={keyExtractor}
        scrollIndicatorInsets={{ bottom: insets.bottom, top: headerHeight }}
        contentContainerStyle={styles.listContent(insets.bottom, headerHeight)}
        renderItem={renderItem}
        data={users}
      />
      <View style={styles.header}>
        <GradientBlur direction="top-to-bottom" />
        <Button onPress={handlePress} blur variant="icon">
          <Icon icon="x" color={theme.colors.text} />
        </Button>
        <Text style={styles.title}>Новый чат</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: (paddingBottom: number, paddingTop: number) => ({
    paddingBottom,
    paddingTop: paddingTop,
  }),
  header: {
    width: '100%',
    padding: theme.spacing.lg,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: theme.spacing.md,
    paddingRight: 44 + theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
    flex: 1,
    fontFamily: theme.fontFamily.semibold,
    color: theme.colors.text,
  },
}))
