// // Improved UI for MediVoice Assistant
// import React, { useState, useEffect } from 'react';
// import {
//   Mic,
//   Square,
//   Play,
//   Pause,
//   FileText,
//   Volume2,
//   Clock,
//   Calendar,
//   User,
//   FileCheck
// } from 'lucide-react';

// function App() {
//   const [recording, setRecording] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [insights, setInsights] = useState('');
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [timerInterval, setTimerInterval] = useState(null);
//   const [audioLevel, setAudioLevel] = useState(0);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [patientInfo] = useState({
//     name: 'Alex Johnson',
//     id: 'PT-78923',
//     age: 42,
//     date: new Date().toLocaleDateString()
//   });
//   const [visualizer, setVisualizer] = useState([]);

//   useEffect(() => {
//     if (recording && !paused) {
//       const interval = setInterval(() => {
//         setVisualizer(Array(30).fill().map(() => Math.random() * (audioLevel * 100)));
//       }, 100);
//       return () => clearInterval(interval);
//     }
//   }, [recording, paused, audioLevel]);

//   useEffect(() => {
//     if (recording && !paused) {
//       const interval = setInterval(() => {
//         setAudioLevel(0.3 + Math.random() * 0.7);
//       }, 200);
//       return () => clearInterval(interval);
//     } else {
//       setAudioLevel(0);
//     }
//   }, [recording, paused]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       const chunks = [];

//       recorder.ondataavailable = (e) => chunks.push(e.data);
//       recorder.onstop = async () => {
//         setIsProcessing(true);
//         const blob = new Blob(chunks, { type: 'audio/webm' });
//         const formData = new FormData();
//         formData.append('audio', blob);
//         formData.append('patientId', patientInfo.id);
//         formData.append('patientName', patientInfo.name);

//         try {
//           const res = await fetch('http://localhost:5000/api/audio-insights', {
//             method: 'POST',
//             body: formData
//           });
//           const data = await res.json();
//           setInsights(data.insights);
//           setIsProcessing(false);
//         } catch (error) {
//           setTimeout(() => {
//             setInsights('Simulated insights: Patient describes intermittent chest pain, etc...');
//             setIsProcessing(false);
//           }, 2000);
//         }
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setRecording(true);
//       setPaused(false);
//       setRecordingTime(0);
//       const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
//       setTimerInterval(interval);
//     } catch (err) {
//       alert('Microphone access denied.');
//     }
//   };

//   const pauseRecording = () => {
//     if (mediaRecorder?.state === 'recording') {
//       mediaRecorder.pause();
//       setPaused(true);
//       clearInterval(timerInterval);
//     } else if (mediaRecorder?.state === 'paused') {
//       mediaRecorder.resume();
//       setPaused(false);
//       const interval = setInterval(() => setRecordingTime((t) => t + 1), 1000);
//       setTimerInterval(interval);
//     }
//   };

//   const stopRecording = () => {
//     mediaRecorder?.stop();
//     setRecording(false);
//     setPaused(false);
//     clearInterval(timerInterval);
//   };

//   const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

//   return (
//     <div className="min-h-screen w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 p-6">
//       <div className="w-full space-y-6">
//         <header className="bg-white shadow rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
//           <div className="flex gap-3 items-center">
//             <div className="bg-blue-600 p-2 rounded-full text-white">
//               <FileText size={24} />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">MediVoice Assistant</h1>
//               <p className="text-gray-500">AI-Powered Documentation</p>
//             </div>
//           </div>
//           <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
//             <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
//               <Calendar size={16} className="text-blue-600" /> {patientInfo.date}
//             </div>
//             <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2 text-sm">
//               <User size={16} className="text-blue-600" /> {patientInfo.name} ({patientInfo.id})
//             </div>
//           </div>
//         </header>

//         <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <aside className="col-span-1 space-y-6">
//             <div className="bg-white p-6 rounded-xl shadow">
//               <h2 className="text-gray-800 font-semibold mb-4">Session Info</h2>
//               <ul className="text-sm text-gray-600 space-y-2">
//                 <li className="flex justify-between"><span>Name:</span><span>{patientInfo.name}</span></li>
//                 <li className="flex justify-between"><span>ID:</span><span>{patientInfo.id}</span></li>
//                 <li className="flex justify-between"><span>Date:</span><span>{patientInfo.date}</span></li>
//                 {recording && <li className="flex justify-between"><span>Time:</span><span>{formatTime(recordingTime)}</span></li>}
//               </ul>
//             </div>

//             <div className="bg-white p-6 rounded-xl shadow">
//               <h2 className="text-gray-800 font-semibold mb-4">Audio Status</h2>
//               <div className="flex items-center gap-3 mb-2">
//                 <div className={`w-3 h-3 rounded-full ${paused ? 'bg-yellow-500' : recording ? 'bg-red-500' : 'bg-gray-400'}`}></div>
//                 <span>{paused ? 'Paused' : recording ? 'Recording...' : 'Idle'}</span>
//               </div>
//               <div className="flex gap-1 h-12 items-end">
//                 {visualizer.map((val, idx) => (
//                   <div key={idx} className="w-1 bg-blue-500 rounded" style={{ height: `${val}%` }}></div>
//                 ))}
//               </div>
//             </div>
//           </aside>

//           <section className="col-span-2 space-y-6">
//             <div className="bg-white p-8 rounded-xl shadow flex flex-col items-center">
//               <div className={`w-32 h-32 rounded-full flex items-center justify-center ${recording ? 'bg-red-100' : 'bg-blue-100'}`}>
//                 <div className={`w-24 h-24 flex items-center justify-center rounded-full shadow ${recording ? (paused ? 'bg-yellow-400' : 'bg-red-500 animate-pulse') : 'bg-blue-600'}`}>
//                   {!recording ? <Mic className="text-white" size={32} /> : paused ? <Play className="text-white" size={32} /> : <Square className="text-white" size={32} />}
//                 </div>
//               </div>
//               <div className="mt-6 w-full max-w-xs">
//                 {!recording ? (
//                   <button onClick={startRecording} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2">
//                     <Mic size={20} /> Start Recording
//                   </button>
//                 ) : (
//                   <div className="grid grid-cols-2 gap-4">
//                     <button onClick={pauseRecording} className={`w-full ${paused ? 'bg-green-600' : 'bg-yellow-500'} hover:opacity-90 text-white py-2 rounded-xl flex items-center justify-center gap-1`}>
//                       {paused ? <Play size={16} /> : <Pause size={16} />} {paused ? 'Resume' : 'Pause'}
//                     </button>
//                     <button onClick={stopRecording} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-xl flex items-center justify-center gap-1">
//                       <Square size={16} /> Stop
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {isProcessing && (
//               <div className="bg-white p-6 rounded-xl shadow text-center animate-pulse">
//                 <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-3 animate-spin"></div>
//                 <p className="text-gray-700">Processing audio and generating insights...</p>
//               </div>
//             )}

//             {insights && !isProcessing && (
//               <div className="bg-gray-50 p-6 rounded-xl shadow">
//                 <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
//                   <FileText size={20} className="text-blue-600" /> Consultation Summary
//                 </h2>
//                 <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{insights}</p>
//               </div>
//             )}
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;
// 📁 frontend/src/App.js
// import React, { useState, useRef } from 'react';

// function App() {
//   const [status, setStatus] = useState('idle');
//   const [patient, setPatient] = useState(null);
//   const [insights, setInsights] = useState([]);
//   const [recordingName, setRecordingName] = useState(false);
//   const [recorder, setRecorder] = useState(null);
//   const [multipleMatches, setMultipleMatches] = useState(null);
//   const [editingName, setEditingName] = useState(false);
//   const [editedName, setEditedName] = useState('');
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioLevel, setAudioLevel] = useState(0);
//   const audioChunksRef = useRef([]);
//   const timerRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationRef = useRef(null);

//   const startTimer = () => {
//     setRecordingTime(0);
//     timerRef.current = setInterval(() => {
//       setRecordingTime(prev => prev + 1);
//     }, 1000);
//   };

//   const stopTimer = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//   };

//   const setupAudioAnalysis = (stream) => {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const analyser = audioContext.createAnalyser();
//     const microphone = audioContext.createMediaStreamSource(stream);

//     analyser.smoothingTimeConstant = 0.8;
//     analyser.fftSize = 256;

//     microphone.connect(analyser);
//     analyserRef.current = analyser;

//     const updateAudioLevel = () => {
//       if (analyserRef.current && isRecording) {
//         const bufferLength = analyserRef.current.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);
//         analyserRef.current.getByteFrequencyData(dataArray);

//         const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
//         setAudioLevel(Math.min(average / 128, 1)); // Normalize to 0-1

//         animationRef.current = requestAnimationFrame(updateAudioLevel);
//       }
//     };

//     updateAudioLevel();
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   // FIX: Move this function out of the component body and add async/await and parameter
//   const startRecording = async (forName) => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new window.MediaRecorder(stream);
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = event => {
//         audioChunksRef.current.push(event.data);
//       };

//       mediaRecorder.onstop = async () => {
//         stopTimer();
//         setIsRecording(false);
//         if (animationRef.current) {
//           cancelAnimationFrame(animationRef.current);
//         }
//         setAudioLevel(0);

//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         const formData = new FormData();
//         formData.append('audio', audioBlob);

//         try {
//           if (forName) {
//             setStatus('Transcribing patient name...');
//             const response = await fetch('http://localhost:5000/api/search-patient', {
//               method: 'POST',
//               body: formData
//             });
//             const res = await response.json();
//             if (res.status === 'multiple_matches') {
//               setMultipleMatches(res.options);
//               setStatus(`Multiple matches found for "${res.originalName}". Please select the correct patient.`);
//             } else {
//               setPatient(res);
//               setInsights(res.pastInsights || []);
//               setStatus('Patient Dashboard');
//               setEditingName(false);
//             }
//           } else {
//             formData.append('patientId', patient.patientId);
//             setStatus('Analyzing audio and generating insights...');
//             const response = await fetch('http://localhost:5000/api/audio-insights', {
//               method: 'POST',
//               body: formData
//             });
//             const res = await response.json();
//             setInsights(prev => [res.newInsight, ...prev]);
//             setStatus('Medical insight added successfully');
//           }
//         } catch (err) {
//           console.error(err);
//           setStatus('Error: ' + (err.message || 'Unknown error occurred'));
//         }

//         setRecorder(null);
//         setRecordingName(false);
//       };

//       mediaRecorder.start();
//       setRecorder(mediaRecorder);
//       setIsRecording(true);
//       setupAudioAnalysis(stream);
//       startTimer();
//       if (forName) setRecordingName(true);
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatus('Microphone access denied or unavailable');
//     }
//   };

//   const stopRecording = () => {
//     if (recorder) {
//       recorder.stop();
//     }
//     stopTimer();
//     setIsRecording(false);
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//     }
//     setAudioLevel(0);
//   };

//   const submitEditedName = async () => {
//     if (!editedName.trim()) return;
//     try {
//       setStatus('Searching for patient...');
//       const response = await fetch('http://localhost:5000/api/search-patient-name', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: editedName.trim() })
//       });
//       const res = await response.json();

//       if (res.status === 'multiple_matches') {
//         setMultipleMatches(res.options);
//         setStatus(`Multiple matches found for "${res.originalName}". Please select the correct patient.`);
//       } else {
//         setPatient(res);
//         setInsights(res.pastInsights || []);
//         setStatus('Patient Dashboard');
//         setEditingName(false);
//       }
//     } catch (error) {
//       console.error(error);
//       setStatus('Error searching for patient');
//     }
//   };

//   const getStatusStyle = () => {
//     if (status.includes('Error')) return 'border-red-200 bg-red-50 text-red-700';
//     if (status.includes('successfully')) return 'border-green-200 bg-green-50 text-green-700';
//     if (status.includes('Transcribing') || status.includes('Analyzing') || status.includes('Searching')) return 'border-blue-200 bg-blue-50 text-blue-700';
//     if (status.includes('Multiple matches')) return 'border-amber-200 bg-amber-50 text-amber-700';
//     return 'border-gray-200 bg-gray-50 text-gray-700';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Professional Header */}
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-4">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Medical Transcription System</h1>
//                 <p className="text-sm text-gray-500">AI-Powered Clinical Documentation</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-sm text-gray-500">
//                 {new Date().toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Status Bar */}
//         {status && status !== 'idle' && (
//           <div className={`mb-6 p-4 rounded-lg border ${getStatusStyle()}`}>
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium">{status}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* Patient Selection Panel */}
//           <div className="lg:col-span-4">
//             <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">Patient Selection</h2>
//                 <p className="text-sm text-gray-500 mt-1">Begin by identifying the patient</p>
//               </div>

//               <div className="p-6">
//                 {!patient && !multipleMatches && !editingName && (
//                   <button
//                     onClick={() => startRecording(true)}
//                     className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//                   >
//                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
//                     </svg>
//                     <span>Record Patient Name</span>
//                   </button>
//                 )}

//                 {recordingName && (
//                   <div className="space-y-4">
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0">
//                           <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
//                         </div>
//                         <div className="ml-3">
//                           <p className="text-sm font-medium text-red-800">Recording in progress</p>
//                           <p className="text-sm text-red-600">Speak the patient's name clearly</p>
//                         </div>
//                       </div>
//                     </div>
//                     <button
//                       onClick={stopRecording}
//                       className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
//                     >
//                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
//                       </svg>
//                       <span>Stop Recording</span>
//                     </button>
//                   </div>
//                 )}

//                 {multipleMatches && (
//                   <div className="space-y-4">
//                     <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
//                       <h3 className="text-sm font-medium text-amber-800 mb-2">Multiple Matches Found</h3>
//                       <p className="text-sm text-amber-700">Please select the correct patient from the list below:</p>
//                     </div>
                    
//                     <div className="space-y-2">
//                       {multipleMatches.map((match, idx) => (
//                         <button
//                           key={idx}
//                           onClick={() => {
//                             setPatient(match);
//                             setInsights([]);
//                             setMultipleMatches(null);
//                             setStatus('Patient selected successfully');
//                             setEditingName(false);
//                           }}
//                           className="w-full text-left bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 transition-colors duration-200"
//                         >
//                           <div className="font-medium text-gray-900">{match.patientName}</div>
//                           <div className="text-sm text-gray-500">Patient ID: {match.patientId}</div>
//                         </button>
//                       ))}
                      
//                       <button
//                         onClick={() => {
//                           const newId = `manual_${Date.now()}`;
//                           const newPatient = {
//                             patientId: newId,
//                             patientName: 'Manual Entry',
//                             pastInsights: []
//                           };
//                           setPatient(newPatient);
//                           setMultipleMatches(null);
//                           setStatus('Proceeding with manual entry');
//                           setEditingName(false);
//                         }}
//                         className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg p-4 font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
//                       >
//                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//                         </svg>
//                         <span>Create New Patient Record</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Main Content Panel */}
//           {patient && (
//             <div className="lg:col-span-8 space-y-6">
//               {/* Patient Information */}
//               <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
//                       <p className="text-sm text-gray-500 mt-1">Current patient details</p>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                       <span className="text-sm text-green-700 font-medium">Active</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   {!editingName ? (
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <h3 className="text-xl font-bold text-gray-900">{patient.patientName}</h3>
//                         <p className="text-sm text-gray-500 mt-1">Patient ID: {patient.patientId}</p>
//                       </div>
//                       <button
//                         onClick={() => {
//                           setEditedName(patient.patientName);
//                           setEditingName(true);
//                         }}
//                         className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                           <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//                         </svg>
//                         Edit Name
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="flex items-center space-x-3">
//                       <input
//                         type="text"
//                         value={editedName}
//                         onChange={e => setEditedName(e.target.value)}
//                         className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="Enter patient name"
//                         autoFocus
//                       />
//                       <button
//                         onClick={submitEditedName}
//                         className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         Save
//                       </button>
//                       <button
//                         onClick={() => setEditingName(false)}
//                         className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Recording Controls */}
//               <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-900">Voice Recording</h3>
//                   <p className="text-sm text-gray-500 mt-1">Record medical notes and observations</p>
//                 </div>

//                 <div className="p-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <button
//                       onClick={() => startRecording(false)}
//                       disabled={recorder && !recordingName}
//                       className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     >
//                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                       </svg>
//                       Start Recording
//                     </button>
                    
//                     <button
//                       onClick={stopRecording}
//                       disabled={!recorder || recordingName}
//                       className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
//                       </svg>
//                       Stop Recording
//                     </button>
//                   </div>
//                 </div>
//               </div>

//               {/* Medical Insights */}
//               <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900">Medical Insights</h3>
//                       <p className="text-sm text-gray-500 mt-1">Recorded observations and notes</p>
//                     </div>
//                     <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                       {insights.length} {insights.length === 1 ? 'insight' : 'insights'}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   {insights.length === 0 ? (
//                     <div className="text-center py-12">
//                       <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                       <h3 className="mt-2 text-sm font-medium text-gray-900">No insights recorded</h3>
//                       <p className="mt-1 text-sm text-gray-500">Get started by recording your first medical observation.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4 max-h-96 overflow-y-auto">
//                       {insights.map((entry, idx) => (
//                         <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                           <div className="flex items-start justify-between mb-2">
//                             <div className="flex items-center space-x-2">
//                               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                               <time className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                                 {entry.date}
//                               </time>
//                             </div>
//                             <span className="text-xs text-gray-400">
//                               Entry #{insights.length - idx}
//                             </span>
//                           </div>
//                           <div className="prose prose-sm max-w-none">
//                             <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                               {entry.insight}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// // export default App;
// import React, { useState, useRef } from 'react';

// function App() {
//   const [status, setStatus] = useState('idle');
//   const [patient, setPatient] = useState(null);
//   const [insights, setInsights] = useState([]);
//   const [recorder, setRecorder] = useState(null);
//   const [multipleMatches, setMultipleMatches] = useState(null);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [isRecording, setIsRecording] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [audioLevel, setAudioLevel] = useState(0);
//   const [showAddPatientForm, setShowAddPatientForm] = useState(false);
//   const [newPatient, setNewPatient] = useState({
//     name: '',
//     age: '',
//     gender: '',
//     phone: ''
//   });
//   const [searchQuery, setSearchQuery] = useState('');
//   const [audioUrl, setAudioUrl] = useState(null);

//   // --- Updated transcript state: array of lines ---
//   const [liveTranscript, setLiveTranscript] = useState([]);
//   const [showTranscript, setShowTranscript] = useState(false);

//   const audioChunksRef = useRef([]);
//   const timerRef = useRef(null);
//   const analyserRef = useRef(null);
//   const animationRef = useRef(null);
//   const recognitionRef = useRef(null);

//   const handleBackToSearch = () => {
//     setPatient(null);
//     setInsights([]);
//     setSearchQuery('');
//     setStatus('idle');
//     setAudioUrl(null);
//     setLiveTranscript([]);
//     setShowTranscript(false);
//   };

//   const startTimer = () => {
//     setRecordingTime(0);
//     timerRef.current = setInterval(() => {
//       setRecordingTime(prev => prev + 1);
//     }, 1000);
//   };

//   const stopTimer = () => {
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }
//   };

//   const setupAudioAnalysis = (stream) => {
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const analyser = audioContext.createAnalyser();
//     const microphone = audioContext.createMediaStreamSource(stream);

//     analyser.smoothingTimeConstant = 0.8;
//     analyser.fftSize = 256;

//     microphone.connect(analyser);
//     analyserRef.current = analyser;

//     const updateAudioLevel = () => {
//       if (analyserRef.current && isRecording && !isPaused) {
//         const bufferLength = analyserRef.current.frequencyBinCount;
//         const dataArray = new Uint8Array(bufferLength);
//         analyserRef.current.getByteFrequencyData(dataArray);

//         const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
//         setAudioLevel(Math.min(average / 128, 1));

//         animationRef.current = requestAnimationFrame(updateAudioLevel);
//       }
//     };

//     updateAudioLevel();
//   };

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const searchPatient = async () => {
//     if (!searchQuery.trim()) return;
//     try {
//       setStatus('Searching for patient...');
//       const response = await fetch('http://localhost:5000/api/search-patient-name', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ name: searchQuery.trim() })
//       });
//       const res = await response.json();

//       if (res.status === 'multiple_matches') {
//         setMultipleMatches(res.options);
//         setStatus(`Multiple matches found for "${res.originalName}". Please select the correct patient.`);
//       } else if (res.status === 'found') {
//         setPatient(res);
//         setInsights(res.pastInsights || []);
//         setStatus('Patient Dashboard');
//       } else {
//         setStatus('Patient not found. Would you like to create a new record?');
//         setShowAddPatientForm(true);
//         setNewPatient(prev => ({ ...prev, name: searchQuery.trim() }));
//       }
//     } catch (error) {
//       console.error(error);
//       setStatus('Error searching for patient');
//     }
//   };

//   const addNewPatient = async (e) => {
//     if (e) e.preventDefault();
//     if (!newPatient.name.trim()) {
//       setStatus('Name is required');
//       return;
//     }
//     try {
//       setStatus('Creating new patient...');
//       const response = await fetch('http://localhost:5000/api/add-patient', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: newPatient.name.trim(),
//           age: newPatient.age,
//           gender: newPatient.gender,
//           phone: newPatient.phone
//         })
//       });
//       const res = await response.json();
//       if (res.success) {
//         setPatient({
//           patientId: res.patientId,
//           patientName: res.patientName,
//           age: res.age,
//           gender: res.gender,
//           phone: res.phone,
//           pastInsights: []
//         });
//         setInsights([]);
//         setShowAddPatientForm(false);
//         setStatus('New patient created successfully');
//       } else {
//         setStatus(res.error || 'Failed to create patient');
//       }
//     } catch (error) {
//       console.error(error);
//       setStatus('Error creating new patient');
//     }
//   };

//   // --- Updated startRecording for line-by-line transcript ---
//   const startRecording = async () => {
//     try {
//       setAudioUrl(null);
//       setLiveTranscript([]); // clear transcript only on start
//       setShowTranscript(true);

//       // SpeechRecognition for line-by-line
//       if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognition.lang = 'en-US';

//         let lines = [];
//         recognition.onresult = (event) => {
//           // Only add finalized results as lines
//           for (let i = 0; i < event.results.length; ++i) {
//             const result = event.results[i];
//             if (result.isFinal) {
//               // Only add if not already present
//               if (!lines.includes(result[0].transcript.trim())) {
//                 lines.push(result[0].transcript.trim());
//               }
//             }
//           }
//           // Show the current interim result as the last line (if any)
//           let displayLines = [...lines];
//           const lastResult = event.results[event.results.length - 1];
//           if (lastResult && !lastResult.isFinal) {
//             displayLines = [...lines, lastResult[0].transcript.trim()];
//           }
//           setLiveTranscript(displayLines.filter(Boolean));
//         };
//         recognition.onerror = () => {};
//         recognitionRef.current = recognition;
//         recognition.start();
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new window.MediaRecorder(stream);
//       audioChunksRef.current = [];

//       mediaRecorder.ondataavailable = event => {
//         audioChunksRef.current.push(event.data);
//       };

//       mediaRecorder.onstop = async () => {
//         stopTimer();
//         setIsRecording(false);
//         setIsPaused(false);
//         if (animationRef.current) {
//           cancelAnimationFrame(animationRef.current);
//         }
//         setAudioLevel(0);

//         if (recognitionRef.current) {
//           recognitionRef.current.stop();
//         }

//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
//         const url = URL.createObjectURL(audioBlob);
//         setAudioUrl(url);

//         const formData = new FormData();
//         formData.append('audio', audioBlob);
//         formData.append('patientId', patient.patientId);

//         try {
//           setStatus('Analyzing audio and generating insights...');
//           const response = await fetch('http://localhost:5000/api/audio-insights', {
//             method: 'POST',
//             body: formData
//           });
//           const res = await response.json();
//           setInsights(prev => [res.newInsight, ...prev]);
//           setStatus('Medical insight added successfully');
//         } catch (err) {
//           console.error(err);
//           setStatus('Error: ' + (err.message || 'Unknown error occurred'));
//         }

//         setRecorder(null);
//         // Do NOT clear transcript here!
//       };

//       setRecorder(mediaRecorder);
//       setIsRecording(true);
//       setIsPaused(false);
//       setupAudioAnalysis(stream);
//       startTimer();
//       mediaRecorder.start();
//     } catch (err) {
//       console.error('Mic error:', err);
//       setStatus('Microphone access denied or unavailable');
//     }
//   };

//   const pauseRecording = () => {
//     if (recorder && recorder.state === 'recording') {
//       recorder.pause();
//       setIsPaused(true);
//       stopTimer();
//       if (recognitionRef.current && recognitionRef.current.stop) {
//         recognitionRef.current.stop();
//       }
//     }
//   };

//   const resumeRecording = () => {
//     if (recorder && recorder.state === 'paused') {
//       recorder.resume();
//       setIsPaused(false);
//       startTimer();
//       if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//         const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//         const recognition = new SpeechRecognition();
//         recognition.continuous = true;
//         recognition.interimResults = true;
//         recognition.lang = 'en-US';

//         let lines = [...liveTranscript.filter(Boolean)];
//         recognition.onresult = (event) => {
//           for (let i = 0; i < event.results.length; ++i) {
//             const result = event.results[i];
//             if (result.isFinal) {
//               if (!lines.includes(result[0].transcript.trim())) {
//                 lines.push(result[0].transcript.trim());
//               }
//             }
//           }
//           let displayLines = [...lines];
//           const lastResult = event.results[event.results.length - 1];
//           if (lastResult && !lastResult.isFinal) {
//             displayLines = [...lines, lastResult[0].transcript.trim()];
//           }
//           setLiveTranscript(displayLines.filter(Boolean));
//         };
//         recognition.onerror = () => {};
//         recognitionRef.current = recognition;
//         recognition.start();
//       }
//     }
//   };

//   const stopRecording = () => {
//     if (recorder) {
//       recorder.stop();
//     }
//     stopTimer();
//     setIsRecording(false);
//     setIsPaused(false);
//     if (animationRef.current) {
//       cancelAnimationFrame(animationRef.current);
//     }
//     setAudioLevel(0);
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//     // Do NOT clear transcript here!
//   };

//   const getStatusStyle = () => {
//     if (status.includes('Error')) return 'border-red-200 bg-red-50 text-red-700';
//     if (status.includes('successfully')) return 'border-green-200 bg-green-50 text-green-700';
//     if (status.includes('Analyzing') || status.includes('Searching') || status.includes('Creating')) return 'border-blue-200 bg-blue-50 text-blue-700';
//     if (status.includes('Multiple matches')) return 'border-amber-200 bg-amber-50 text-amber-700';
//     return 'border-gray-200 bg-gray-50 text-gray-700';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white border-b border-gray-200 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-4">
//               <div className="flex-shrink-0">
//                 <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                   <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">Medical Transcription System</h1>
//                 <p className="text-sm text-gray-500">AI-Powered Clinical Documentation</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-sm text-gray-500">
//                 {new Date().toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {status && status !== 'idle' && (
//           <div className={`mb-6 p-4 rounded-lg border ${getStatusStyle()}`}>
//             <div className="flex items-center">
//               <div className="flex-shrink-0">
//                 <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm font-medium">{status}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           <div className="lg:col-span-4">
//             <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//               <div className="px-6 py-4 border-b border-gray-200">
//                 <h2 className="text-lg font-semibold text-gray-900">Patient Selection</h2>
//                 <p className="text-sm text-gray-500 mt-1">Search for or add a new patient</p>
//               </div>
//               <div className="p-6 space-y-4">
//                 {!patient && !multipleMatches && !showAddPatientForm && (
//                   <>
//                     <div className="flex space-x-2">
//                       <input
//                         type="text"
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         placeholder="Enter patient name"
//                         className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         onKeyPress={(e) => e.key === 'Enter' && searchPatient()}
//                       />
//                       <button
//                         onClick={searchPatient}
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
//                       >
//                         Search
//                       </button>
//                     </div>
//                     <button
//                       onClick={() => setShowAddPatientForm(true)}
//                       className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
//                     >
//                       <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
//                       </svg>
//                       <span>Add New Patient</span>
//                     </button>
//                   </>
//                 )}
//                 {showAddPatientForm && (
//                   <form className="space-y-4" onSubmit={addNewPatient}>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Name</label>
//                       <input
//                         type="text"
//                         value={newPatient.name}
//                         onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
//                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Age</label>
//                       <input
//                         type="number"
//                         value={newPatient.age}
//                         onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
//                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Gender</label>
//                       <select
//                         value={newPatient.gender}
//                         onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
//                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       >
//                         <option value="">Select</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Phone</label>
//                       <input
//                         type="text"
//                         value={newPatient.phone}
//                         onChange={e => setNewPatient({ ...newPatient, phone: e.target.value })}
//                         className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         type="submit"
//                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
//                       >
//                         Add Patient
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => setShowAddPatientForm(false)}
//                         className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
//                       >
//                         Cancel
//                       </button>
//                     </div>
//                   </form>
//                 )}
//                 {multipleMatches && (
//                   <div className="space-y-4">
//                     {/* ...existing code for multiple matches... */}
//                   </div>
//                 )}
//                 {/* --- Updated transcript UI: line by line, never disappears until new recording --- */}
//                 {showTranscript && (
//                   <div className="mt-6">
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                       <h4 className="text-blue-700 font-semibold mb-2">Live Transcript</h4>
//                       <div className="text-gray-800 whitespace-pre-wrap min-h-[48px]">
//                         {liveTranscript.length === 0 ? (
//                           <span className="text-gray-400">Listening...</span>
//                         ) : (
//                           liveTranscript.map((line, idx) => (
//                             <div key={idx}>{line}</div>
//                           ))
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {patient && (
//             <div className="lg:col-span-8 space-y-6">
//               <div className="flex justify-start mb-4">
//                 <button
//                   onClick={handleBackToSearch}
//                   className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                 >
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                   </svg>
//                   Back to Search
//                 </button>
//               </div>
//               <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h2 className="text-lg font-semibold text-gray-900">Patient Information</h2>
//                       <p className="text-sm text-gray-500 mt-1">Current patient details</p>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2">
//                         <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                         <span className="text-sm text-green-700 font-medium">Active</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   <div>
//                     <h3 className="text-xl font-bold text-gray-900">{patient.patientName}</h3>
//                     <div className="grid grid-cols-2 gap-4 mt-4">
//                       <div>
//                         <p className="text-sm text-gray-500">Patient ID</p>
//                         <p className="font-medium">{patient.patientId}</p>
//                       </div>
//                       {patient.age && (
//                         <div>
//                           <p className="text-sm text-gray-500">Age</p>
//                           <p className="font-medium">{patient.age}</p>
//                         </div>
//                       )}
//                       {patient.gender && (
//                         <div>
//                           <p className="text-sm text-gray-500">Gender</p>
//                           <p className="font-medium">{patient.gender}</p>
//                         </div>
//                       )}
//                       {patient.phone && (
//                         <div>
//                           <p className="text-sm text-gray-500">Phone</p>
//                           <p className="font-medium">{patient.phone}</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-900">Voice Recording</h3>
//                   <p className="text-sm text-gray-500 mt-1">Record medical notes and observations</p>
//                 </div>
//                 <div className="p-6">
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <button
//                       onClick={startRecording}
//                       disabled={isRecording}
//                       className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
//                     >
//                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                       </svg>
//                       Start Recording
//                     </button>
//                     <button
//                       onClick={isPaused ? resumeRecording : pauseRecording}
//                       disabled={!isRecording}
//                       className={`inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isPaused ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
//                     >
//                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         {isPaused ? (
//                           <path fillRule="evenodd" d="M6 4l12 6-12 6V4z" clipRule="evenodd" />
//                         ) : (
//                           <path fillRule="evenodd" d="M6 4h4v12H6V4zm4 0h4v12h-4V4z" clipRule="evenodd" />
//                         )}
//                       </svg>
//                       {isPaused ? 'Resume' : 'Pause'}
//                     </button>
//                     <button
//                       onClick={stopRecording}
//                       disabled={!isRecording}
//                       className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
//                       </svg>
//                       Stop Recording
//                     </button>
//                   </div>
//                   {audioUrl && (
//                     <div className="mt-4 flex items-center space-x-3">
//                       <audio controls src={audioUrl} className="w-64" />
//                       <a
//                         href={audioUrl}
//                         download={`recording-${Date.now()}.webm`}
//                         className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
//                       >
//                         <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
//                         </svg>
//                         Download Recording
//                       </a>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-white shadow-sm rounded-lg border border-gray-200">
//                 <div className="px-6 py-4 border-b border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="text-lg font-semibold text-gray-900">Medical Insights</h3>
//                       <p className="text-sm text-gray-500 mt-1">Recorded observations and notes</p>
//                     </div>
//                     <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                       {insights.length} {insights.length === 1 ? 'insight' : 'insights'}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="p-6">
//                   {insights.length === 0 ? (
//                     <div className="text-center py-12">
//                       <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                       </svg>
//                       <h3 className="mt-2 text-sm font-medium text-gray-900">No insights recorded</h3>
//                       <p className="mt-1 text-sm text-gray-500">Get started by recording your first medical observation.</p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4 max-h-96 overflow-y-auto">
//                       {insights.map((entry, idx) => (
//                         <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
//                           <div className="flex items-start justify-between mb-2">
//                             <div className="flex items-center space-x-2">
//                               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                               <time className="text-xs font-medium text-gray-500 uppercase tracking-wide">
//                                 {entry.date}
//                               </time>
//                             </div>
//                             <span className="text-xs text-gray-400">
//                               Entry #{insights.length - idx}
//                             </span>
//                           </div>
//                           <div className="prose prose-sm max-w-none">
//                             <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
//                               {entry.insight}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default App;



import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState("idle");
  const [patient, setPatient] = useState(null);
  const [insights, setInsights] = useState([]);
  const [recorder, setRecorder] = useState(null);
  const [multipleMatches, setMultipleMatches] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [showTranscript, setShowTranscript] = useState(false);
  const [summary, setSummary] = useState(""); 

  // Voice search state
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const [voiceSearchTranscript, setVoiceSearchTranscript] = useState('');
  const voiceRecognitionRef = useRef(null);

  // Accordion state for insights
  const [openInsightIdx, setOpenInsightIdx] = useState(null);

  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const recognitionRef = useRef(null);

  // Add to your imports and state:
const [documentList, setDocumentList] = useState([]);
const [docFile, setDocFile] = useState(null);
const [docFilename, setDocFilename] = useState("");
const [docUploadStatus, setDocUploadStatus] = useState("");

// Fetch documents for a patient when loaded/changed:
useEffect(() => {
  if (patient && patient.patientId) {
    fetchDocuments(patient.patientId);
  } else {
    setDocumentList([]);
  }
}, [patient]);

// Fetch documents function
const fetchDocuments = async (patientId) => {
  if (!patientId) return;
  try {
    const res = await fetch(`http://localhost:5000/api/patient-documents/${patientId}`);
    const data = await res.json();

  
    if (Array.isArray(data.documents)) {
      setDocumentList(data.documents)
      console.log("documentList", documentList);
      ;
    }
      
    else setDocumentList([]);
  } catch (e) {
    setDocumentList([]);
  }
};

// Upload document handlers
const handleDocFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setDocFile(e.target.files[0]);
    setDocFilename(e.target.files[0].name);
  }
};

const handleDocUpload = async (e) => {
  e.preventDefault();
  setDocUploadStatus("");
  if (!docFile) {
    setDocUploadStatus("Please select a file.");
    return;
  }
  if (!patient || !patient.patientId) {
    setDocUploadStatus("No active patient.");
    return;
  }
  try {
    const formData = new FormData();
    formData.append("file", docFile);
    formData.append("filename", docFilename || docFile.name);
    formData.append("patientId", patient.patientId);
    setDocUploadStatus("Uploading...");
    const res = await fetch("http://localhost:5000/api/upload-document", {
      method: "POST",
      body: formData
    });
    const resData = await res.json();
    if (resData.success) {
      setDocUploadStatus("Upload successful!");
      setDocFile(null);
      setDocFilename("");
      fetchDocuments(patient.patientId);
    } else {
      setDocUploadStatus(resData.error || "Upload failed.");
    }
  } catch (e) {
    setDocUploadStatus("Upload failed.");
  }
};

  const handleBackToSearch = () => {
    setPatient(null);
    setInsights([]);
    setSearchQuery("");
    setStatus("idle");
    setAudioUrl(null);
    setLiveTranscript([]);
    setShowTranscript(false);
    setOpenInsightIdx(null);
  };


  useEffect(() => {
  fetchSummary(insights);
  // eslint-disable-next-line
}, [insights]);

  const startTimer = () => {
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const getPatientSummary= () =>{
  if (!insights || insights.length === 0) return "No medical insights available yet.";
  // Take the latest 2-3 insights and join them for a brief summary
  const summaryCount = Math.min(3, insights.length);
  const summaryText = insights
    .slice(0, summaryCount)
    .map((i, idx) => `${idx + 1}. ${i.insight}`)
    .join(" ");
  return summaryText;
}



const fetchSummary = async (insightsArr) => {
  if (!insightsArr || insightsArr.length === 0) {
    setSummary("No medical insights available yet.");
    return;
  }
  // Select first 2 and last 2 insights (by .insight field)
  let selected = [];
  if (insightsArr.length >= 4) {
    selected = [
      insightsArr[0].insight,
      insightsArr[1].insight,
      insightsArr[insightsArr.length - 2].insight,
      insightsArr[insightsArr.length - 1].insight,
    ];
  } else {
    selected = insightsArr.map(i => i.insight);
  }

  try {
    const res = await fetch("http://localhost:5000/api/summarize-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ insights: selected }),
    });
    const data = await res.json();
    setSummary(data.summary || "Summary unavailable.");
  } catch (err) {
    setSummary("Summary unavailable.");
  }
};

  const setupAudioAnalysis = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);

    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 256;

    microphone.connect(analyser);
    analyserRef.current = analyser;

    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording && !isPaused) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
        setAudioLevel(Math.min(average / 128, 1));

        animationRef.current = requestAnimationFrame(updateAudioLevel);
      }
    };

    updateAudioLevel();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- SEARCH PATIENT: DO NOT auto-create, just show add form if not found ---
  const searchPatient = async () => {
    if (!searchQuery.trim()) return;
    try {
      setStatus("Searching for patient...");
      const response = await fetch("http://localhost:5000/api/search-patient-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: searchQuery.trim() }),
      });
      const res = await response.json();

      if (res.status === "multiple_matches") {
        setMultipleMatches(res.options);
        setStatus(`Multiple matches found for "${res.originalName}". Please select the correct patient.`);
      } else if (res.status === "found") {
        setPatient(res);
        setInsights(res.pastInsights || []);
        setStatus("Patient Dashboard");
      } else {
        setStatus("No patient found.");
        setShowAddPatientForm(false);
        setMultipleMatches(null);
        setPatient(null);
        setInsights([]);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error searching for patient");
    }
  };

  // Voice search for patient name
  const handleVoiceSearch = async () => {
    setVoiceSearchTranscript('');
    setIsVoiceSearching(true);

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      let transcript = '';
      recognition.onresult = (event) => {
        for (let i = 0; i < event.results.length; ++i) {
          transcript = event.results[i][0].transcript.trim();
        }
        setVoiceSearchTranscript(transcript);
      };
      recognition.onerror = () => {
        setIsVoiceSearching(false);
        setStatus("Voice recognition error. Try again.");
      };
      recognition.onend = async () => {
        setIsVoiceSearching(false);
        if (transcript) {
          setSearchQuery(transcript);
          await searchPatientByName(transcript);
        }
      };
      voiceRecognitionRef.current = recognition;
      recognition.start();
    } else {
      setIsVoiceSearching(false);
      setStatus("Speech recognition not supported in this browser.");
    }
  };

  // Helper for voice search (same as searchPatient but takes name param)
  // FIX: Do NOT auto-create patient if not found, just show "No patient found."
  const searchPatientByName = async (name) => {
    if (!name.trim()) return;
    try {
      setStatus("Searching for patient...");
      const response = await fetch("http://localhost:5000/api/search-patient-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      const res = await response.json();

      if (res.status === "multiple_matches") {
        setMultipleMatches(res.options);
        setStatus(`Multiple matches found for "${res.originalName}". Please select the correct patient.`);
      } else if (res.status === "found") {
        setPatient(res);
        setInsights(res.pastInsights || []);
        setStatus("Patient Dashboard");
      } else {
        setStatus("No patient found.");
        setShowAddPatientForm(false);
        setMultipleMatches(null);
        setPatient(null);
        setInsights([]);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error searching for patient");
    }
  };

  const addNewPatient = async (e) => {
    if (e) e.preventDefault();
    if (!newPatient.name.trim()) {
      setStatus("Name is required");
      return;
    }
    try {
      setStatus("Creating new patient...");
      const response = await fetch("http://localhost:5000/api/add-patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newPatient.name.trim(),
          age: newPatient.age,
          gender: newPatient.gender,
          phone: newPatient.phone,
        }),
      });
      const res = await response.json();
      if (res.success) {
        setPatient({
          patientId: res.patientId,
          patientName: res.patientName,
          age: res.age,
          gender: res.gender,
          phone: res.phone,
          pastInsights: [],
        });
        setInsights([]);
        setShowAddPatientForm(false);
        setStatus("New patient created successfully");
      } else {
        setStatus(res.error || "Failed to create patient");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error creating new patient");
    }
  };

  const startRecording = async () => {
    try {
      setAudioUrl(null);
      setLiveTranscript([]);
      setShowTranscript(true);

      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        const lines = [];
        recognition.onresult = (event) => {
          for (let i = 0; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result.isFinal) {
              if (!lines.includes(result[0].transcript.trim())) {
                lines.push(result[0].transcript.trim());
              }
            }
          }
          let displayLines = [...lines];
          const lastResult = event.results[event.results.length - 1];
          if (lastResult && !lastResult.isFinal) {
            displayLines = [...lines, lastResult[0].transcript.trim()];
          }
          setLiveTranscript(displayLines.filter(Boolean));
        };
        recognition.onerror = () => {};
        recognitionRef.current = recognition;
        recognition.start();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stopTimer();
        setIsRecording(false);
        setIsPaused(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setAudioLevel(0);

        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("patientId", patient.patientId);

        try {
          setStatus("Analyzing audio and generating insights...");
          const response = await fetch("http://localhost:5000/api/audio-insights", {
            method: "POST",
            body: formData,
          });
          const res = await response.json();
          setInsights((prev) => [res.newInsight, ...prev]);
          setStatus("Medical insight added successfully");
        } catch (err) {
          console.error(err);
          setStatus("Error: " + (err.message || "Unknown error occurred"));
        }

        setRecorder(null);
      };

      setRecorder(mediaRecorder);
      setIsRecording(true);
      setIsPaused(false);
      setupAudioAnalysis(stream);
      startTimer();
      mediaRecorder.start();
    } catch (err) {
      console.error("Mic error:", err);
      setStatus("Microphone access denied or unavailable");
    }
  };

  const pauseRecording = () => {
    if (recorder && recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
      stopTimer();
      if (recognitionRef.current && recognitionRef.current.stop) {
        recognitionRef.current.stop();
      }
    }
  };

  const resumeRecording = () => {
    if (recorder && recorder.state === "paused") {
      recorder.resume();
      setIsPaused(false);
      startTimer();
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        const lines = [...liveTranscript.filter(Boolean)];
        recognition.onresult = (event) => {
          for (let i = 0; i < event.results.length; ++i) {
            const result = event.results[i];
            if (result.isFinal) {
              if (!lines.includes(result[0].transcript.trim())) {
                lines.push(result[0].transcript.trim());
              }
            }
          }
          let displayLines = [...lines];
          const lastResult = event.results[event.results.length - 1];
          if (lastResult && !lastResult.isFinal) {
            displayLines = [...lines, lastResult[0].transcript.trim()];
          }
          setLiveTranscript(displayLines.filter(Boolean));
        };
        recognition.onerror = () => {};
        recognitionRef.current = recognition;
        recognition.start();
      }
    }
  };

  const stopRecording = () => {
    if (recorder) {
      recorder.stop();
    }
    stopTimer();
    setIsRecording(false);
    setIsPaused(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setAudioLevel(0);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const getStatusStyle = () => {
    if (status.includes("Error")) return "border-red-200 bg-red-50 text-red-700 shadow-red-100";
    if (status.includes("successfully")) return "border-emerald-200 bg-emerald-50 text-emerald-700 shadow-emerald-100";
    if (status.includes("Analyzing") || status.includes("Searching") || status.includes("Creating"))
      return "border-blue-200 bg-blue-50 text-blue-700 shadow-blue-100";
    if (status.includes("Multiple matches")) return "border-amber-200 bg-amber-50 text-amber-700 shadow-amber-100";
    return "border-slate-200 bg-slate-50 text-slate-700 shadow-slate-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-lg shadow-slate-900/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Medico
                </h1>
                <p className="text-sm text-slate-600 font-medium">AI-Powered Clinical Documentation Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-slate-100 rounded-full">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700">System Online</span>
              </div>
              <div className="text-sm text-slate-600 font-medium">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Bar */}
        {status && status !== "idle" && (
          <div className={`mb-8 p-4 rounded-xl border shadow-lg ${getStatusStyle()}`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-current rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold">{status}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-900/10 rounded-2xl border border-slate-200/60 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Patient Management</h2>
                    <p className="text-sm text-slate-600">Search or register new patients</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {!patient && !multipleMatches && !showAddPatientForm && (
                  <>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Enter patient name..."
                          className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm text-slate-900 placeholder-slate-500 font-medium transition-all duration-200"
                          onKeyPress={(e) => e.key === "Enter" && searchPatient()}
                        />
                        <button
                          onClick={searchPatient}
                          className="absolute right-10 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-2 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25"
                          title="Search"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={handleVoiceSearch}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white p-2 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25"
                          title="Voice Search"
                          disabled={isVoiceSearching}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 18v2m0 0a4 4 0 004-4h-8a4 4 0 004 4zm0-14a4 4 0 00-4 4v4a4 4 0 008 0V8a4 4 0 00-4-4z"
                            />
                          </svg>
                        </button>
                      </div>
                      {isVoiceSearching && (
                        <div className="flex items-center mt-2 text-blue-700">
                          <svg className="w-4 h-4 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          </svg>
                          Listening... {voiceSearchTranscript && <span className="ml-2">{voiceSearchTranscript}</span>}
                        </div>
                      )}
                    </div>
                    {/* Add Patient Button */}
                    <button
                      onClick={() => setShowAddPatientForm(true)}
                      className="w-full mt-4 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 text-blue-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-blue-200"
                    >
                      + Add New Patient
                    </button>
                  </>
                )}

                {/* Show "No patient found." message */}
                {!patient && !multipleMatches && !showAddPatientForm && status === "No patient found." && (
                  <div className="mt-6 text-center text-red-600 font-semibold">
                    No patient found.
                  </div>
                )}

                {showAddPatientForm && (
                  <form className="space-y-4" onSubmit={addNewPatient}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={newPatient.name}
                          onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Age</label>
                          <input
                            type="number"
                            value={newPatient.age}
                            onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                          <select
                            value={newPatient.gender}
                            onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                        <input
                          type="text"
                          value={newPatient.phone}
                          onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                          className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm font-medium"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
                      >
                        Create Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddPatientForm(false)}
                        className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {multipleMatches && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <h4 className="text-amber-800 font-semibold mb-2">Multiple Matches Found</h4>
                      <p className="text-sm text-amber-700">Please select the correct patient:</p>
                    </div>

                    <div className="space-y-2">
                      {multipleMatches.map((match, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setPatient(match);
                            setInsights(match.pastInsights || []);
                            setMultipleMatches(null);
                            setStatus("Patient Dashboard");
                          }}
                          className="w-full text-left bg-white hover:bg-blue-50 border border-slate-200 rounded-xl p-4 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <div className="font-semibold text-slate-900">{match.patientName}</div>
                          <div className="text-sm text-slate-500">ID: {match.patientId}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          {patient && (
            <div className="lg:col-span-8 space-y-8">
              <div className="flex justify-start">
                <button
                  onClick={handleBackToSearch}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-semibold rounded-xl text-slate-700 bg-white/80 backdrop-blur-sm hover:bg-slate-50 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Search
                </button>
              </div>

              {/* Patient Information Card */}
              <div className="bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-900/10 rounded-2xl border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-emerald-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Patient Information</h2>
                        <p className="text-sm text-slate-600 font-medium">Active patient session</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-100 rounded-full">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-emerald-700 font-semibold">Active</span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{patient.patientName}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Patient ID</p>
                        <p className="font-bold text-slate-900">{patient.patientId}</p>
                      </div>
                      {patient.age && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Age</p>
                          <p className="font-bold text-slate-900">{patient.age} years</p>
                        </div>
                      )}
                      {patient.gender && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Gender</p>
                          <p className="font-bold text-slate-900">{patient.gender}</p>
                        </div>
                      )}
                      {patient.phone && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                          <p className="font-bold text-slate-900">{patient.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {patient && (
  <div className="bg-white rounded-xl mt-6">
    <div className="p-4 border-b font-bold text-blue-700">Patient Documents</div>
    <div className="p-4">
      <form onSubmit={handleDocUpload} className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 mb-6">
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
          onChange={handleDocFileChange}
          className="block w-full md:w-auto border border-slate-300 rounded-xl px-3 py-2 font-medium"
        />
        <input
          type="text"
          placeholder="Filename (optional)"
          value={docFilename}
          onChange={e => setDocFilename(e.target.value)}
          className="block w-full md:w-60 border border-slate-300 rounded-xl px-3 py-2 font-medium"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-xl"
        >
          Upload Document
        </button>
      </form>
      {docUploadStatus && (
        <div className={`mb-2 text-sm font-semibold ${docUploadStatus.includes("success") ? "text-green-700" : docUploadStatus.includes("Uploading") ? "text-blue-700" : "text-red-700"}`}>
          {docUploadStatus}
        </div>
      )}
      <div>
        {documentList.length === 0 ? (
          <div className="text-slate-500 font-medium text-center py-6">No documents uploaded yet.</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left py-2 px-3 font-semibold text-blue-800">Filename</th>
                <th className="text-left py-2 px-3 font-semibold text-blue-800">Uploaded At</th>
                <th className="py-2 px-3 font-semibold text-blue-800">View</th>
              </tr>
            </thead>
            <tbody>
              {documentList.map((doc, idx) => (
                <tr key={idx} className="border-b border-slate-200">
                  <td className="py-2 px-3 font-medium text-slate-900 break-all">{doc.filename}</td>
                  <td className="py-2 px-3 text-slate-600">{new Date(doc.uploadedAt).toLocaleString()}</td>
                  <td className="py-2 px-3 text-center">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-1 bg-blue-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-200"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
)}

              <h4 className="text-lg font-bold text-blue-700 mb-1">Summary</h4>
<p className="text-slate-800 text-base font-medium bg-blue-50 rounded-xl p-4 border border-blue-100 min-h-[48px]">
  {summary || "No summary available."}
</p>

              {/* Recording Controls */}
              <div className="bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-900/10 rounded-2xl border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-red-50 to-orange-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">Voice Recording Studio</h3>
                      <p className="text-sm text-slate-600 font-medium">Capture medical notes and observations</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Recording Timer and Status */}
                  {isRecording && (
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center space-x-3 px-6 py-3 bg-red-50 border border-red-200 rounded-xl">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-lg font-bold text-red-700">{formatTime(recordingTime)}</span>
                        <span className="text-sm font-medium text-red-600">{isPaused ? "PAUSED" : "RECORDING"}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={startRecording}
                      disabled={isRecording}
                      className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-emerald-500/25"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Start Recording
                    </button>

                    <button
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      disabled={!isRecording}
                      className={`inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white transition-all duration-200 ${
                        isPaused
                          ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-yellow-500/25"
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
                      } disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed`}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        {isPaused ? (
                          <path fillRule="evenodd" d="M6 4l12 6-12 6V4z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M6 4h4v12H6V4zm4 0h4v12h-4V4z" clipRule="evenodd" />
                        )}
                      </svg>
                      {isPaused ? "Resume" : "Pause"}
                    </button>

                    <button
                      onClick={stopRecording}
                      disabled={!isRecording}
                      className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-red-500/25"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Stop Recording
                    </button>
                  </div>

                  {/* Audio Playback */}
                  {audioUrl && (
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <audio controls src={audioUrl} className="flex-1 mr-4" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Medical Insights Accordion */}
              <div className="bg-white/70 backdrop-blur-sm shadow-xl shadow-slate-900/10 rounded-2xl border border-slate-200/60 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Medical Insights</h3>
                        <p className="text-sm text-slate-600 font-medium">AI-generated clinical documentation</p>
                      </div>
                    </div>
                    <div className="bg-purple-100 text-purple-800 text-sm font-bold px-4 py-2 rounded-full">
                      {insights.length} {insights.length === 1 ? "insight" : "insights"}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {insights.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">No insights recorded yet</h3>
                      <p className="text-slate-600 font-medium">
                        Start recording to generate your first medical insight.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {insights.map((entry, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 shadow-sm">
                          <button
                            type="button"
                            className="w-full flex justify-between items-center px-6 py-4 focus:outline-none"
                            onClick={() => setOpenInsightIdx(openInsightIdx === idx ? null : idx)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                              <span className="text-sm font-bold text-slate-700">{entry.date}</span>
                            </div>
                            <svg
                              className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${openInsightIdx === idx ? "rotate-90" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                          {openInsightIdx === idx && (
                            <div className="px-6 pb-6">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-slate-400 font-semibold bg-white px-3 py-1 rounded-full">
                                  Entry #{insights.length - idx}
                                </span>
                              </div>
                              <div className="prose prose-sm max-w-none">
                                <p className="text-slate-800 whitespace-pre-wrap leading-relaxed font-medium">
                                  {entry.insight}
                                </p>
                              </div>
                              {entry.audioUrl && (
                                <div className="mt-4 p-4 bg-white/60 rounded-xl border border-slate-200">
                                  <audio controls src={entry.audioUrl} className="flex-1 mr-4" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;