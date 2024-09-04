import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import recording_animation from './../assets/recording_animation.gif';
import Microphone from '../components/SpeechRecognition';
import { InlineMath } from 'react-katex';
import axios from 'axios';
import Scoreboard from '../components/scoreboard';

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

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
    const localVideoRef = useRef(null);
    const remoteVideoRefs = useRef({});
    const [rtmClient, setRtmClient] = useState(null);
    const [rtmChannel, setRtmChannel] = useState(null);
    const [syncedTimer, setSyncedTimer] = useState(30);

    const rtc = {
        localAudioTrack: null,
        localVideoTrack: null,
        client,
    };

    useEffect(() => {
        const initializeRTM = async () => {
            const client = AgoraRTM.createInstance(options.appId);
            await client.login({ uid: options.uid.toString() });
            const channel = client.createChannel(options.channel);
            await channel.join();

            channel.on('ChannelMessage', handleChannelMessage);

            setRtmClient(client);
            setRtmChannel(channel);
        };

        initializeRTM();

        return () => {
            if (rtmChannel) rtmChannel.leave();
            if (rtmClient) rtmClient.logout();
        };
    }, []);

    const options = {
        appId: 'e2e07ac75a95411a9fcc062d9f004e17',
        channel: localStorage.getItem('channelName') || '',
        token: null,
        uid: Math.floor(Math.random() * 1000000),
    };
    const handleChannelMessage = (message, memberId) => {
        const data = JSON.parse(message.text);
        if (data.type === 'timer') {
            setSyncedTimer(data.value);
        }
    };

    const broadcastTimer = (time) => {
        if (rtmChannel) {
            rtmChannel.sendMessage({ text: JSON.stringify({ type: 'timer', value: time }) });
        }
    };

    useEffect(() => {
        const startBasicCall = async () => {
            rtc.client.on('user-published', async (user, mediaType) => {
                await rtc.client.subscribe(user, mediaType);
                console.log('subscribe success');

                if (mediaType === 'video') {
                    const remoteVideoTrack = user.videoTrack;
                    const remotePlayerContainer = document.createElement('div');
                    remotePlayerContainer.id = user.uid.toString();
                    remotePlayerContainer.style.width = '270px';
                    remotePlayerContainer.style.height = '240px';
                    remotePlayerContainer.style.margin = '10px';

                    remoteVideoRefs.current[user.uid] = remotePlayerContainer;
                    document.getElementById('remote-videos').append(remotePlayerContainer);

                    remoteVideoTrack.play(remotePlayerContainer);
                }

                if (mediaType === 'audio') {
                    const remoteAudioTrack = user.audioTrack;
                    remoteAudioTrack.play();
                }

                const { count } = await rtc.client.getUsers();
                if (count >= contestants) {
                    setIsCompetitionStarted(true);
                }
            });

            rtc.client.on('user-unpublished', (user) => {
                const remotePlayerContainer = document.getElementById(user.uid.toString());
                if (remotePlayerContainer) {
                    remotePlayerContainer.remove();
                    delete remoteVideoRefs.current[user.uid];
                }
            });

            rtc.client.on('user-joined', (user) => {
                console.log('User joined:', user.uid);
                if (user.uid !== options.uid) {
                    setIsCompetitionStarted(true);
                }
            });

            rtc.client.on('user-left', (user) => {
                console.log('User left:', user.uid);
                const remotePlayerContainer = document.getElementById(user.uid.toString());
                if (remotePlayerContainer) {
                    remotePlayerContainer.remove();
                    delete remoteVideoRefs.current[user.uid];
                }
            });
        };

        const initializeChannel = async () => {
            try {
                rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
                await startBasicCall();

                if (options.channel) {
                    setMode('join');
                    await joinChannel();
                } else {
                    setMode('create');
                }
            } catch (error) {
                console.error('Error initializing channel:', error);
            }
        };

        initializeChannel();

        return () => {
            if (rtc.client) {
                rtc.client.leave();
                if (rtc.localAudioTrack) rtc.localAudioTrack.close();
                if (rtc.localVideoTrack) rtc.localVideoTrack.close();
            }
        };
    }, []);

    const joinChannel = async () => {
        try {
            if (!rtc.client) {
                throw new Error('AgoraRTC client is not initialized');
            }
            await rtc.client.join(options.appId, options.channel, options.token, options.uid);
            rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
            await rtc.localVideoTrack.setEnabled(true);
            await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

            if (localVideoRef.current) {
                rtc.localVideoTrack.play(localVideoRef.current);
            }

            setHasJoined(true);
            console.log('publish success!');
        } catch (error) {
            console.error('Error joining or publishing:', error);
        }
    };

    const leaveChannel = async () => {
        try {
            if (rtc.localAudioTrack) rtc.localAudioTrack.close();
            if (rtc.localVideoTrack) rtc.localVideoTrack.close();

            if (localVideoRef.current) {
                localVideoRef.current.innerHTML = '';
            }

            const remoteContainer = document.getElementById('remote-videos');
            if (remoteContainer) {
                remoteContainer.innerHTML = '';
            }

            await rtc.client.leave();
            setHasJoined(false);
            navigate('/');
        } catch (error) {
            console.error('Error leaving channel:', error);
        }
    };

    const handleCreateOrJoin = (action) => {
        if (channelName.trim() === '') {
            alert('Channel name cannot be empty');
            return;
        }
        setMode(action);
        if (action === 'join') {
            joinChannel();
        }
    };

    useEffect(() => {
        let isMounted = true;
    
        const fetchQuestions = async () => {
          try {
            const response = await axios.get('http://localhost:8000/api/round1/quiz');
            const katexQuestions = response.data.questions.map(q => ({
              ...q,
              Question: renderKatex(q.Question)
            }));
            if (isMounted) {
              setQuestions(katexQuestions);
              playQuestionAudio(katexQuestions[0].Question);
            }
          } catch (error) {
            console.error('Error fetching questions:', error);
          }
        };
    
        fetchQuestions();
    
        return () => {
          isMounted = false;
        };
    }, []);
    
    useEffect(() => {
        if (questions.length > 0) {
          const questionText = extractPlainText(questions[currentQuestionIndex].Question);
          playQuestionAudio(questionText);
        }
    }, [currentQuestionIndex, questions]);
      
    const extractPlainText = (question) => {
        if (typeof question === 'string') {
          return question;
        }
        if (Array.isArray(question)) {
          return question.map(item => typeof item === 'string' ? item : '').join(' ');
        }
        return '';
    };

    const playQuestionAudio = async (questionText) => {
        try {
            const response = await axios.post('http://localhost:8000/api/convert_to_speech', {
                text: questionText,
                model: 'default',
            }, { responseType: 'arraybuffer' });
    
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error('Error converting text to speech:', error);
        }
    };
    
    const handleSubmitAnswer = async () => {
        // Implement answer submission logic here
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            {isCompetitionStarted && <Scoreboard scores={scores} />}
            {isCompetitionStarted ? (
                <div className="relative text-center p-10 bg-white shadow-lg rounded-lg w-full max-w-6xl">
                    <button
                        onClick={() => navigate('/')}
                        className="fixed top-4 left-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                    >
                        Back
                    </button>
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">Quizmistress</h1>
                        <p className="text-lg mb-4">The quizmistress will guide you through the questions.</p>
                        <h2 className="text-3xl font-semibold mb-4">
                            Contestant {activeContestant + 1}'s Turn - Time Left: {syncedTimer}s
                        </h2>
                    </div>

                    <div className='flex flex-col items-center'>
                        <div
                            className='border rounded-lg transition-transform'
                            style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', padding: '10px' }}
                        >
                            <div
                                className='border rounded-lg transition-transform'
                                ref={localVideoRef}
                                style={{ width: '270px', height: '240px', margin: '11px' }}
                            >
                                Local user {options.uid}
                            </div>

                            <div
                                className='border rounded-lg transition-transform'
                                id='remote-videos'
                                style={{ width: '270px', height: '240px', margin: '11px' }}
                            >
                                Remote user 1
                            </div>

                            <div
                                className='border rounded-lg transition-transform'
                                id='remote-videos'
                                style={{ width: '270px', height: '240px', margin: '11px' }}
                            >
                                Remote user 2
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold">Question {currentQuestionIndex + 1}</h2>
                            <p className="text-xl mt-2">{questions[currentQuestionIndex]?.Question}</p>
                        </div>
                    </div>
                    {isAnswering && (
                        <>
                            <div className="mt-5 w-full max-w-6xl flex justify-center">
                                <img key={gifKey} src={recording_animation} alt="Animation" className="h-24" />
                                <Microphone onTranscriptChange={handleTranscriptChange} />
                            </div>
                            <p className="mt-4">Your answer: {transcript}</p>
                            <button
                                onClick={handleSubmitAnswer}
                                className="mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-700"
                            >
                                Submit Answer
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="relative text-center p-10 bg-white shadow-lg rounded-lg w-full max-w-6xl">
                    <button
                        className='bg-green-500 text-white p-2 rounded mt-5'
                        type="button"
                        onClick={handleStartCompetition}
                        disabled={contestants < 2}
                    >
                        Start Competition!
                    </button>
                    <p className="text-lg mt-4">{contestants < 2 ? 'Waiting for more users to join...' : ''}</p>
                </div>
            )}
        </div>
    );
};

export default MultiplayerContest;
