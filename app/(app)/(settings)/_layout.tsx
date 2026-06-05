import { Stack } from '@layouts/Stack'
import { settingsTransition } from '@layouts/settingsTransition'
import { screenTransition } from '@layouts/transition'

export default function SettingsLayout() {
  return (
    <Stack id={undefined}>
      <Stack.Screen name="index" options={settingsTransition()} />
      <Stack.Screen name="Profile" options={screenTransition()} />
      <Stack.Screen name="Language" options={screenTransition()} />
      <Stack.Screen name="Appearance" options={screenTransition()} />
      <Stack.Screen name="KeyPassword" options={screenTransition()} />
    </Stack>
  )
}
