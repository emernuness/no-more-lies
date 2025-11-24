import { useState, useEffect, useRef, useCallback } from 'react';

// Interface for the Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState(''); 
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Ref to track user intent to stay listening (continuous mode)
  const isListeningRef = useRef(false); 
  // Ref to prevent restart loops on hard errors
  const ignoreRestartRef = useRef(false);
  // Ref to count consecutive network errors
  const networkRetryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  useEffect(() => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const Recognition = SpeechRecognition || webkitSpeechRecognition;

    if (!Recognition) {
      console.warn("Speech Recognition not supported in this browser.");
      setError("Seu navegador não suporta reconhecimento de fala. Tente usar o Google Chrome.");
      return;
    }

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR'; 

    recognition.onstart = () => {
      setIsListening(true);
      setPermissionGranted(true);
      setError(null);
      ignoreRestartRef.current = false; 
      networkRetryCountRef.current = 0; // Reset retries on successful connection
    };

    recognition.onend = () => {
      // Only restart if the user intends to listen AND no critical error occurred
      if (isListeningRef.current && !ignoreRestartRef.current) {
          // Add a small delay to prevent CPU spinning on tight loops or rapid network failures
          setTimeout(() => {
              try {
                  // Double check intent after timeout
                  if (isListeningRef.current) {
                      recognition.start();
                  }
              } catch(e) {
                  // Silent catch to prevent console spam on restart race conditions
                  console.debug("Restart failed", e);
                  setIsListening(false);
              }
          }, 150);
      } else {
          setIsListening(false);
          isListeningRef.current = false;
      }
    };

    recognition.onerror = (event: any) => {
        const err = event.error;
        
        // Handle 'no-speech' (always transient, ignore)
        if (err === 'no-speech') {
            return;
        }

        // Handle 'network' with retry limit
        if (err === 'network') {
            if (networkRetryCountRef.current < MAX_RETRIES) {
                networkRetryCountRef.current += 1;
                console.warn(`Speech API Network glitch (Attempt ${networkRetryCountRef.current}/${MAX_RETRIES}). Auto-retrying...`);
                // Do NOT set ignoreRestartRef, so onend will trigger a restart
                return;
            } else {
                console.warn("Speech API Network error: Max retries reached.");
                ignoreRestartRef.current = true;
                isListeningRef.current = false;
                setIsListening(false);
                setError("Erro de conexão persistente (Network). Verifique sua internet ou tente novamente.");
                return;
            }
        }

        // For actual fatal errors, we stop the loop
        ignoreRestartRef.current = true;
        isListeningRef.current = false;
        setIsListening(false);

        if (err === 'not-allowed' || err === 'service-not-allowed') {
            setPermissionGranted(false);
            console.warn("Speech API Permission denied.");
            setError("Acesso ao microfone negado ou bloqueado pelo sistema.");
        } else if (err === 'aborted') {
            // User stopped it manually or another tab took over
            setError(null); 
        } else {
            console.error("Speech API Error:", err);
            setError(`Erro no reconhecimento: ${err}`);
        }
    };

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
      if (final) {
        setFinalTranscript(final);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort(); 
      }
    };
  }, []);

  const requestMicrophoneAccess = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(track => track.stop()); 
          setPermissionGranted(true);
          return true;
      } catch (error) {
          console.error("Microphone permission denied:", error);
          alert("O NML precisa de acesso ao microfone. Verifique as permissões do navegador.");
          setPermissionGranted(false);
          setError("Permissão de microfone negada.");
          return false;
      }
  };

  const startListening = useCallback(async () => {
    setError(null);
    ignoreRestartRef.current = false;
    networkRetryCountRef.current = 0; // Reset retries

    if (!navigator.onLine) {
        setError("Sem conexão com a internet.");
        return;
    }

    if (!permissionGranted) {
        const granted = await requestMicrophoneAccess();
        if (!granted) return;
    }

    if (recognitionRef.current) {
        try {
            isListeningRef.current = true;
            recognitionRef.current.start();
        } catch(e) {
            console.warn("Recognition already started or failed to start:", e);
        }
    }
  }, [permissionGranted]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isListeningRef.current = false; 
      ignoreRestartRef.current = true; // Ensure onend doesn't restart
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const resetTranscript = useCallback(() => {
      setFinalTranscript('');
      setTranscript('');
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    transcript,
    finalTranscript,
    resetTranscript,
    permissionGranted,
    error
  };
};