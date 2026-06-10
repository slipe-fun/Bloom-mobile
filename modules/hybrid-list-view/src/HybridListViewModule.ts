import { NativeModule, requireNativeModule } from 'expo';

declare class HybridListViewModule extends NativeModule<{}> {}

export default requireNativeModule<HybridListViewModule>('HybridListView');
