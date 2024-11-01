import { useState, useRef } from "react";
import Music from "./Sound/wonderduel.mp3";

import "./App.css";

const App = () => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 初回レンダリング時にAudioオブジェクトを設定
  useEffect(() => {
    audioRef.current = new Audio(Music);

    // オーディオのメタデータが読み込まれたときに再生時間を設定
    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current.duration);
    });

    // 再生中に再生時間が変わったらシークバーを更新
    audioRef.current.addEventListener("timeupdate", () => {
      setCurrentTime(audioRef.current.currentTime);
    });

    return () => {
      audioRef.current.pause();
      audioRef.current = null; // クリーンアップ
    };
  }, []);

  // 再生・停止ボタンのハンドラ
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // シークバーを操作したときに再生位置を更新
  const handleSeek = (event) => {
    const newTime = event.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div>
      <button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</button>

      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={handleSeek}
      />

      <p>
        Current Time: {Math.floor(currentTime)} / {Math.floor(duration)} seconds
      </p>
    </div>
  );
};
export default App;
