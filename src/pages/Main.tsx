import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';

const TEXT = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, maxime ex impedit maiores ut, laboriosam tempora sapiente expedita placeat ipsa possimus. Atque rerum voluptate quibusdam, est esse cupiditate eum deserunt!';
function Main() {
  const splittedByWord = useRef<string[]>(TEXT.split(' '));
  const charStyles = useRef<Array<string[]>>(Array(splittedByWord.current.length).fill(null).map(() => []));
  const inputRef = useRef<HTMLInputElement>(null);
  const wordIndex = useRef<number>(0);
  const [charIndex, setCharIndex] = useState(0);
  const [caretPos, setCaretPos] = useState({ top: 5, left: 0 });

  const wordsRef = useRef<HTMLSpanElement[]>([]);
  useEffect(() => {
    const handleSpace = (e:KeyboardEvent) => {
      if (e.key === ' ') {
        const nextIndex = wordIndex.current + 1;
        const nextWordSpan = wordsRef.current[nextIndex];
        if (nextWordSpan) {
          setCaretPos({ top: nextWordSpan.offsetTop + 5, left: nextWordSpan.offsetLeft });
        } else {
          console.log('End');
        }
        wordIndex.current = nextIndex;
        // setWordIndex((prev) => {
        //   const nextIndex = prev + 1;
        //   const nextWordSpan = wordsRef.current[nextIndex];
        //   if (nextWordSpan) {
        //     setCaretPos({ top: nextWordSpan.offsetTop + 5, left: nextWordSpan.offsetLeft });
        //   } else {
        //     console.log('End');
        //   }
        //   return nextIndex;
        // });
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
      if (e.key === 'Backspace') {
        if (inputRef.current && inputRef.current.value.length === 0) {
          return;
        }
        console.log('В backspace');
        setCaretPos((prev) => ({ top: prev.top, left: prev.left - 28.82 }));
        setCharIndex((prev) => {
          charStyles.current[wordIndex.current][prev - 1] = '';
          return prev - 2;
        });
      }
    };
    document.addEventListener('keydown', handleSpace, true);
    inputRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleSpace);
    };
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > splittedByWord.current[wordIndex.current].length) {
      e.target.value = e.target.value.slice(0, e.target.value.length);
      return;
    }
    if (e.target.value.slice(-1) === ' ') {
      setCharIndex(0);
      e.target.value = '';
      return;
    }
    const currentChar = e.target.value.slice(-1);
    // if (currentChar === '') {
    //   console.log('В backspace');
    //   if (e.target.value.length === 0) return;
    //   setCaretPos((prev) => ({ top: prev.top, left: prev.left - 14.41 }));
    //   setCharIndex((prev) => {
    //     charStyles.current[wordIndex][prev] = '';
    //     return prev - 1;
    //   });
    //   return;
    // }
    console.log(charIndex);
    console.log(currentChar, splittedByWord.current[wordIndex.current][charIndex]);
    if (currentChar === splittedByWord.current[wordIndex.current][charIndex]) {
      charStyles.current[wordIndex.current][charIndex] = 'green';
    } else {
      charStyles.current[wordIndex.current][charIndex] = 'red';
    }
    setCaretPos((prev) => ({ top: prev.top, left: prev.left + 14.41 }));
    setCharIndex((prev) => prev + 1);
  };
  return (
    <div className="container" onClick={() => inputRef.current?.focus()}>
      <div className="caret" style={{ left: caretPos.left, top: caretPos.top }} />
      {splittedByWord.current.map((word, index) => (
        <span key={index} ref={(el:HTMLSpanElement) => { wordsRef.current[index] = el; }}>
          {index <= wordIndex.current ? word.split('').map((char, charIndexInWord) => (
            <span
              key={charIndexInWord}
              className={charStyles.current[index][charIndexInWord]}
            >
              {char}
            </span>
          )) : word}
          <span>&nbsp;</span>
        </span>
      ))}
      <input type="text" ref={inputRef} onChange={handleChange} />
    </div>
  );
}

export default Main;
