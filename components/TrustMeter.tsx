import React from 'react';
import { FactCheckResult, VerificationStatus } from '../types';

interface TrustMeterProps {
  results: FactCheckResult[];
}

const COLORS = {
  [VerificationStatus.TRUE]: '#10b981',
  [VerificationStatus.FALSE]: '#ef4444',
  [VerificationStatus.PARTIALLY_TRUE]: '#f59e0b',
  [VerificationStatus.OPINION]: '#71717a',
  [VerificationStatus.UNVERIFIABLE]: '#3f3f46',
};

export const TrustMeter: React.FC<TrustMeterProps> = ({ results }) => {
  const items = results.filter(r => r.status !== VerificationStatus.PENDING);
  const total = items.length;
  if (total === 0) return null;

  const trueCount = items.filter(r => r.status === VerificationStatus.TRUE).length;
  const falseCount = items.filter(r => r.status === VerificationStatus.FALSE).length;
  const partialCount = items.filter(r => r.status === VerificationStatus.PARTIALLY_TRUE).length;
  const opinionCount = items.filter(r => r.status === VerificationStatus.OPINION).length;
  const unverifiableCount = items.filter(r => r.status === VerificationStatus.UNVERIFIABLE).length;

  const pct = (n: number) => Math.round((n / total) * 100);
  const trustPercent = Math.round((trueCount / total) * 100);

  const segments = [
    { label: 'Verdadeiro', value: pct(trueCount), color: COLORS[VerificationStatus.TRUE] },
    { label: 'Impreciso', value: pct(partialCount), color: COLORS[VerificationStatus.PARTIALLY_TRUE] },
    { label: 'Opinião', value: pct(opinionCount), color: COLORS[VerificationStatus.OPINION] },
    { label: 'Não verificável', value: pct(unverifiableCount), color: COLORS[VerificationStatus.UNVERIFIABLE] },
    { label: 'Falso', value: pct(falseCount), color: COLORS[VerificationStatus.FALSE] },
  ].filter(s => s.value > 0);

  return (
    <div className="w-full p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Confiabilidade da Sessão</h3>
        <span className="text-xs text-zinc-500">{total} verificações</span>
      </div>

      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-white">{trustPercent}%</div>
        <div className="text-xs text-zinc-400">Índice de confiabilidade (proporção de verdadeiros)</div>
      </div>

      <div className="w-full h-3 rounded-md overflow-hidden border border-zinc-800 bg-zinc-900">
        <div className="flex h-full">
          {segments.map((s, i) => (
            <div key={i} style={{ width: `${s.value}%`, backgroundColor: s.color }} />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-[11px] px-2 py-1 rounded-md" style={{ backgroundColor: `${COLORS[VerificationStatus.TRUE]}20`, color: COLORS[VerificationStatus.TRUE] }}>Verdadeiro {trueCount}</span>
        <span className="text-[11px] px-2 py-1 rounded-md" style={{ backgroundColor: `${COLORS[VerificationStatus.FALSE]}20`, color: COLORS[VerificationStatus.FALSE] }}>Falso {falseCount}</span>
        <span className="text-[11px] px-2 py-1 rounded-md" style={{ backgroundColor: `${COLORS[VerificationStatus.PARTIALLY_TRUE]}20`, color: COLORS[VerificationStatus.PARTIALLY_TRUE] }}>Impreciso {partialCount}</span>
        <span className="text-[11px] px-2 py-1 rounded-md" style={{ backgroundColor: `${COLORS[VerificationStatus.OPINION]}20`, color: COLORS[VerificationStatus.OPINION] }}>Opinião {opinionCount}</span>
        <span className="text-[11px] px-2 py-1 rounded-md" style={{ backgroundColor: `${COLORS[VerificationStatus.UNVERIFIABLE]}20`, color: COLORS[VerificationStatus.UNVERIFIABLE] }}>Não verificável {unverifiableCount}</span>
      </div>
    </div>
  );
};