import { NativeModule, requireNativeModule } from 'expo'

import type { HybridChatModuleEvents } from './HybridChat.types'

declare class HybridChatModule extends NativeModule<HybridChatModuleEvents> {
  PI: number
  hello(): string
  setValueAsync(value: string): Promise<void>
}

// This call loads the native module object from the JSI.
export default requireNativeModule<HybridChatModule>('HybridListView')
