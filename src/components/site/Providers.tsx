import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { ThemeProvider, LayoutProvider } from '@once-ui-system/core/contexts';

const MotionContext = createContext({ running: false });

export function Providers({ children }: { children: ReactNode }) {
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setRunning(!preference.matches && !document.hidden);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = running ? 'running' : 'paused';
  }, [running]);
  return (
    <ThemeProvider
      theme="dark"
      neutral="gray"
      brand="blue"
      accent="indigo"
      solid="contrast"
      solidStyle="flat"
      border="rounded"
      surface="filled"
      transition="micro"
      scaling="100"
      persistence="none"
    >
      <LayoutProvider>
        <MotionContext.Provider value={{ running }}>
          {children}
        </MotionContext.Provider>
      </LayoutProvider>
    </ThemeProvider>
  );
}
export const useMotion = () => useContext(MotionContext);
