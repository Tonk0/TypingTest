import {
  ChangeEvent, useEffect, useRef, useState,
} from 'react';
import { fakerEN, fakerRU } from '@faker-js/faker';
import { useTranslation } from 'react-i18next';
import Caret from '../components/Caret';
import TextDisplay from '../components/TextDisplay';
import KeyPressSound from '../sounds/KeyPressSound.mp3';
import SpacebarSound from '../sounds/SpacebarSound.mp3';
import MistakeSound from '../sounds/MistakeSound.mp3';
import AudioPlay from '../helpers/audioPlay';
import Settings from '../components/Settings';
import { useSettingsContext } from '../Context';
import Finish from '../components/Finish';

// const TEXT = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
// const CARET_STEP = 14.41;
const CARET_OFFSET = 5;

function Main() {
  const {
    volume, fontSize, isTypos, isEnglish,
  } = useSettingsContext();
  const TEXT = useRef<string>('');
  const start = useRef<Date | null>(null);
  const mistakes = useRef<number>(0);
  const cpm = useRef<number>(0);
  const numberOfTypedChars = useRef<number>(0);
  const splittedByWord = useRef<string[]>([]);
  const charStyles = useRef<Array<string[]>>([[]]);
  const charRefs = useRef<Array<HTMLSpanElement[]>>([[]]);
  const inputRef = useRef<HTMLInputElement>(null);
  const wordIndex = useRef<number>(0);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const { t } = useTranslation();

  const [charIndex, setCharIndex] = useState(0);
  const [caretPos, setCaretPos] = useState({ top: CARET_OFFSET, left: 0 });
  const [isTyping, setIsTyping] = useState(true);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showFinish, setShowFinish] = useState<boolean>(false);
  const [gameReset, setGameReset] = useState<boolean>(false);
  useEffect(() => {
    inputRef.current?.focus();
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    if (isEnglish) {
      TEXT.current = fakerEN.lorem.paragraph({ min: 2, max: 5 });
    } else {
      TEXT.current = fakerRU.lorem.paragraph({ min: 2, max: 5 });
    }
    start.current = null;
    mistakes.current = 0;
    cpm.current = 0;
    numberOfTypedChars.current = 0;
    splittedByWord.current = TEXT.current.split(' ');
    charStyles.current = Array(splittedByWord.current.length)
      .fill(null)
      .map(() => []);
    charRefs.current = Array(splittedByWord.current.length)
      .fill(null)
      .map(() => []);
    wordIndex.current = 0;
    wordsRef.current = [];
    setCharIndex(0);
    setCaretPos({ top: CARET_OFFSET, left: 0 });
    setShowFinish(false);
  }, [isEnglish, gameReset]);
  useEffect(() => {
    if (showSettings) {
      inputRef.current?.blur();
    }
    if (showFinish) {
      inputRef.current?.blur();
    }
  }, [showSettings, showFinish]);
  useEffect(() => {
    if (charRefs.current[0].length === 0) return;
    // no need to change caretPos if text was finished
    if (!splittedByWord.current[wordIndex.current]) return;
    // check if charIndex overflow array length
    // it means that the end of word was reached
    if (charIndex === splittedByWord.current[wordIndex.current].length) {
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
      const end = new Date();
      cpm.current = Math.round((numberOfTypedChars.current * 60000) / (end.getTime() - start.current!.getTime()));
      setShowFinish(true);
      // console.log((mistakes.current / TEXT.replace(/ /g, '').length) * 100);
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
      charRefs.current[wordIndex.current][prev - 1].textContent = splittedByWord.current[wordIndex.current][prev - 1];
      return prev - 1;
    });
  };
  const handleClick = () => {
    if (!showFinish) inputRef.current?.focus();
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    // console.log(charIndex, wordIndex.current, wordsRef.current[wordIndex.current], charRefs.current[wordIndex.current][charIndex]);
    if (!start.current) {
      start.current = new Date();
    }
    // console.log(charRefs.current[wordIndex.current][charIndex+1].offsetLeft);
    const currentValue = e.target.value;
    const previousValue = splittedByWord.current[wordIndex.current].slice(0, charIndex);
    if (currentValue.slice(-1) === ' ') { // if space was pressed
      AudioPlay(SpacebarSound, volume);
      handleSpace(e);
    } else if (currentValue.length > splittedByWord.current[wordIndex.current].length) { // if overflow
      e.target.value = currentValue.slice(0, splittedByWord.current[wordIndex.current].length);
    } else if (currentValue.length < previousValue.length
        && currentValue.length >= 0) { // if backspace was pressed
      AudioPlay(KeyPressSound, volume);
      handleBackspace();
    } else {
      numberOfTypedChars.current += 1;
      AudioPlay(KeyPressSound, volume);
      const currentChar = currentValue.slice(-1);
      if (currentChar === splittedByWord.current[wordIndex.current][charIndex]) {
        charStyles.current[wordIndex.current][charIndex] = 'green';
      } else {
        mistakes.current += 1;
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
      onClick={handleClick}
      style={{ fontSize: `${fontSize}px` }}
    >
      <div className="button_container">
        <button type="button" onClick={() => setShowSettings(true)} className="settings_button">{t('settings')}</button>
      </div>
      {showSettings && <Settings setShowSettings={setShowSettings} />}
      {isTyping && <Caret position={caretPos} />}
      <TextDisplay
        words={splittedByWord.current}
        charStyles={charStyles.current}
        currentWordIndex={wordIndex.current}
        wordsRef={wordsRef}
        charRef={charRefs}
      />
      <input type="text" ref={inputRef} onChange={handleChange} onBlur={() => setIsTyping(false)} onFocus={() => setIsTyping(true)} />
      {showFinish && (
      <Finish
        setGameReset={setGameReset}
        cpm={cpm.current}
        mistakes={mistakes.current}
        textLen={TEXT.current.replace(/ /g, '').length}
      />
      )}
    </div>
  );
}

export default Main;
