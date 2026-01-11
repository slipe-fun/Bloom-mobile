import { Button, Icon } from '@components/ui'
import { zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { TAB_ICONS } from '@constants/tabBar'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import type React from 'react'
import Animated from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function TabBarSearchBackButton(): React.JSX.Element {
  const { theme } = useUnistyles()
  const { setSearch } = useTabBarStore()
  const activeTab = useNavigationState((state) => state.routes[state.index].name)

  const tabIcon = TAB_ICONS[activeTab]

  return (
    <AnimatedButton
      onPress={() => setSearch(false)}
      variant="icon"
      size="lg"
      key="tabBarBackButton"
      blur
      exiting={zoomAnimationOut}
      entering={zoomAnimationIn}
    >
      <Icon size={30} icon={tabIcon} color={theme.colors.text} />
    </AnimatedButton>
  )
}
