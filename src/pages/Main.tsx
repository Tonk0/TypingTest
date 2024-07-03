import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import Caret from '../components/Caret';
import TextDisplay from '../components/TextDisplay';
import KeyPressSound from '../sounds/KeyPressSound.mp3';
import SpacebarSound from '../sounds/SpacebarSound.mp3';
import MistakeSound from '../sounds/MistakeSound.mp3';
import AudioPlay from '../helpers/audioPlay';

const TEXT = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, maxime ex impedit maiores ut, laboriosam tempora sapiente expedita placeat ipsa possimus. Atque rerum voluptate quibusdam, est esse cupiditate eum deserunt!';
const CARET_STEP = 14.41;
const CARET_OFFSET = 5;
const VOLUME = 0.1;

function Main() {
  const splittedByWord = TEXT.split(' ');
  const charStyles = useRef<Array<string[]>>(Array(splittedByWord.length)
    .fill(null)
    .map(() => []));
  const charRefs = useRef<Array<HTMLSpanElement[]>>(Array(splittedByWord.length)
    .fill(null)
    .map(() => []));
  const inputRef = useRef<HTMLInputElement>(null);
  const wordIndex = useRef<number>(0);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const [charIndex, setCharIndex] = useState(0);
  const [caretPos, setCaretPos] = useState({ top: CARET_OFFSET, left: 0 });
  const [isTyping, setIsTyping] = useState(true);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const handleSpace = (e: ChangeEvent<HTMLInputElement>) => {
    const nextIndex = wordIndex.current + 1;
    const nextWordSpan = wordsRef.current[nextIndex];
    if (nextWordSpan) {
      // change caret position to the next word
      setCaretPos({ top: nextWordSpan.offsetTop + CARET_OFFSET, left: nextWordSpan.offsetLeft });
    } else {
      // Display finish with stats
    }
    wordIndex.current = nextIndex;
    e.target.value = '';
    setCharIndex(0);
  };
  const handleBackspace = () => {
    setCaretPos((prev) => ({ top: prev.top, left: prev.left - CARET_STEP }));
    setCharIndex((prev) => {
      charStyles.current[wordIndex.current][prev - 1] = '';
      return prev - 1;
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(charRefs.current[wordIndex.current][charIndex+1].offsetLeft);
    const currentValue = e.target.value;
    const previousValue = splittedByWord[wordIndex.current].slice(0, charIndex);
    if (currentValue.slice(-1) === ' ') { // if space was pressed
      AudioPlay(SpacebarSound, VOLUME);
      handleSpace(e);
    } else if (currentValue.length > splittedByWord[wordIndex.current].length) { // if overflow
      e.target.value = currentValue.slice(0, currentValue.length);
    } else if (currentValue.length < previousValue.length && currentValue.length >= 0) { // if backspace was pressed
      AudioPlay(KeyPressSound, VOLUME);
      handleBackspace();
    } else {
      AudioPlay(KeyPressSound, VOLUME);
      const currentChar = currentValue.slice(-1);
      if (currentChar === splittedByWord[wordIndex.current][charIndex]) {
        charStyles.current[wordIndex.current][charIndex] = 'green';
      } else {
        AudioPlay(MistakeSound, VOLUME);
        charStyles.current[wordIndex.current][charIndex] = 'red';
      }
      console.log(charRefs.current[wordIndex.current][charIndex].offsetHeight)
      const offset = charRefs.current[wordIndex.current][charIndex].offsetLeft
        + charRefs.current[wordIndex.current][charIndex].offsetWidth;
      setCaretPos((prev) => ({ top: prev.top, left: offset }));
      setCharIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="container" onClick={() => inputRef.current?.focus()}>
      {isTyping && <Caret position={caretPos} />}
      <TextDisplay
        words={splittedByWord}
        charStyles={charStyles.current}
        currentWordIndex={wordIndex.current}
        wordsRef={wordsRef}
        charRef={charRefs}
      />
      <input type="text" ref={inputRef} onChange={handleChange} onBlur={() => setIsTyping(false)} onFocus={() => setIsTyping(true)} />
    </div>
  );
}

export default Main;
