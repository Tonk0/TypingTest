import { useSettingsContext } from '../Context';

interface ICaretProps {
  position: { top: number, left: number }
}
function Caret({ position } : ICaretProps) {
  const { fontSize } = useSettingsContext();
  return (
    <div className="caret" style={{ top: position.top, left: position.left, height: fontSize - 5 }} />
  );
}

export default Caret;
