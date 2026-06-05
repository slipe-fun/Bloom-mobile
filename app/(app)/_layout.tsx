import { Stack } from '@layouts/Stack'
import { settingsTransition } from '@layouts/settingsTransition'
import { screenTransition } from '@layouts/transition'

export default function AppLayout() {
  return (
    <Stack id={undefined}>
      <Stack.Screen name="index" options={screenTransition()} />
      <Stack.Screen name="chat/[chat]" options={screenTransition()} />
      <Stack.Screen name="NewMessage" options={settingsTransition()} />
      <Stack.Screen name="(settings)" options={settingsTransition()} />
    </Stack>
  )
}
