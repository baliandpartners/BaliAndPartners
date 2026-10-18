import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

/** Keep editable SSR controls inactive until React can preserve their input. */
export function useHydrated() {
  return useSyncExternalStore(subscribe, clientReady, serverReady);
}
