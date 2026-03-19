import { Button, Icon } from '@components/ui'
import { zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { TAB_ICONS } from '@constants/tabBar'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import { useUnistyles } from 'react-native-unistyles'

export default function TabBarSearchBackButton() {
  const { theme } = useUnistyles()
  const setSearch = useTabBarStore((state) => state.setSearch)
  const activeTab = useNavigationState((state) => state.routes[state.index].name)

  const tabIcon = TAB_ICONS[activeTab]

  return (
    <Button
      onPress={() => setSearch(false)}
      variant="icon"
      size="lg"
      key="tabBarBackButton"
      exiting={zoomAnimationOut}
      entering={zoomAnimationIn}
    >
      <Icon size={28} icon={tabIcon} color={theme.colors.text} />
    </Button>
  )
}
