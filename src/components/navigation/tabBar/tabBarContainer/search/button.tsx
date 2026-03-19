import { Button, Icon } from '@components/ui'
import { getFadeIn, getFadeOut, layoutAnimation, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { TAB_BAR_HEIGHT } from '../..'

export default function TabBarButton({ inputRef }) {
  const { theme } = useUnistyles()
  const { search, setSearch, searchFocused, setSearchValue, searchValue } = useTabBarStore()
  const activeTab = useNavigationState((state) => state.routes[state.index].name)

  const chatsTab = activeTab === 'index'

  const renderX = search ? searchFocused || searchValue.trim().length : false

  const blurInput = () => {
    setSearchValue('')
    inputRef?.current.blur()
  }

  return renderX ? (
    <Button
      size="lg"
      key="tabBarSearchButtonX"
      variant="icon"
      exiting={zoomAnimationOut}
      entering={zoomAnimationIn}
      onPress={() => blurInput()}
      layout={layoutAnimation}
    >
      <Icon icon="x" color={theme.colors.text} size={26} />
    </Button>
  ) : !search ? (
    <LayoutAnimationConfig skipEntering skipExiting>
      <Button
        style={{ width: TAB_BAR_HEIGHT, height: TAB_BAR_HEIGHT }}
        variant="icon"
        key="tabBarSearchButtonMain"
        exiting={zoomAnimationOut}
        layout={layoutAnimation}
        entering={zoomAnimationIn}
        onPress={() => (chatsTab ? setSearch(!search) : {})}
      >
        <LayoutAnimationConfig skipEntering skipExiting>
          <Animated.View key="searchButton" entering={getFadeIn()} exiting={getFadeOut()}>
            <Icon icon="magnifyingglass" color={theme.colors.text} size={30} />
          </Animated.View>
        </LayoutAnimationConfig>
      </Button>
    </LayoutAnimationConfig>
  ) : null
}
