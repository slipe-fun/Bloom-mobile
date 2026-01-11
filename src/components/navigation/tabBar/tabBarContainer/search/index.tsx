import { Button, Icon } from '@components/ui'
import { layoutAnimation, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { useNavigationState } from '@react-navigation/native'
import useTabBarStore from '@stores/tabBar'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './search.styles'

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function TabBarSearchButton({ inputRef }) {
  const { theme } = useUnistyles()
  const { search, setSearch, searchFocused, setSearchValue, searchValue } = useTabBarStore()
  const activeTab = useNavigationState((state) => state.routes[state.index].name)

  const settingsTab = activeTab === 'Settings'
  const renderX = search ? searchFocused || searchValue.trim().length : false

  const blurInput = () => {
    setSearchValue('')
    inputRef?.current.blur()
  }

  return renderX ? (
    <AnimatedButton
      size="lg"
      blur
      key="tabBarSearchButtonX"
      variant="icon"
      exiting={zoomAnimationOut}
      entering={zoomAnimationIn}
      onPress={() => blurInput()}
      layout={layoutAnimation}
    >
      <Icon icon="x" color={theme.colors.text} size={26} />
    </AnimatedButton>
  ) : !search ? (
    <AnimatedButton
      style={styles.searchButton}
      blur
      variant="icon"
      key="tabBarSearchButtonMain"
      exiting={zoomAnimationOut}
      layout={layoutAnimation}
      entering={zoomAnimationIn}
      onPress={() => (settingsTab ? {} : setSearch(!search))}
    >
      <LayoutAnimationConfig skipEntering skipExiting>
        {settingsTab ? (
          <Animated.View key="editButton" entering={zoomAnimationIn} exiting={zoomAnimationOut}>
            <Icon icon="pencil" color={theme.colors.text} size={30} />
          </Animated.View>
        ) : (
          <Animated.View key="searchButton" entering={zoomAnimationIn} exiting={zoomAnimationOut}>
            <Icon icon="magnifyingglass" color={theme.colors.text} size={30} />
          </Animated.View>
        )}
      </LayoutAnimationConfig>
    </AnimatedButton>
  ) : null
}
