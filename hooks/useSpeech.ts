import { useState, useEffect, useRef, useCallback } from 'react';

// Polyfill for browsers that might have prefixed versions
// FIX: Cast window to any to access non-standard properties.
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  
  // FIX: Use `any` for the ref type since `SpeechRecognition` is not a standard
  // type and the constant on line 4 shadows any potential global type definition.
  const recognitionRef = useRef<any | null>(null);

  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      // Assume granted if Permissions API is not supported
      setPermissionStatus('granted');
      return;
    }
    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionStatus(permission.state);
      permission.onchange = () => {
        setPermissionStatus(permission.state);
      };
    } catch(e) {
        console.error("Could not query microphone permission:", e);
        // Fallback for browsers that might not support this specific query
        setPermissionStatus('granted');
    }
  }, []);

  useEffect(() => {
    checkPermission();

    if (!SpeechRecognition) {
      console.error("Speech Recognition API not supported in this browser.");
      return;
    }
    // Create the instance once and store it in the ref
    if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Default language

        recognition.onresult = (event: any) => {
          let interim = '';
          let final = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final += event.results[i][0].transcript;
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setTranscript(interim);
          if(final){
             // Use a functional update to avoid stale state
             setFinalTranscript(prev => prev + final);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setTranscript('');
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error, event.message);
          setIsListening(false);
        };
    }
    
    // Cleanup function to stop recognition when the component unmounts
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }
  }, [checkPermission]);

  const startListening = () => {
    if (permissionStatus !== 'granted') {
        console.warn("Microphone permission not granted.");
        checkPermission(); // Re-check permission in case it was just granted
        return;
    }
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setFinalTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch(e) {
        // This can happen if start() is called too close to a previous stop()
        console.error("Error starting speech recognition:", e);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = ({ text, lang = 'en-US' }: { text: string; lang?: string }) => {
    if (!window.speechSynthesis) {
        console.error("Speech Synthesis API not supported.");
        return;
    }
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    // Try to find a female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female') && voice.lang.startsWith(lang.split('-')[0]));
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsSpeaking(false);
    }
    window.speechSynthesis.speak(utterance);
  };
  
   // Load voices on mount
  useEffect(() => {
    if (window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  return { isListening, transcript, finalTranscript, isSpeaking, startListening, stopListening, speak, permissionStatus };
};