// src/components/SpeechRecognition.js

import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

const Microphone = ({ onTranscriptChange }) => {
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();
    
    React.useEffect(() => {
        onTranscriptChange(transcript);
    }, [transcript, onTranscriptChange]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }
    
    const handleStartListening = () => {
        SpeechRecognition.startListening({ continuous: true });
    };

    return (
        <div>
            <p>Microphone: {listening ? 'on' : 'off'}</p>
            <button onClick={handleStartListening}>Start</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>
            <p>Current Transcript: {transcript}</p>
        </div>
    );
};

export default Microphone;