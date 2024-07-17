import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '../Context';

function LanguageSetting() {
  const { t, i18n } = useTranslation();
  const { isEnglish, setIsEnglish } = useSettingsContext();

  const setRussian = () => {
    setIsEnglish(false);
    i18n.changeLanguage('ru');
  };
  const setEnglish = () => {
    setIsEnglish(true);
    i18n.changeLanguage('en');
  };
  return (
    <div className="setting_wrapper">
      <div className="setting_info">
        <p>{t('language')}</p>
        {isEnglish ? <p>EN</p> : <p>РУС</p>}
      </div>
      <div className="setting_buttons">
        <button type="button" onClick={setRussian}>{t('ru')}</button>
        <button type="button" onClick={setEnglish}>{t('en')}</button>
      </div>
    </div>
  );
}

export default LanguageSetting;
