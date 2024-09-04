import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import recordingAnimation from './../assets/recording_animation.gif';
import Microphone from '../components/SpeechRecognition';
import { InlineMath } from 'react-katex';
import axios from 'axios';
import Scoreboard from '../components/scoreboard';

// Custom hook to manage Agora RTC client
const useAgoraRTC = (options) => {
    const [rtcClient, setRtcClient] = useState(null);
    const [localAudioTrack, setLocalAudioTrack] = useState(null);
    const [localVideoTrack, setLocalVideoTrack] = useState(null);
    
    useEffect(() => {
        const initializeRTC = async () => {
            const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
            setRtcClient(client);
            
            client.on('user-published', async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === 'video') {
                    const remoteVideoTrack = user.videoTrack;
                    const remotePlayerContainer = document.createElement('div');
                    remotePlayerContainer.id = user.uid.toString();
                    remotePlayerContainer.style.width = '270px';
                    remotePlayerContainer.style.height = '240px';
                    remotePlayerContainer.style.margin = '10px';
                    document.getElementById('remote-videos').append(remotePlayerContainer);
                    remoteVideoTrack.play(remotePlayerContainer);
                }
                if (mediaType === 'audio') {
                    user.audioTrack.play();
                }
            });

            client.on('user-unpublished', (user) => {
                const remotePlayerContainer = document.getElementById(user.uid.toString());
                if (remotePlayerContainer) {
                    remotePlayerContainer.remove();
                }
            });

            client.on('user-joined', (user) => {
                if (user.uid !== options.uid) {
                    setRtcClient(client);
                }
            });

            client.on('user-left', (user) => {
                const remotePlayerContainer = document.getElementById(user.uid.toString());
                if (remotePlayerContainer) {
                    remotePlayerContainer.remove();
                }
            });
        };

        initializeRTC();

        return () => {
            if (rtcClient) {
                rtcClient.leave();
                localAudioTrack?.close();
                localVideoTrack?.close();
            }
        };
    }, [options, rtcClient, localAudioTrack, localVideoTrack]);

    const joinChannel = async () => {
        if (rtcClient) {
            await rtcClient.join(options.appId, options.channel, options.token, options.uid);
            const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            const videoTrack = await AgoraRTC.createCameraVideoTrack();
            await rtcClient.publish([audioTrack, videoTrack]);
            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);
        }
    };

    return { rtcClient, localAudioTrack, localVideoTrack, joinChannel };
};

// Custom hook to manage Agora RTM client
const useAgoraRTM = (options, onMessageReceived) => {
    const [rtmClient, setRtmClient] = useState(null);
    const [rtmChannel, setRtmChannel] = useState(null);

    useEffect(() => {
        const initializeRTM = async () => {
            const client = AgoraRTM.createInstance(options.appId);
            await client.login({ uid: options.uid.toString() });
            const channel = client.createChannel(options.channel);
            await channel.join();
            channel.on('ChannelMessage', onMessageReceived);
            setRtmClient(client);
            setRtmChannel(channel);
        };

        initializeRTM();

        return () => {
            if (rtmChannel) rtmChannel.leave();
            if (rtmClient) rtmClient.logout();
        };
    }, [options, onMessageReceived]);

    const sendMessage = (message) => {
        if (rtmChannel) {
            rtmChannel.sendMessage({ text: JSON.stringify(message) });
        }
    };

    return { rtmClient, rtmChannel, sendMessage };
};

const MultiplayerContest = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const contestants = parseInt(localStorage.getItem('contestants'), 10) || 1;
    const [activeContestant, setActiveContestant] = useState(0);
    const [timer, setTimer] = useState(30);
    const [scores, setScores] = useState(Array(contestants).fill(0));
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [gifKey, setGifKey] = useState(0);
    const [transcript, setTranscript] = useState("");
    const [hasJoined, setHasJoined] = useState(false);
    const [channelName, setChannelName] = useState('');
    const [mode, setMode] = useState(null);
    const [isCompetitionStarted, setIsCompetitionStarted] = useState(false);
    const [isAnswering, setIsAnswering] = useState(false);
    const [syncedTimer, setSyncedTimer] = useState(30);

    const localVideoRef = useRef(null);
    const remoteVideosRef = useRef(null);

    const options = {
        appId: 'e2e07ac75a95411a9fcc062d9f004e17',
        channel: localStorage.getItem('channelName') || '',
        token: null,
        uid: Math.floor(Math.random() * 1000000),
    };

    const { rtcClient, joinChannel } = useAgoraRTC(options);

    const handleChannelMessage = (message) => {
        const data = JSON.parse(message.text);
        if (data.type === 'timer') {
            setSyncedTimer(data.value);
        }
    };

    const { rtmClient, rtmChannel, sendMessage } = useAgoraRTM(options, handleChannelMessage);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/round1/quiz');
                const katexQuestions = response.data.questions.map(q => ({
                    ...q,
                    Question: renderKatex(q.Question),
                }));
                setQuestions(katexQuestions);
                playQuestionAudio(katexQuestions[0].Question);
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            const questionText = extractPlainText(questions[currentQuestionIndex].Question);
            playQuestionAudio(questionText);
        }
    }, [currentQuestionIndex, questions]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer === 1) {
                    handleNextContestant();
                    return 30;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeContestant, questions, currentQuestionIndex]);

    useEffect(() => {
        const gifInterval = setInterval(() => {
            setGifKey(prevKey => prevKey + 1);
        }, 3000);

        return () => clearInterval(gifInterval);
    }, []);

    useEffect(() => {
        if (isCompetitionStarted && activeContestant === 0) {
            const interval = setInterval(() => {
                setSyncedTimer(prevTimer => {
                    const newTimer = prevTimer > 0 ? prevTimer - 1 : 30;
                    sendMessage({ type: 'timer', value: newTimer });
                    if (newTimer === 30) {
                        handleNextContestant();
                    }
                    return newTimer;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isCompetitionStarted, activeContestant, sendMessage]);

    const handleNextContestant = () => {
        setActiveContestant(prev => {
            const next = (prev + 1) % contestants;
            if (next === 0) {
                handleNextQuestion();
            }
            return next;
        });
        setTimer(30);
        setTranscript("");
        setIsAnswering(true);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(prevIndex => (prevIndex + 1) % questions.length);
    };

    const handleTranscriptChange = (newTranscript) => {
        setTranscript(newTranscript);
    };

    const playQuestionAudio = (questionText) => {
        console.log('Playing question:', questionText);
    };

    const handleSubmitAnswer = () => {
        const currentQuestion = questions[currentQuestionIndex];
        const isCorrect = transcript.toLowerCase().includes(currentQuestion.Answer.toLowerCase());

        if (isCorrect) {
            setScores(prevScores => {
                const newScores = [...prevScores];
                newScores[activeContestant] += 1;
                return newScores;
            });
        }

        setIsAnswering(false);
    };

    return (
        <div>
            <h1>Multiplayer Contest</h1>
            <div id="local-video">
                <video ref={localVideoRef} autoPlay muted />
            </div>
            <div id="remote-videos" ref={remoteVideosRef}></div>
            <div>
                <h2>Active Contestant: {activeContestant + 1}</h2>
                <h2>Time Remaining: {timer} seconds</h2>
                <h2>Current Question:</h2>
                <div>
                    <InlineMath>{questions[currentQuestionIndex]?.Question || ''}</InlineMath>
                </div>
                <Microphone onTranscriptChange={handleTranscriptChange} />
                {isAnswering && (
                    <button onClick={handleSubmitAnswer}>Submit Answer</button>
                )}
                <Scoreboard scores={scores} />
                <img src={recordingAnimation} alt="Recording Animation" key={gifKey} />
            </div>
        </div>
    );
};

export default MultiplayerContest;
