import { Button, Icon } from '@components/ui'
import { useInsets } from '@hooks'
import { useNavigationState } from '@react-navigation/native'
import { useRouter } from 'expo-router'
import { View } from 'react-native'
import { FadeIn, FadeOut } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Header.styles'

export default function AuthHeader() {
  const index = useNavigationState((state) => state.index)
  const router = useRouter()
  const { theme } = useUnistyles()
  const insets = useInsets()

  const disabled = index === 0 || index === 3

  const back = () => {
    router.canGoBack() && router.back()
  }

  return (
    <View style={styles.header(insets.top)}>
      {!disabled && (
        <Button
          entering={FadeIn}
          exiting={FadeOut}
          onPress={back}
          variant="icon"
          icon={<Icon icon="chevron.left" color={theme.colors.text} size={26} />}
        />
      )}
    </View>
  )
}
