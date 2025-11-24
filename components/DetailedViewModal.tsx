import React from 'react';
import { FactCheckResult, VerificationStatus } from '../types';
import { X, Share2, ExternalLink, CheckCircle, XCircle, AlertTriangle, HelpCircle, MessageSquare, Quote } from 'lucide-react';

interface DetailedViewModalProps {
  result: FactCheckResult;
  onClose: () => void;
  onShare: () => void;
}

export const DetailedViewModal: React.FC<DetailedViewModalProps> = ({ result, onClose, onShare }) => {
  if (!result) return null;

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.TRUE:
        return {
          icon: <CheckCircle className="w-12 h-12 text-emerald-400" />,
          color: 'emerald',
          label: 'INFORMAÇÃO VERDADEIRA',
          bg: 'bg-emerald-950',
          border: 'border-emerald-900',
          text: 'text-emerald-400'
        };
      case VerificationStatus.FALSE:
        return {
          icon: <XCircle className="w-12 h-12 text-red-400" />,
          color: 'red',
          label: 'FAKE NEWS DETECTADA',
          bg: 'bg-red-950',
          border: 'border-red-900',
          text: 'text-red-400'
        };
      case VerificationStatus.PARTIALLY_TRUE:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-amber-400" />,
          color: 'amber',
          label: 'INFORMAÇÃO IMPRECISA',
          bg: 'bg-amber-950',
          border: 'border-amber-900',
          text: 'text-amber-400'
        };
      case VerificationStatus.OPINION:
        return {
          icon: <MessageSquare className="w-12 h-12 text-zinc-400" />,
          color: 'zinc',
          label: 'OPINIÃO / SUBJETIVO',
          bg: 'bg-zinc-900',
          border: 'border-zinc-700',
          text: 'text-zinc-400'
        };
      default:
        return {
          icon: <HelpCircle className="w-12 h-12 text-zinc-500" />,
          color: 'zinc',
          label: 'NÃO VERIFICÁVEL',
          bg: 'bg-zinc-900',
          border: 'border-zinc-800',
          text: 'text-zinc-500'
        };
    }
  };

  const config = getStatusConfig(result.status);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 rounded-2xl border ${config.border} shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200`}>
        
        {/* Header Banner */}
        <div className={`sticky top-0 z-10 p-6 ${config.bg} border-b ${config.border} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            {config.icon}
            <div>
              <h2 className={`text-xl font-bold tracking-tight ${config.text}`}>{config.label}</h2>
              <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium">
                Verificado em {new Date(result.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/20 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          
          {/* Transcript Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-zinc-500 mb-2">
              <Quote className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">O que foi dito</span>
            </div>
            <p className="text-xl md:text-2xl font-serif text-zinc-100 leading-relaxed italic border-l-4 border-zinc-700 pl-4 py-1">
              "{result.originalText}"
            </p>
          </div>

          {/* Analysis Section */}
          <div className="bg-zinc-900/50 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-3">Análise Detalhada</h3>
            <p className="text-zinc-300 leading-relaxed text-base">
              {result.explanation}
            </p>
          </div>

          {/* Correction / Truth Section - Only if false/partial */}
          {(result.status === VerificationStatus.FALSE || result.status === VerificationStatus.PARTIALLY_TRUE) && result.correction && (
             <div className="bg-emerald-950/20 rounded-xl p-5 border border-emerald-900/50">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">A Verdade dos Fatos</h3>
                </div>
                <p className="text-emerald-100/90 leading-relaxed font-medium">
                  {result.correction}
                </p>
             </div>
          )}

          {/* Evidence / Sources Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Fontes e Evidências
            </h3>
            
            {result.sources.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {result.sources.map((source, idx) => (
                  <a 
                    key={idx}
                    href={source.uri}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex flex-col p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800 transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-blue-400 group-hover:text-blue-300 truncate w-full mb-1">
                      {source.title}
                    </span>
                    <span className="text-xs text-zinc-500 truncate w-full">
                      {source.uri}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm italic">
                Nenhuma fonte específica vinculada a esta verificação no momento.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-4 bg-zinc-950 border-t border-zinc-900 flex justify-end gap-3">
           <button 
             onClick={onShare}
             className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg font-medium text-sm transition-colors"
           >
             <Share2 className="w-4 h-4" />
             Compartilhar Resultado
           </button>
           <button 
             onClick={onClose}
             className="px-6 py-2 bg-zinc-100 hover:bg-white text-zinc-900 rounded-lg font-bold text-sm transition-colors"
           >
             Fechar
           </button>
        </div>

      </div>
    </div>
  );
};