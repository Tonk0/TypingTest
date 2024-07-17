import { useRef } from 'react';
import FontSizeSetting from './FontSizeSetting';
import LanguageSetting from './LanguageSetting';
import TyposSetting from './TyposSetting';
import VolumeSetting from './VolumeSetting';

interface ISettingsProps {
  setShowSettings: (arg: boolean) => void
}

function Settings({ setShowSettings } : ISettingsProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = (e:React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) setShowSettings(false);
  };
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="overlay" onClick={(e:React.MouseEvent<HTMLDivElement>) => handleOutsideClick(e)} ref={overlayRef}>
      <div className="settings_container">
        <FontSizeSetting />
        <LanguageSetting />
        <TyposSetting />
        <VolumeSetting />
      </div>
    </div>
  );
}

export default Settings;
