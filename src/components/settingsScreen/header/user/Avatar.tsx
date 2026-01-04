import { Avatar } from '@components/ui'
import type { User } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import { BlurView, type BlurViewProps } from 'expo-blur'
import type React from 'react'
import type { ViewStyle } from 'react-native'
import { Haptics } from 'react-native-nitro-haptics'
import Animated, {
  interpolate,
  runOnJS,
  type SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { styles } from './User.styles'

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

type HeaderAvatarProps = {
  scrollY: SharedValue<number>
  user: User
}

export default function HeaderAvatar({ scrollY, user }: HeaderAvatarProps): React.JSX.Element {
  const { snapEndPosition } = useSettingsScreenStore()
  const isAvatarExpanded = useSharedValue<boolean>(false)

  const animatedStyle = useAnimatedStyle(
    (): ViewStyle => ({
      transform: [
        {
          scale: interpolate(scrollY.get(), [-40, 0, snapEndPosition], [1.4, 1, 0.25], 'clamp'),
        },
        { translateY: interpolate(scrollY.get(), [0, snapEndPosition], [0, -30], 'clamp') },
      ],
      opacity: interpolate(scrollY.get(), [0, snapEndPosition], [1, 0], 'clamp'),
      borderRadius: interpolate(scrollY.get(), [-35, 0], [50 / 1.4, 50], 'clamp'),
    }),
  )

  const animatedBlurStyle = useAnimatedProps(
    (): BlurViewProps => ({
      intensity: interpolate(scrollY.get(), [0, snapEndPosition], [0, 64], 'clamp'),
    }),
  )

  // const avatarHapticsTrigger = () => {
  //   Haptics.impact("light");
  // };

  // useAnimatedReaction(
  //   () => isAvatarExpanded.get(),
  //   (prepared, previous) => {
  //     if (prepared) {
  //       runOnJS(avatarHapticsTrigger)();
  //     }
  //   }
  // );

  useAnimatedReaction(
    () => scrollY.get(),
    (prepared, previous) => {
      if (prepared <= -25) {
        isAvatarExpanded.set(true)
      }
    },
  )

  return (
    <Animated.View style={[styles.avatarWrapper, animatedStyle]}>
      <Avatar size="2xl" image={user?.avatar} username={user?.username || user?.display_name} style={styles.avatar} />
      <AnimatedBlurView
        tint="dark"
        experimentalBlurMethod="dimezisBlurView"
        animatedProps={animatedBlurStyle}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  )
}
