import { Button, Icon } from '@components/ui'
import { quickSpring } from '@constants/easings'
import { useInsets } from '@hooks'
import useAuthStore from '@stores/auth'
import type React from 'react'
import { useEffect } from 'react'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { styles } from './Header.styles'

export default function AuthHeader({ navigation }): React.JSX.Element {
  const { index, setIndex } = useAuthStore()
  const insets = useInsets()

  const realIndex = navigation.getState().index
  const disabled = index === 0 || index === 3

  const back = () => {
    setIndex(Math.max(0, index - 1))
    navigation.goBack()
  }

  const animatedViewStyle = useAnimatedStyle(() => ({
    opacity: withSpring(disabled ? 0 : 1, quickSpring),
    transform: [{ translateY: withSpring(disabled ? '-20%' : '0%', quickSpring) }],
  }))

  useEffect(() => {
    setIndex(realIndex)
  }, [])

  useEffect(() => {
    if (realIndex > index) setIndex(realIndex)
  }, [realIndex])

  return (
    <Animated.View style={[styles.header(insets.top), animatedViewStyle]}>
      <Button onPress={back} variant="icon" icon={<Icon icon="chevron.left" size={26} />} />
    </Animated.View>
  )
}
