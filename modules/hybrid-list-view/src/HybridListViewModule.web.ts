import { registerWebModule, NativeModule } from 'expo';

// HybridListViewModule is not available on the web platform.
class HybridListViewModule extends NativeModule<{}> {}

export default registerWebModule(HybridListViewModule, 'HybridListViewModule');
