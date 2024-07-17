import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '../Context';

function FontSizeSetting() {
  const { t } = useTranslation();
  const { fontSize, setFontSize } = useSettingsContext();
  const increaseSize = () => {
    if (fontSize + 4 > 32) return;
    setFontSize(fontSize + 4);
  };
  const decreaseSize = () => {
    if (fontSize - 4 < 24) return;
    setFontSize(fontSize - 4);
  };
  return (
    <div className="setting_wrapper">
      <div className="setting_info">
        <p>{t('fontSize')}</p>
        <p>{`${fontSize}px`}</p>
      </div>
      <div className="setting_buttons">
        <button type="button" onClick={decreaseSize}>-</button>
        <button type="button" onClick={increaseSize}>+</button>
      </div>
    </div>

  );
}

export default FontSizeSetting;
