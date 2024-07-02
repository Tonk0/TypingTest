interface ITextDisplyProps {
  words: string[]
  charStyles: string[][]
  currentWordIndex: number
  wordsRef: React.MutableRefObject<HTMLSpanElement[]>
}
function TextDisplay({
  words, charStyles, currentWordIndex, wordsRef,
} : ITextDisplyProps) {
  return (
    <>
      {words.map((word, index) => (
        <span key={index} ref={(el: HTMLSpanElement) => { wordsRef.current[index] = el; }}>
          {index <= currentWordIndex ? word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className={charStyles[index][charIndex]}
            >
              {char}
            </span>
          )) : word}
          <span>&nbsp;</span>
        </span>
      ))}
    </>
  );
}

export default TextDisplay;
