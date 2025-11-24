import React from 'react';
import { FactCheckResult, VerificationStatus } from '../types';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle, MessageSquare, ExternalLink, Share2, Maximize2, Loader2 } from 'lucide-react';

interface FactCardProps {
  result: FactCheckResult;
  onClick?: (result: FactCheckResult) => void;
  onShare?: (result: FactCheckResult, e: React.MouseEvent) => void;
}

export const FactCard: React.FC<FactCardProps> = ({ result, onClick, onShare }) => {
  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.TRUE:
        return {
          icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
          borderColor: 'border-emerald-900',
          bgGradient: 'from-emerald-950/30 to-zinc-900/50',
          textColor: 'text-emerald-400',
          label: 'VERDADEIRO'
        };
      case VerificationStatus.FALSE:
        return {
          icon: <XCircle className="w-6 h-6 text-red-500" />,
          borderColor: 'border-red-900',
          bgGradient: 'from-red-950/30 to-zinc-900/50',
          textColor: 'text-red-400',
          label: 'FAKE NEWS'
        };
      case VerificationStatus.PARTIALLY_TRUE:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
          borderColor: 'border-amber-900',
          bgGradient: 'from-amber-950/30 to-zinc-900/50',
          textColor: 'text-amber-400',
          label: 'IMPRECISO'
        };
      case VerificationStatus.OPINION:
        return {
          icon: <MessageSquare className="w-6 h-6 text-zinc-500" />,
          borderColor: 'border-zinc-800',
          bgGradient: 'from-zinc-900 to-zinc-900/50',
          textColor: 'text-zinc-400',
          label: 'OPINIÃO'
        };
      case VerificationStatus.PENDING:
        return {
          icon: <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />,
          borderColor: 'border-blue-900/50',
          bgGradient: 'from-blue-950/10 to-zinc-900/50',
          textColor: 'text-blue-400',
          label: 'ANALISANDO...'
        };
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-zinc-600" />,
          borderColor: 'border-zinc-800',
          bgGradient: 'from-zinc-900 to-zinc-900',
          textColor: 'text-zinc-500',
          label: 'NÃO VERIFICÁVEL'
        };
    }
  };

  const config = getStatusConfig(result.status);
  const isPending = result.status === VerificationStatus.PENDING;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) onShare(result, e);
  };

  return (
    <div 
      onClick={() => !isPending && onClick && onClick(result)}
      className={`group relative w-full mb-4 rounded-xl border ${config.borderColor} bg-gradient-to-br ${config.bgGradient} p-5 shadow-lg backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${!isPending ? 'cursor-pointer hover:shadow-xl hover:scale-[1.01] hover:border-opacity-80' : 'cursor-wait opacity-90'}`}
    >
      {/* Top Action Bar - Visible on Hover (Only if not pending) */}
      {!isPending && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
                onClick={handleShare}
                className="p-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white backdrop-blur-md"
                title="Compartilhar"
            >
                <Share2 className="w-4 h-4" />
            </button>
            <button 
                className="p-1.5 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white backdrop-blur-md"
                title="Ver Detalhes"
            >
                <Maximize2 className="w-4 h-4" />
            </button>
        </div>
      )}

      <div className="flex justify-between items-start mb-2 pr-12">
        <div className="flex items-center gap-2">
          {config.icon}
          <span className={`text-xs font-bold tracking-widest ${config.textColor} ${isPending ? 'animate-pulse' : ''}`}>{config.label}</span>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <div className="mb-3">
        <p className={`text-zinc-300 text-lg font-medium leading-snug line-clamp-2 ${isPending ? 'opacity-80' : ''}`}>
            "{result.originalText}"
        </p>
      </div>

      <div className={`bg-black/20 rounded-lg p-3 border border-white/5 ${isPending ? 'animate-pulse' : ''}`}>
        <p className="text-sm text-zinc-300 mb-2 line-clamp-3">{result.explanation}</p>
        
        {result.status === VerificationStatus.FALSE && result.correction && (
          <div className="mt-2 pt-2 border-t border-white/10">
            <p className="text-sm font-semibold text-emerald-400 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              A Verdade: <span className="line-clamp-2">{result.correction}</span>
            </p>
          </div>
        )}
      </div>

      {result.sources.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {result.sources.slice(0, 2).map((source, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-1 text-xs text-blue-400/80 bg-blue-950/20 px-2 py-1 rounded-md border border-blue-900/30"
            >
              <ExternalLink className="w-3 h-3" />
              <span className="truncate max-w-[150px]">{source.title}</span>
            </div>
          ))}
          {result.sources.length > 2 && (
             <span className="text-xs text-zinc-500 py-1 px-1">+{result.sources.length - 2} fontes</span>
          )}
        </div>
      )}
      
      {!isPending && (
        <div className="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-zinc-600 uppercase tracking-widest font-semibold">
            Clique para ver detalhes e fontes
        </div>
      )}
    </div>
  );
};