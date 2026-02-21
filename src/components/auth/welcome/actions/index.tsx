import useGoogleOauth2 from '@api/hooks/useGoogleOauth2'
import { Button, Icon, Separator } from '@components/ui'
import { useInsets } from '@hooks'
import { Image, Platform, View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Actions.styles'

export default function AuthActions() {
  const { theme } = useUnistyles()
  const insets = useInsets()
  const { startGoogleAuth } = useGoogleOauth2()

  const iOS = Platform.OS === 'ios'

  const focusedIcon = (value: boolean, light?: boolean) =>
    value ? (
      <Icon size={26} icon="apple.logo" color={light ? theme.colors.text : theme.colors.background} />
    ) : (
      <Image style={styles.imageIcon} source={require('@assets/logos/google.webp')} />
    )

  const onPress = async (method: string) => {
    if (method === 'google') {
      await startGoogleAuth()
    }
  }

  return (
    <View style={styles.actionsContainer(52 + insets.bottom)}>
      <Button
        style={styles.button(true)}
        labelStyle={styles.buttonLabel(true)}
        icon={focusedIcon(iOS)}
        label={iOS ? 'Продолжить с Apple' : 'Продолжить с Google'}
        onPress={() => onPress(iOS ? 'apple' : 'google')}
        size="xl"
        variant="textIcon"
      />

      <Separator label="ИЛИ" style={styles.separatorContainer} />
      {iOS && (
        <Button
          labelStyle={styles.buttonLabel(false)}
          style={styles.button(false)}
          icon={focusedIcon(false)}
          label={'Продолжить с Google'}
          onPress={() => onPress('google')}
          size="xl"
          variant="textIcon"
        />
      )}
    </View>
  )
}
