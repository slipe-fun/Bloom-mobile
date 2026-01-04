import { useInsets } from '@hooks'
import type { User as UserType } from '@interfaces'
import useSettingsScreenStore from '@stores/settings'
import type React from 'react'
import { type LayoutChangeEvent, View } from 'react-native'
import type { SharedValue } from 'react-native-reanimated'
import { styles } from './Header.styles'
import User from './user'
import HeaderAvatar from './user/Avatar'

type HeaderProps = {
  scrollY: SharedValue<number>
  user: UserType
}

export default function Header({ scrollY, user }: HeaderProps): React.JSX.Element {
  const insets = useInsets()
  const { setSnapEndPosition } = useSettingsScreenStore()

  const onHeaderLayout = (event: LayoutChangeEvent) => {
    setSnapEndPosition(event.nativeEvent.layout.height - insets.top)
  }

  return (
    <View onLayout={onHeaderLayout} style={styles.header(insets.top)}>
      <HeaderAvatar user={user} scrollY={scrollY} />
      <User scrollY={scrollY} user={user} />
    </View>
  )
}
