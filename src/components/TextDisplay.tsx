interface ITextDisplyProps {
  words: string[]
  charStyles: string[][]
  currentWordIndex: number
  wordsRef: React.MutableRefObject<HTMLSpanElement[]>
  charRef: React.MutableRefObject<HTMLSpanElement[][]>
}
function TextDisplay({
  words, charStyles, currentWordIndex, wordsRef, charRef
} : ITextDisplyProps) {
  return (
    <>
      {words.map((word, index) => (
        <span key={index} ref={(el: HTMLSpanElement) => { wordsRef.current[index] = el; }}>
          {index <= currentWordIndex ? word.split('').map((char, charIndex) => (
            <span
              key={charIndex}
              className={charStyles[index][charIndex]}
              ref={(el: HTMLSpanElement) => { charRef.current[index][charIndex] = el; }}
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
