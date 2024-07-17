import {
  ReactNode, createContext, useContext,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

interface SettingsContexType {
  isEnglish: boolean
  isTypos: boolean
  fontSize: number
  volume: number
  setIsEnglish: (arg: boolean) => void
  setIsTypos: (arg: boolean) => void
  setFontSize: (size: number) => void
  setVolume: (volume: number) => void
}

const SettingsContext = createContext<SettingsContexType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw Error('Something went wrong');
  }
  return context;
};
interface SettingsProviderProps {
  children: ReactNode
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState<boolean>(i18n.language === 'en-US');
  const [isTypos, setIsTypos] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(24);
  const [volume, setVolume] = useState<number>(0.1);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <SettingsContext.Provider value={{
      isEnglish, isTypos, fontSize, volume, setIsEnglish, setIsTypos, setFontSize, setVolume,
    }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
