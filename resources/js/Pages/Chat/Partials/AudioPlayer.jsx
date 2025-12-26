import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download } from 'lucide-react';
import style from '@/css/audioPlayer.module.css';

export default function AudioPlayer({ audioUrl, isMe }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [waveformData, setWaveformData] = useState([]);
    const audioRef = useRef(null);
    const animationRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            generateWaveform();
        };

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [audioUrl]);

    const generateWaveform = () => {
        // Generate random waveform bars (in production, use Web Audio API)
        const bars = Array.from({ length: 30 }, () => Math.random() * 0.8 + 0.2);
        setWaveformData(bars);
    };

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const audio = audioRef.current;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        audio.currentTime = percentage * duration;
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`${style.audioPlayer} ${isMe ? style.senderPlayer : style.receiverPlayer}`}>
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            <button onClick={togglePlayPause} className={style.playButton}>
                {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
            </button>

            <div className={style.waveformContainer} onClick={handleSeek}>
                <div className={style.waveform}>
                    {waveformData.map((height, index) => {
                        const progress = duration > 0 ? currentTime / duration : 0;
                        const isActive = index / waveformData.length <= progress;
                        return (
                            <div
                                key={index}
                                className={`${style.waveBar} ${isActive ? style.activeBar : ''}`}
                                style={{ height: `${height * 100}%` }}
                            />
                        );
                    })}
                </div>
            </div>

            <span className={style.time}>
                {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <a href={audioUrl} download className={style.downloadBtn} title="Download">
                <Download size={16} />
            </a>
        </div>
    );
}
