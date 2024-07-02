interface ICaretProps {
  position: { top: number, left: number }
}
function Caret({ position } : ICaretProps) {
  return (
    <div className="caret" style={{ top: position.top, left: position.left }} />
  );
}

export default Caret;
