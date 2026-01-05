import { Button, Icon } from '@components/ui'
import { charAnimationIn, charAnimationOut, layoutAnimation, zoomAnimationIn, zoomAnimationOut } from '@constants/animations'
import { ROUTES } from '@constants/routes'
import useTabBarStore from '@stores/tabBar'
import type React from 'react'
import { TextInput } from 'react-native'
import Animated, { LayoutAnimationConfig } from 'react-native-reanimated'
import { useUnistyles } from 'react-native-unistyles'
import { styles } from './search.styles'

const AnimatedButton = Animated.createAnimatedComponent(Button)

export default function TabBarSearchButton({ inputRef }): React.JSX.Element {
  const { theme } = useUnistyles()
  const { isSearch, activeTab, setIsSearch, isSearchFocused, setSearchValue, searchValue } = useTabBarStore()

  const settingsTab = activeTab === ROUTES.tabs.settings
  const renderX = isSearch ? isSearchFocused || searchValue.trim().length : false

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
      <Icon icon="x" color={theme.colors.text} size={28} />
    </AnimatedButton>
  ) : !isSearch ? (
    <AnimatedButton
      style={styles.searchButton}
      blur
      variant="icon"
      key="tabBarSearchButtonMain"
      exiting={zoomAnimationOut}
      layout={layoutAnimation}
      entering={zoomAnimationIn}
      onPress={() => (settingsTab ? {} : setIsSearch(!isSearch))}
    >
      <LayoutAnimationConfig skipEntering skipExiting>
        {settingsTab ? (
          <Animated.View key="editButton" entering={charAnimationIn} exiting={charAnimationOut}>
            <Icon icon="pencil" color={theme.colors.text} size={30} />
          </Animated.View>
        ) : (
          <Animated.View key="searchButton" entering={charAnimationIn} exiting={charAnimationOut}>
            <Icon icon="magnifyingglass" size={30} />
          </Animated.View>
        )}
      </LayoutAnimationConfig>
    </AnimatedButton>
  ) : null
}
