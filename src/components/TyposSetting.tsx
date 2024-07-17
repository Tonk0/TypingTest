import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettingsContext } from '../Context';

function TyposSetting() {
  const { t } = useTranslation();
  const { isTypos, setIsTypos } = useSettingsContext();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsTypos(Boolean(e.target.value));
  };
  return (
    <div className="setting_wrapper">
      <div className="setting_info">
        <p>{t('showTypos')}</p>
      </div>
      <div className="setting_checkboxes">
        <label className="checkbox_label">
          <input type="radio" name="typos" checked={isTypos} value="1" onChange={handleChange} />
          <div className="typos">
            <p>
              {t('typos.word')}
              <span style={{ color: 'red' }}>{t('typos.typo')}</span>
            </p>
            <p style={{ fontSize: '12px' }}>{t('showTypos')}</p>
          </div>
        </label>
        <label className="checkbox_label">
          <input type="radio" name="typos" value="" checked={!isTypos} onChange={handleChange} />
          <div className="typos">
            <p>
              {t('typos.word')}
              <span style={{ color: 'red' }}>{t('typos.original')}</span>
            </p>
            <p style={{ fontSize: '12px' }}>{t('showOriginal')}</p>
          </div>
        </label>
      </div>
    </div>
  );
}

export default TyposSetting;
