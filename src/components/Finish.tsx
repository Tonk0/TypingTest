import { useTranslation } from 'react-i18next';

interface IFinishProps {
  cpm: number
  mistakes: number
  textLen: number
  setGameReset: React.Dispatch<React.SetStateAction<boolean>>
}
function Finish({
  cpm, mistakes, textLen, setGameReset,
} : IFinishProps) {
  const { t } = useTranslation();
  return (
    <div className="finish_container">
      <p>{`${t('cpm')} ${cpm}`}</p>
      <p>{`${t('mistakes')} ${mistakes} (${((mistakes / textLen) * 100).toFixed(2)}%)`}</p>
      <button type="button" onClick={() => setGameReset((prev) => !prev)}>{t('newText')}</button>
    </div>
  );
}

export default Finish;
