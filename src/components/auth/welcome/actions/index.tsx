import { Button, Separator } from '@components/ui'
import { useInsets } from '@hooks'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'
import { styles } from './Actions.styles'

export default function AuthActions() {
  const insets = useInsets()
  const { t } = useTranslation()

  const iOS = Platform.OS === 'ios'

  return (
    <View style={styles.actionsContainer(52 + insets.bottom)}>
      <Button
        elevated={false}
        style={styles.button(true)}
        labelStyle={styles.buttonLabel(true)}
        label={t(iOS ? 'auth:footer.appleBtn' : 'auth:footer.googleBtn')}
        size="xl"
        variant="textIcon"
      />

      <Separator label={t('auth:footer.separator')} style={styles.separatorContainer} />
      {iOS && (
        <Button
          labelStyle={styles.buttonLabel(false)}
          style={styles.button(false)}
          elevated={false}
          label={t('auth:footer.emailBtn')}
          size="xl"
          variant="textIcon"
        />
      )}
    </View>
  )
}
