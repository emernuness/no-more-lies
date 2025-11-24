import React from 'react';
import { ShieldCheck, Globe, BookOpenCheck, HeartHandshake, ArrowRight, Copy, QrCode } from 'lucide-react';

const pixKey = process.env.NML_PIX_KEY || '';
const pixQr = process.env.NML_PIX_QR_URL || '';

function Stat({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-5 rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900/60 to-zinc-900">
      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
        <Icon className="w-5 h-5 text-zinc-200" />
      </div>
      <div className="space-y-1">
        <div className="text-sm font-semibold text-white">{title}</div>
        <div className="text-xs text-zinc-400 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

export default function Landing() {
  const copyPix = async () => {
    if (!pixKey) return;
    try {
      await navigator.clipboard.writeText(pixKey);
      alert('Chave PIX copiada');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur border-b border-zinc-800/60 bg-zinc-950/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="text-white font-bold">NML</div>
          <div className="flex items-center gap-2">
            <a href="#app" className="px-3 py-1.5 rounded-md text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-medium">Ir para App</a>
            <a href="#apoie" className="px-3 py-1.5 rounded-md text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-medium">Apoiar</a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-zinc-950 to-zinc-950" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] rounded-full bg-red-500/10 blur-3xl" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-900/40 bg-red-950/30 text-[11px] text-red-200">Projeto independente</div>
          <h1 className="mt-4 text-4xl md:text-6xl font-black tracking-tight text-white">No More Lies</h1>
          <p className="mt-2 text-lg md:text-xl text-zinc-300 max-w-2xl">Checagem independente e neutra para combater desinformação e fake news com fontes imparciais.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#app" className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2">
              Começar a verificar
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#apoie" className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold">Apoiar a iniciativa</a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Por que existimos</h2>
            <p className="text-zinc-300">Vivemos um período de alta desinformação, especialmente política. O NML busca trazer luz aos fatos, usando fontes independentes e verificações neutras, sem viés político.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Stat icon={ShieldCheck} title="Independência" desc="Projeto sem vínculos partidários; decisões técnicas transparentes." />
              <Stat icon={Globe} title="Fontes imparciais" desc="Verificadores independentes, ONGs e academia; filtros contra censura e viés." />
              <Stat icon={BookOpenCheck} title="Metodologia" desc="Classificação objetiva com explicações e correções quando preciso." />
            </div>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-900 p-6">
            <h3 className="text-lg font-semibold text-white">Como funciona</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-emerald-900/30 text-emerald-300 flex items-center justify-center text-xs">1</div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Fale ou cole um trecho</div>
                  <div className="text-xs text-zinc-400">Envie o conteúdo para análise de veracidade.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-emerald-900/30 text-emerald-300 flex items-center justify-center text-xs">2</div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Análise neutra</div>
                  <div className="text-xs text-zinc-400">Classificação objetiva com explicação clara.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-emerald-900/30 text-emerald-300 flex items-center justify-center text-xs">3</div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Fontes independentes</div>
                  <div className="text-xs text-zinc-400">Verificadores, ONGs e academia embasam a resposta.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-emerald-900/30 text-emerald-300 flex items-center justify-center text-xs">4</div>
                <div>
                  <div className="text-sm font-semibold text-zinc-200">Compartilhe</div>
                  <div className="text-xs text-zinc-400">Amplifique a checagem para combater a desinformação.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="apoie" className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-900 p-6">
          <div className="flex items-center gap-3">
            <HeartHandshake className="w-6 h-6 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Apoie o NML</h3>
          </div>
          <p className="mt-2 text-zinc-300 text-sm">Se você acredita em informação limpa e imparcial, apoie o NML. Sua contribuição mantém o projeto independente e transparente.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="px-3 py-2 rounded-lg bg-zinc-800 text-zinc-200 font-mono text-xs">{pixKey || 'CHAVE PIX NÃO CONFIGURADA'}</div>
            <button onClick={copyPix} className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm flex items-center gap-1">
              <Copy className="w-4 h-4" /> Copiar chave
            </button>
            {pixQr ? (
              <a href={pixQr} target="_blank" rel="noreferrer" className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-sm flex items-center gap-1">
                <QrCode className="w-4 h-4" /> Ver QR Code
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/50 to-zinc-900 p-6">
          <h3 className="text-lg font-semibold text-white">FAQ</h3>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <div className="text-sm font-semibold text-zinc-200">Como escolhem as fontes?</div>
              <div className="mt-1 text-xs text-zinc-400">Priorizamos verificadores independentes, ONGs e academia; fontes governamentais e com viés são filtradas.</div>
            </div>
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <div className="text-sm font-semibold text-zinc-200">O que significa “impreciso”?</div>
              <div className="mt-1 text-xs text-zinc-400">Afirmações que misturam contexto ou conceitos recebem explicação e correção.</div>
            </div>
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <div className="text-sm font-semibold text-zinc-200">Privacidade</div>
              <div className="mt-1 text-xs text-zinc-400">Não coletamos dados sensíveis; histórico fica no seu dispositivo.</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-8 text-xs text-zinc-500">© {new Date().getFullYear()} No More Lies — Iniciativa independente</div>
      </footer>
    </div>
  );
}
