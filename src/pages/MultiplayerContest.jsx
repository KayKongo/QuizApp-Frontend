import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import recording_animation from './../assets/recording_animation.gif';
import Microphone from '../components/SpeechRecognition';
import { InlineMath } from 'react-katex';
import axios from 'axios';
import { Setting2, Back} from 'iconsax-react';

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
    const remoteVideosRef = useRef(null);
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
                    remotePlayerContainer.textContent = 'Remote user ' + user.uid.toString();
                    remotePlayerContainer.style.width = '270px';
                    remotePlayerContainer.style.height = '240px';
                    remotePlayerContainer.style.margin = '10px';
                    remotePlayerContainer.style.border = '1px solid #ddd'; // Example border style
                    remotePlayerContainer.style.borderRadius = '0.5rem'; // Tailwind's rounded-lg equivalent
                    remotePlayerContainer.style.transition = 'transform 0.3s ease'; // Smooth transition for transform

                    if (remoteVideosRef.current) {
                        remoteVideosRef.current.append(remotePlayerContainer);
                    }

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

            if (remoteVideosRef.current) {
                remoteVideosRef.current.innerHTML = '';
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
          return question.map(part => 
            typeof part === 'string' ? part : ''
          ).join(' ');
        }
        return '';
    };
    
    const renderKatex = (text) => {
        const parts = text.split(/(\$.*?\$)/);
        return parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
            return <InlineMath key={index} math={part.slice(1, -1)} />;
          }
          return part;
        });
    };
    
    useEffect(() => {
        const interval = setInterval(() => {
          setTimer((prevTimer) => {
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
          setGifKey((prevKey) => prevKey + 1);
        }, 3000);
    
        return () => clearInterval(gifInterval);
    }, []);
    
    const handleNextContestant = () => {
        setActiveContestant((prev) => {
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
        setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
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
        handleNextContestant();
    };

    const handleStartCompetition = () => {
        if (contestants >= 2) {
            setIsCompetitionStarted(true);
            setIsAnswering(true);
        } else {
            alert('At least two users are required to start the competition.');
        }
    };

    useEffect(() => {
        let interval;
        if (isCompetitionStarted && activeContestant === 0) { // Only the first contestant's device controls the timer
            interval = setInterval(() => {
                setSyncedTimer((prevTimer) => {
                    const newTimer = prevTimer > 0 ? prevTimer - 1 : 30;
                    broadcastTimer(newTimer);
                    if (newTimer === 30) {
                        handleNextContestant();
                    }
                    return newTimer;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isCompetitionStarted, activeContestant]);

    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
      };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
            {isCompetitionStarted ? (
                <div className="relative text-center p-10 bg-white shadow-lg rounded-lg w-full max-w-6xl">
                    <div className="flex justify-between items-center">
                        <Back size="32" color="#555555" onClick={handleGoBack} className="cursor-pointer"/>
                        <Setting2 size="32" color="#555555" className="cursor-pointer"/>
                    </div>

                    <div className='flex flex-col items-center'>
                        <div
                            className='border rounded-lg transition-transform'
                            style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}
                        >


                            <div
                                className='border rounded-lg transition-transform h-72'
                                ref={remoteVideosRef}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflowX: 'auto',
                                    alignItems: 'flex-start',
                                }}
                            >
                            <div
                                className='border rounded-lg transition-transform'
                                ref={localVideoRef}
                                style={{ width: '270px', height: '240px', margin: '11px' }}
                            >
                                Local user
                            </div>
                            </div>
                        </div>
                        <div className="bg-[#A1DDE8] rounded-3xl p-4 w-3/4 h-1/2 mb-2 justify-center self-center mt-5">
                            <div className="text-xl font-normal mb-1">Question</div>
                            <div className="bg-white p-10 rounded-2xl">
                            {questions[currentQuestionIndex]?.Question}
                            </div>
                        </div>
                        
                        <Microphone onTranscriptChange={handleTranscriptChange} />
                    </div>
                        

                            <button className="GenerateFixtures bg-indigo-500 rounded-2xl shadow mt-5 p-1 mx-auto w-60 flex justify-center items-center" onClick={handleSubmitAnswer}>
                                <span className="SubmitAnswer text-white text-2xl font-light">Submit Answer</span>
                            </button>
                        
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