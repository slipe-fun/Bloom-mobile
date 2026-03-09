import useGoogleOauth2 from '@api/hooks/useGoogleOauth2'
import { Button, Icon, Separator } from '@components/ui'
import { useInsets } from '@hooks'
import { useTranslation } from 'react-i18next'
import { Image, Platform, View } from 'react-native'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Actions.styles'

export default function AuthActions() {
  const { theme } = useUnistyles()
  const insets = useInsets()
  const { startGoogleAuth } = useGoogleOauth2()
  const { t } = useTranslation()

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
        label={t(iOS ? 'auth:footer.appleBtn' : 'auth:footer.googleBtn')}
        onPress={() => onPress(iOS ? 'apple' : 'google')}
        size="xl"
        variant="textIcon"
      />

      <Separator label={t('auth:footer.separator')} style={styles.separatorContainer} />
      {iOS && (
        <Button
          labelStyle={styles.buttonLabel(false)}
          style={styles.button(false)}
          icon={focusedIcon(false)}
          label={t('auth:footer.emailBtn')}
          onPress={() => onPress('google')}
          size="xl"
          variant="textIcon"
        />
      )}
    </View>
  )
}
