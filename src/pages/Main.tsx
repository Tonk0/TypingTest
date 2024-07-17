import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Caret from '../components/Caret';
import TextDisplay from '../components/TextDisplay';
import KeyPressSound from '../sounds/KeyPressSound.mp3';
import SpacebarSound from '../sounds/SpacebarSound.mp3';
import MistakeSound from '../sounds/MistakeSound.mp3';
import AudioPlay from '../helpers/audioPlay';
import Settings from '../components/Settings';
import { useSettingsContext } from '../Context';

const TEXT = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptate, maxime ex impedit maiores ut, laboriosam tempora sapiente expedita placeat ipsa possimus. Atque rerum voluptate quibusdam, est esse cupiditate eum deserunt!';
// const CARET_STEP = 14.41;
const CARET_OFFSET = 5;

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

  const { volume, fontSize, isTypos } = useSettingsContext();
  const { t } = useTranslation();

  const [charIndex, setCharIndex] = useState(0);
  const [caretPos, setCaretPos] = useState({ top: CARET_OFFSET, left: 0 });
  const [isTyping, setIsTyping] = useState(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    // check if charIndex overflow array length
    // it means that the end of word was reached
    if (charIndex === splittedByWord[wordIndex.current].length) {
      // -1 here to point on actual last char
      const offset = charRefs.current[wordIndex.current][charIndex - 1].offsetLeft
      + charRefs.current[wordIndex.current][charIndex - 1].offsetWidth;
      setCaretPos({
        top: charRefs.current[wordIndex.current][charIndex - 1].offsetTop + 5,
        left: offset,
      });
    } else {
      setCaretPos({
        top: charRefs.current[wordIndex.current][charIndex].offsetTop + 5,
        left: charRefs.current[wordIndex.current][charIndex].offsetLeft,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fontSize]);
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
    const offset = charRefs.current[wordIndex.current][charIndex - 1].offsetLeft;
    setCaretPos((prev) => ({ top: prev.top, left: offset }));
    setCharIndex((prev) => {
      charStyles.current[wordIndex.current][prev - 1] = '';
      // change char back if it was replaced with 'show typos' setting
      charRefs.current[wordIndex.current][prev - 1].textContent = splittedByWord[wordIndex.current][prev - 1];
      return prev - 1;
    });
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(charRefs.current[wordIndex.current][charIndex+1].offsetLeft);
    const currentValue = e.target.value;
    const previousValue = splittedByWord[wordIndex.current].slice(0, charIndex);
    if (currentValue.slice(-1) === ' ') { // if space was pressed
      AudioPlay(SpacebarSound, volume);
      handleSpace(e);
    } else if (currentValue.length > splittedByWord[wordIndex.current].length) { // if overflow
      e.target.value = currentValue.slice(0, currentValue.length);
    } else if (currentValue.length < previousValue.length
        && currentValue.length >= 0) { // if backspace was pressed
      AudioPlay(KeyPressSound, volume);
      handleBackspace();
    } else {
      AudioPlay(KeyPressSound, volume);
      const currentChar = currentValue.slice(-1);
      if (currentChar === splittedByWord[wordIndex.current][charIndex]) {
        charStyles.current[wordIndex.current][charIndex] = 'green';
      } else {
        AudioPlay(MistakeSound, volume);
        charStyles.current[wordIndex.current][charIndex] = 'red';
        if (isTypos) {
          charRefs.current[wordIndex.current][charIndex].textContent = currentChar;
        }
      }
      const offset = charRefs.current[wordIndex.current][charIndex].offsetLeft
        + charRefs.current[wordIndex.current][charIndex].offsetWidth;
      setCaretPos((prev) => ({ top: prev.top, left: offset }));
      setCharIndex((prev) => prev + 1);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className="container"
      tabIndex={0}
      role="textbox"
      onClick={() => inputRef.current?.focus()}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="button_container">
        <button type="button" onClick={() => setShowSettings(true)} className="settings_button">{t('settings')}</button>
      </div>
      {showSettings && <Settings setShowSettings={setShowSettings} />}
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
