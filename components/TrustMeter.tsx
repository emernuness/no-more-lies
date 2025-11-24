import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FactCheckResult, VerificationStatus } from '../types';

interface TrustMeterProps {
  results: FactCheckResult[];
}

const COLORS = {
  [VerificationStatus.TRUE]: '#10b981', // emerald-500
  [VerificationStatus.FALSE]: '#ef4444', // red-500
  [VerificationStatus.PARTIALLY_TRUE]: '#f59e0b', // amber-500
  [VerificationStatus.OPINION]: '#71717a', // zinc-500
  [VerificationStatus.UNVERIFIABLE]: '#3f3f46', // zinc-700
};

export const TrustMeter: React.FC<TrustMeterProps> = ({ results }) => {
  const data = [
    { name: 'Verdadeiro', value: results.filter(r => r.status === VerificationStatus.TRUE).length, color: COLORS[VerificationStatus.TRUE] },
    { name: 'Falso', value: results.filter(r => r.status === VerificationStatus.FALSE).length, color: COLORS[VerificationStatus.FALSE] },
    { name: 'Parcial', value: results.filter(r => r.status === VerificationStatus.PARTIALLY_TRUE).length, color: COLORS[VerificationStatus.PARTIALLY_TRUE] },
    { name: 'Opinião', value: results.filter(r => r.status === VerificationStatus.OPINION).length, color: COLORS[VerificationStatus.OPINION] },
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="h-48 w-full p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 flex flex-col items-center justify-center">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Confiabilidade da Sessão</h3>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={30}
              outerRadius={50}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};