import { createContext, useContext } from "react";

export const MotionContext = createContext({
  enabled: false,
  ready: false,
  systemReduced: false,
  toggle: () => {},
});
export const useMotion = () => useContext(MotionContext);
