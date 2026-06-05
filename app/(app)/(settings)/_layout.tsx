import { Stack } from '@layouts/Stack'
import { screenTransition } from '@layouts/transition'
// import { zoomTransition } from '@layouts/zoomTransition'

export default function SettingsLayout() {
  return (
    <Stack id={undefined}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Appearance" options={screenTransition()} />
    </Stack>
  )
}
