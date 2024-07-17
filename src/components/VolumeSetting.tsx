import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '../Context';
import AudioPlay from '../helpers/audioPlay';
import KeyPressSound from '../sounds/KeyPressSound.mp3';

function VolumeSetting() {
  const { volume, setVolume } = useSettingsContext();
  const { t } = useTranslation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    AudioPlay(KeyPressSound, Number(e.target.value));
    setVolume(Number(e.target.value));
  };
  return (
    <div className="setting_wrapper">
      <div className="setting_info">
        <p>{t('volume')}</p>
      </div>
      <div className="range_container">
        <input type="range" min="0" max="1" step="0.1" value={volume} onChange={handleChange} />
      </div>
    </div>
  );
}

export default VolumeSetting;
