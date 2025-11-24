import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Activity, Trash2, Filter, Share2, Loader2, AlertTriangle, WifiOff } from 'lucide-react';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { checkFact } from './services/geminiService';
import { FactCard } from './components/FactCard';
import { TrustMeter } from './components/TrustMeter';
import { DetailedViewModal } from './components/DetailedViewModal';
import { FactCheckResult, VerificationStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

type FilterType = 'ALL' | 'FALSE' | 'TRUE' | 'OTHER';

const PolygraphIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* Technical Grid Background */}
    <path d="M2 12h20" className="opacity-20" strokeWidth="1" />
    <path d="M2 7h20" className="opacity-10" strokeDasharray="2 2" strokeWidth="1" />
    <path d="M2 17h20" className="opacity-10" strokeDasharray="2 2" strokeWidth="1" />
    <path d="M12 2v20" className="opacity-10" strokeWidth="1" />

    {/* The Signal Path - Sharp and irregular like a lie detector */}
    <path d="M2 12h3l1.5 4l2-8l2.5 12L15 4l2 8h4" strokeLinejoin="bevel" />

    {/* Real-time Indicator Dot */}
    <circle cx="21" cy="12" r="1.5" fill="currentColor" className="animate-pulse" />
  </svg>
);

function App() {
  const { isListening, startListening, stopListening, transcript, finalTranscript, error: speechError, permissionGranted, requestMicrophoneAccess, micPermissionState } = useSpeechRecognition();

  // Initialize results from localStorage
  const [results, setResults] = useState<FactCheckResult[]>(() => {
    try {
        const saved = localStorage.getItem('nml_history');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedResult, setSelectedResult] = useState<FactCheckResult | null>(null);
  const [processedTexts, setProcessedTexts] = useState<Set<string>>(new Set());
  const [bufferText, setBufferText] = useState<string>('');
  const lastSentAtRef = useRef<number>(0);
  const [contextSegments, setContextSegments] = useState<string[]>([]);
  const [entities, setEntities] = useState<string[]>([]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Persistence effect
  useEffect(() => {
    localStorage.setItem('nml_history', JSON.stringify(results));
  }, [results]);

  // Handle new final transcripts (completed sentences)
  useEffect(() => {
    if (!finalTranscript) return;
    const text = finalTranscript.trim();
    if (!text) return;
    if (processedTexts.has(text)) return;
    const endsPunct = /[.!?]$/.test(text);
    const hasDigits = /\d/.test(text);
    const longEnough = text.length >= 30;
    const now = Date.now();
    const minIntervalMet = now - lastSentAtRef.current >= 2000;
    if ((longEnough || endsPunct || hasDigits) && minIntervalMet) {
      const toSend = bufferText ? `${bufferText} ${text}`.trim() : text;
      setBufferText('');
      handleVerification(toSend);
      lastSentAtRef.current = now;
      setProcessedTexts(prev => new Set(prev).add(text));
    } else {
      const next = `${bufferText} ${text}`.trim();
      setBufferText(next);
      setProcessedTexts(prev => new Set(prev).add(text));
      if (next.length >= 80 && minIntervalMet) {
        handleVerification(next);
        lastSentAtRef.current = now;
        setBufferText('');
      }
    }
  }, [finalTranscript]);

  const extractEntities = (t: string) => {
    const m = t.match(/([A-ZÁÉÍÓÚÃÕÂÊÎÔÛÀÇ][a-záéíóúãõâêîôûàç]+(?:\s+[A-ZÁÉÍÓÚÃÕÂÊÎÔÛÀÇ][a-záéíóúãõâêîôûàç]+){0,3})/g) || [];
    const stop = new Set(['O','A','Os','As','De','Da','Do','E','Em','No','Na','Nos','Nas','Um','Uma']);
    const list = m.filter(x => !stop.has(x)).map(x => x.trim());
    const uniq = Array.from(new Set([...entities, ...list]));
    return uniq.slice(0, 20);
  };

  const handleVerification = async (text: string) => {
    setIsProcessing(true);

    // Optimistic pending state
    const pendingId = uuidv4();
    const pendingResult: FactCheckResult = {
      id: pendingId,
      originalText: text,
      status: VerificationStatus.PENDING,
      explanation: "Aguarde enquanto analisamos os fatos em tempo real...",
      sources: [],
      timestamp: Date.now()
    };

    // Add pending
    setResults(prev => [pendingResult, ...prev]);
    setContextSegments(prev => [...prev.slice(-4), text]);
    setEntities(extractEntities(text));

    try {
      const resultData = await checkFact(text, { segments: contextSegments, entities });

      setResults(prev => prev.map(item =>
        item.id === pendingId
          ? { ...item, ...resultData, status: resultData.status }
          : item
      ));

    } catch (error) {
      console.error(error);
      setResults(prev => prev.filter(item => item.id !== pendingId));
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const clearHistory = () => {
      if (window.confirm("Tem certeza que deseja apagar todo o histórico de verificações?")) {
          setResults([]);
          localStorage.removeItem('nml_history');
      }
  };

  const handleShareResult = async (result: FactCheckResult) => {
    const shareText = `🔍 NML - Verificação de Fato\n\n"${result.originalText}"\n\nVerdict: ${result.status === VerificationStatus.TRUE ? '✅ VERDADEIRO' : result.status === VerificationStatus.FALSE ? '❌ FAKE NEWS' : '⚠️ ' + result.status}\n\n${result.explanation}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'No More Lies - Verificação',
                text: shareText,
                url: window.location.href
            });
        } catch (err) {
            console.log('Share canceled');
        }
    } else {
        await navigator.clipboard.writeText(shareText);
        alert('Resultado copiado para a área de transferência!');
    }
  };

  const filteredResults = results.filter(r => {
      if (filter === 'ALL') return true;
      if (filter === 'TRUE') return r.status === VerificationStatus.TRUE;
      if (filter === 'FALSE') return r.status === VerificationStatus.FALSE;
      if (filter === 'OTHER') return r.status !== VerificationStatus.TRUE && r.status !== VerificationStatus.FALSE;
      return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-red-500/30 flex flex-col overflow-hidden">

      <DetailedViewModal
        result={selectedResult as FactCheckResult}
        onClose={() => setSelectedResult(null)}
        onShare={() => selectedResult && handleShareResult(selectedResult)}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/20">
              <PolygraphIcon className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">NML</h1>
              <p className="text-[10px] text-zinc-500 leading-none uppercase tracking-widest font-semibold">No More Lies</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             {isListening && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-medium text-red-400">ESCUTANDO</span>
                </div>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 flex flex-col md:flex-row gap-6">

        {/* Left Column: Controls & Live Transcript */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 sticky top-24 self-start z-30">

            {/* Control Center */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-xl flex flex-col items-center">

                {speechError ? (
                    <div className="w-full mb-4 p-4 bg-red-500/10 border border-red-900/50 rounded-lg flex flex-col items-center gap-2 text-center animate-in fade-in slide-in-from-top-2">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <span className="text-sm font-semibold text-red-400">
                          {micPermissionState === 'denied' || (speechError && speechError.toLowerCase().includes('permissão')) ? 'Permissão de Microfone Bloqueada' : 'Erro'}
                        </span>
                        <span className="text-xs text-red-200/80 leading-snug">{speechError}</span>
                        {micPermissionState === 'denied' && (
                          <div className="text-[11px] text-zinc-300/80 mt-1">
                            Abra as permissões do site: clique no ícone de cadeado na barra de endereço → Permissões → Microfone: Permitir. No macOS: Ajustes do Sistema → Privacidade e Segurança → Microfone → permita para seu navegador.
                          </div>
                        )}
                    </div>
                ) : null}

                <button
                    onClick={toggleRecording}
                    disabled={!!speechError && !navigator.onLine}
                    className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                    isListening
                        ? 'bg-red-600 text-white mic-pulse shadow-red-900/40'
                        : !!speechError
                            ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed border-4 border-zinc-800'
                            : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:scale-105 border-4 border-emerald-800/30'
                    }`}
                >
                    {speechError ? <MicOff className="w-10 h-10" /> : <Mic className={`w-10 h-10 ${isListening ? 'animate-pulse' : ''}`} />}
                </button>

                <p className="mt-4 text-center text-sm font-medium text-zinc-400">
                    {speechError
                        ? 'Tente recarregar ou verifique a conexão'
                        : isListening
                            ? 'Analisando discurso...'
                            : 'Toque para Iniciar'}
                </p>

            </div>

            {/* Stats */}
            <TrustMeter results={results} />

            {/* Live Transcript Snippet */}
            <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 min-h-[120px] flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-zinc-500">
                        <Activity className="w-4 h-4" />
                        <span className="text-xs uppercase font-bold tracking-wider">Transcrição ao Vivo</span>
                    </div>
                    {isProcessing && (
                        <div className="flex items-center gap-1.5">
                            <Loader2 className="w-3 h-3 text-emerald-500 animate-spin" />
                            <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider animate-pulse">Verificando</span>
                        </div>
                    )}
                </div>
                <div className="flex-1 relative">
                    {transcript ? (
                        <p className="text-zinc-200 text-lg leading-relaxed animate-pulse">
                            "{transcript}"
                        </p>
                    ) : (
                        <p className="text-zinc-600 italic text-sm">Aguardando fala...</p>
                    )}
                </div>
            </div>
        </div>

        {/* Right Column: Fact Stream */}
        <div className="w-full md:w-2/3 flex flex-col">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-zinc-950/90 backdrop-blur sticky top-16 z-20 py-2">
                <div>
                    <h2 className="text-lg font-semibold text-white">Histórico de Verificação</h2>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'ALL' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-300'}`}
                        >
                            Tudo
                        </button>
                        <button
                            onClick={() => setFilter('FALSE')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'FALSE' ? 'bg-red-900/50 text-red-200' : 'text-zinc-400 hover:text-red-400'}`}
                        >
                            Fake News
                        </button>
                        <button
                            onClick={() => setFilter('TRUE')}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filter === 'TRUE' ? 'bg-emerald-900/50 text-emerald-200' : 'text-zinc-400 hover:text-emerald-400'}`}
                        >
                            Verdade
                        </button>
                    </div>

                    {results.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors border border-transparent hover:border-red-900/30"
                            title="Limpar Histórico"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 space-y-4 pb-20">
                {results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500">
                        <PolygraphIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-sm">Nenhuma verificação realizada.</p>
                        <p className="text-xs mt-1 opacity-60">Seu histórico aparecerá aqui.</p>
                    </div>
                ) : filteredResults.length === 0 ? (
                     <div className="text-center py-12 text-zinc-500">
                        <p>Nenhum resultado encontrado para este filtro.</p>
                     </div>
                ) : (
                    filteredResults.map((result) => (
                        <FactCard
                            key={result.id}
                            result={result}
                            onClick={(r) => setSelectedResult(r)}
                            onShare={(r) => handleShareResult(r)}
                        />
                    ))
                )}
                <div ref={bottomRef} />
            </div>
        </div>

      </main>
    </div>
  );
}

export default App;
