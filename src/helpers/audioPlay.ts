export default function AudioPlay(src: string, volume: number) {
  const audio = new Audio(src);
  audio.volume = volume;
  audio.play();
}
