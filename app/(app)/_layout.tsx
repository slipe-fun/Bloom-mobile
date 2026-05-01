import { Stack } from '@layouts/Stack'
import { sheetTransition } from '@layouts/sheetTransition'
import { screenTransition } from '@layouts/transition'

export default function AppLayout() {
  return (
    <Stack id={undefined}>
      <Stack.Screen name="index" options={screenTransition()} />
      <Stack.Screen name="chat/[chat]" options={screenTransition()} />
      <Stack.Screen name="NewMessage" options={sheetTransition()} />
    </Stack>
  )
}
