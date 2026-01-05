import TabBar from '@components/navigation/tabBar'
import { quickSpring } from '@constants/animations'
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'
import { Tabs } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'

const springOptions: BottomTabNavigationOptions = {
  transitionSpec: {
    animation: 'spring',
    config: quickSpring,
  },
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, animation: 'fade', sceneStyle: styles.scene }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="friends" options={springOptions} />
      <Tabs.Screen name="explore" options={springOptions} />
      <Tabs.Screen name="index" options={springOptions} />
      <Tabs.Screen name="settings" options={springOptions} />
    </Tabs>
  )
}

const styles = StyleSheet.create((theme) => ({
  scene: {
    backgroundColor: theme.colors.background,
  },
}))
