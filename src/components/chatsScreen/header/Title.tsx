import { Icon, Loader } from '@components/ui'
import { getCharEnter, getCharExit } from '@constants/animations'
import { Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './header.styles'

export default function Title({ state }) {
  const { theme } = useUnistyles()

  return state !== 'connecting' ? (
    <Animated.View key="connected" style={styles.container} entering={getCharEnter()} exiting={getCharExit()}>
      <Icon icon="logo" color={theme.colors.primary} size={28} />
      <Text style={styles.text}>Bloom</Text>
    </Animated.View>
  ) : (
    <Animated.View key="connecting" style={styles.container} entering={getCharEnter()} exiting={getCharExit()}>
      <Loader size={22} color={theme.colors.yellow} />
      <Text style={styles.text}>Подключение</Text>
    </Animated.View>
  )
}
