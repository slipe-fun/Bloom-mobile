import { ActionText, Button, Icon, Loader } from '@components/ui'
import { authAnimationIn, getFadeIn, getFadeOut, layoutAnimationSpringy, springyChar } from '@constants/animations'
import { useAuthFooter } from '@hooks'
import { useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'

export default function AuthFooter() {
  const { theme } = useUnistyles()
  const index = useNavigationState((state) => state.index)
  const { handlePress } = useAuthFooter()
  const { t } = useTranslation('auth')
  const loading = true

  const text = index === 0 ? t('auth:footer.faceIDBtn') : t('auth:footer.continueBtn')

  return (
    <Animated.View entering={authAnimationIn(springyChar(3, true))} layout={layoutAnimationSpringy} style={styles.footer}>
      <Button
        onPress={handlePress}
        size="xl"
        elevated={true}
        layout={layoutAnimationSpringy}
        style={styles.button}
        variant="textIcon"
        icon={
          index === 0 &&
          !loading && (
            <Animated.View layout={layoutAnimationSpringy} entering={getFadeIn()} exiting={getFadeOut()}>
              <Icon key="id" size={24} color={theme.colors.white} icon="id" />
            </Animated.View>
          )
        }
      >
        {loading ? (
          <Loader color={theme.colors.white} size={24} />
        ) : (
          <Animated.View layout={layoutAnimationSpringy} style={styles.partsContainer}>
            {text.split(' ').map((part) => (
              <Animated.Text
                key={part}
                entering={getFadeIn()}
                exiting={getFadeOut()}
                layout={layoutAnimationSpringy}
                style={styles.buttonLabel}
              >
                {part}{' '}
              </Animated.Text>
            ))}
          </Animated.View>
        )}
      </Button>
      <ActionText
        text={index === 0 ? t('auth:footer.underText') : t('auth:footer.underTextSuccess')}
        actionText={index === 0 ? t('auth:footer.underTextAction') : ''}
      />
    </Animated.View>
  )
}
