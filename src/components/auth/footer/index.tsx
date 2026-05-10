import likeAnimation from '@assets/lottie/faceId.json'
import { ActionText, AnimatedIcon, Button, Loader } from '@components/ui'
import { authAnimationIn, getFadeIn, getFadeOut, layoutAnimationSpringy, springyChar } from '@constants/animations'
import { useAuthFooter } from '@hooks'
import { useNavigationState } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import Animated, { interpolateColor, useAnimatedStyle } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { useAnimatedTheme } from 'react-native-unistyles/reanimated'
import { styles } from './Footer.styles'

export default function AuthFooter() {
  const { theme } = useUnistyles()
  const index = useNavigationState((state) => state.index)
  const { handleFaceIdAuth, progress } = useAuthFooter()
  const { t } = useTranslation('auth')
  const animatedTheme = useAnimatedTheme()

  const loading = false
  const text: string = index === 0 ? t('auth:footer.faceIDBtn') : t('auth:footer.continueBtn')

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.get(), [0, 1], [animatedTheme.value.colors.primary, animatedTheme.value.colors.red]),
  }))

  return (
    <Animated.View entering={authAnimationIn(springyChar(3, true))} layout={layoutAnimationSpringy} style={styles.footer}>
      <Button
        onPress={handleFaceIdAuth}
        size="xl"
        elevated={true}
        disabled={loading}
        layout={layoutAnimationSpringy}
        style={[styles.button, animatedButtonStyle]}
        variant="textIcon"
        icon={
          index === 0 &&
          !loading && (
            <Animated.View layout={layoutAnimationSpringy} entering={getFadeIn()} exiting={getFadeOut()}>
              <AnimatedIcon color={theme.colors.white} size={26} source={likeAnimation} />
            </Animated.View>
          )
        }
      >
        {loading ? (
          <Loader color={theme.colors.white} size={28} />
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
