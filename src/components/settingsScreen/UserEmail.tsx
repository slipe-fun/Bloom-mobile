import type { User } from '@interfaces'
import { Text } from 'react-native'
import { styles } from './Header.styles'

interface FloatingHeaderProps {
  user: User
}

export default function UserEmail({ user }: FloatingHeaderProps) {
  return <Text style={styles.subTitle}>{user.email}</Text>
}
