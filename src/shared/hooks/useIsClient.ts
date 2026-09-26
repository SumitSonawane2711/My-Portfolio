import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false during SSR and the hydration render, true afterwards — without the
// extra render (and lint error) of setting state inside an effect.
export const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
