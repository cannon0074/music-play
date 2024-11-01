import { useState, useEffect, useRef } from "react";
import Music from "./Sound/seiza.mp3";
// import BackImg from "./img/イラスト2.png";
import "./play.css";
import "./App.css";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import LoopIcon from "@mui/icons-material/Loop";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

const App = () => {
  const audioRef = useRef(null);
  const [musicButton, setMusicButton] = useState(false);
  const [loopButton, setLoopButton] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // 初回レンダリング時にAudioオブジェクトを設定
  useEffect(() => {
    audioRef.current = new Audio(Music);
    setVolume((audioRef.current.volume = 1) * 100);
    const Current = audioRef.current;
    // オーディオのメタデータが読み込まれたときに再生時間を設定
    Current.onloadedmetadata = () => {
      setDuration(audioRef.current.duration);
    };

    // 再生位置が変化したとき再生時間を取得
    Current.ontimeupdate = () => {
      setCurrentTime(audioRef.current.currentTime);
      //音楽の再生位置（currentTime）を再生時間全体（duration）で割り、その比率をパーセンテージ（0から100の範囲）に変換して取得
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100
      );
    };

    return () => {
      audioRef.current.pause();
      audioRef.current = null; // クリーンアップ
    };
  }, []);

  // 再生/停止ボタン
  const handlePlay = () => {
    if (musicButton === false) {
      audioRef.current.play();
      setMusicButton(true);
    } else {
      audioRef.current.pause();
      setMusicButton(false);
    }
  };

  // 音量調整
  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume * 100);
  };

  // ループ設定
  const handleLoopToggle = () => {
    if (loopButton === false) {
      audioRef.current.loop = true;
      setLoopButton(true);
    } else {
      audioRef.current.loop = false;
      setLoopButton(false);
    }
  };

  // シークバーを操作したときに再生位置を更新
  const handleSeek = (event) => {
    const newProgress = event.target.value;
    const newTime = (newProgress / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <>
      <div className="main">
        {/* <audio ref={audioRef} src={Music}></audio> */}

        <div className="playbar-wrap">
          <div className="playbar-container">
            <input
              className="playbar"
              type="range"
              min={0}
              max={100}
              step="0.01"
              value={progress}
              onInput={handleSeek}
              style={{
                background: `linear-gradient(to right, #00DCFF ${progress}%, #464646 ${progress}%)`,
              }}
            />
          </div>
        </div>
        <div className="time-container">
          {formatTime(currentTime)} / {formatTime(duration)}{" "}
        </div>
        <div className="play-wrap">
          <div className="icon-wrap" onClick={handleLoopToggle}>
            {loopButton ? (
              <LoopIcon
                className="loopButton"
                style={{ fontSize: "40", color: "#00dcff" }}
              ></LoopIcon>
            ) : (
              <LoopIcon
                className="loopButton"
                style={{ fontSize: "40" }}
              ></LoopIcon>
            )}
          </div>

          <div className="icon-wrap" onClick={handlePlay}>
            {musicButton ? (
              <PauseCircleOutlineIcon
                className="playButton"
                style={{ fontSize: "50" }}
              ></PauseCircleOutlineIcon>
            ) : (
              <PlayCircleOutlineIcon
                className="playButton"
                style={{ fontSize: "50" }}
              ></PlayCircleOutlineIcon>
            )}
          </div>

          <div className="volume-container">
            <VolumeUpIcon
              style={{ fontSize: "40" }}
              className="volumeButton"
            ></VolumeUpIcon>
            <div className="volumebar-container">
              <input
                className="volumebar"
                type="range"
                min="0"
                max="1"
                step="0.01"
                onChange={handleVolumeChange}
                style={{
                  background: `linear-gradient(to right, #00DCFF ${volume}%, #464646 ${volume}%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
