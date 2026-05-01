import { Button, Icon } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimationSpringy } from '@constants/animations'
import { useAuthFooter } from '@hooks'
import { useTranslation } from 'react-i18next'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './Footer.styles'

export default function AuthFooter() {
  const { theme } = useUnistyles()
  const { handlePress } = useAuthFooter()
  const { t } = useTranslation('auth')

  return (
    <Animated.View style={styles.footer}>
      <Button
        onPress={handlePress}
        size="xl"
        elevated={true}
        style={styles.button}
        variant="textIcon"
        icon={
          <Animated.View entering={getFadeIn()} exiting={getFadeOut()}>
            <Icon key="id" size={24} color={theme.colors.white} icon="id" />
          </Animated.View>
        }
      >
        <Animated.View layout={layoutAnimationSpringy} style={styles.partsContainer}>
          {t('auth:footer.faceIDBtn')
            .split(' ')
            .map((part) => (
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
      </Button>
    </Animated.View>
  )
}
