import { useSyncExternalStore } from 'react';
import { marketplaceStore, MarketplaceState } from '../services/store';

export function useStore(): MarketplaceState {
  return useSyncExternalStore(
    (onStoreChange) => marketplaceStore.subscribe(onStoreChange),
    () => marketplaceStore.getState(),
    () => marketplaceStore.getState()
  );
}
