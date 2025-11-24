import React from 'react';
import { ShieldCheck, Globe, BookOpenCheck, HeartHandshake, ArrowRight, Copy, QrCode, Sparkles, Target, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

const pixKey = process.env.NML_PIX_KEY || '';
const pixQr = process.env.NML_PIX_QR_URL || '';

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
    <path d="M2 12h20" className="opacity-20" strokeWidth="1" />
    <path d="M2 7h20" className="opacity-10" strokeDasharray="2 2" strokeWidth="1" />
    <path d="M2 17h20" className="opacity-10" strokeDasharray="2 2" strokeWidth="1" />
    <path d="M12 2v20" className="opacity-10" strokeWidth="1" />
    <path d="M2 12h3l1.5 4l2-8l2.5 12L15 4l2 8h4" strokeLinejoin="bevel" />
    <circle cx="21" cy="12" r="1.5" fill="currentColor" className="animate-pulse" />
  </svg>
);

function BenefitCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="group relative">
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-emerald-600/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative h-full p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm hover:border-zinc-700 transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600/10 to-emerald-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function HowItWorksStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="relative flex items-start gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-900/50">
        {number}
      </div>
      <div className="flex-1 pt-1">
        <h4 className="text-base font-semibold text-white mb-1">{title}</h4>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-300">
      <h4 className="text-sm font-semibold text-white mb-2 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        {question}
      </h4>
      <p className="text-xs text-zinc-400 leading-relaxed pl-6">{answer}</p>
    </div>
  );
}

export default function Landing() {
  const copyPix = async () => {
    if (!pixKey) return;
    try {
      await navigator.clipboard.writeText(pixKey);
      alert('Chave PIX copiada para a área de transferência!');
    } catch {
      alert('Não foi possível copiar. Tente manualmente.');
    }
  };

  const scrollToApp = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-zinc-800/60 bg-zinc-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-900/20">
                <PolygraphIcon className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight">NML</h1>
                <p className="text-[9px] text-zinc-500 leading-none uppercase tracking-widest font-semibold">No More Lies</p>
              </div>
            </div>
            <nav className="flex items-center gap-3">
              <a
                href="#app"
                onClick={scrollToApp}
                className="px-4 py-2 rounded-lg text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-semibold shadow-lg shadow-emerald-900/30 transition-all duration-300"
              >
                Usar Agora
              </a>
              <a
                href="#apoie"
                className="hidden sm:block px-4 py-2 rounded-lg text-sm bg-zinc-800/80 hover:bg-zinc-700 text-white font-medium border border-zinc-700 transition-all duration-300"
              >
                Apoiar
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 via-zinc-950 to-zinc-950" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-red-500/5 blur-3xl" />
          <div className="absolute top-40 right-0 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-900/40 bg-red-950/30 text-xs text-red-200 mb-8 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium">Verificação independente e imparcial</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-6">
              Chega de
              <span className="block bg-gradient-to-r from-red-500 via-red-400 to-emerald-400 bg-clip-text text-transparent">
                Fake News
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl md:text-2xl text-zinc-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              Verifique informações em tempo real com fontes independentes e análise neutra baseada em IA
            </p>

            <p className="text-sm sm:text-base text-zinc-500 mb-10 max-w-2xl mx-auto">
              Combata a desinformação com tecnologia de ponta e metodologia transparente. Sem viés político, apenas fatos verificados.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#app"
                onClick={scrollToApp}
                className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-base shadow-2xl shadow-emerald-900/40 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Começar Verificação Grátis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#como-funciona"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 text-white font-semibold text-base border border-zinc-700 backdrop-blur-sm transition-all duration-300"
              >
                Como Funciona
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Fontes Verificadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Análise Neutra</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sem Viés Político</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-900/40 bg-emerald-950/30 text-xs text-emerald-200 mb-6">
              <Target className="w-3.5 h-3.5" />
              <span className="font-medium">Por que escolher o NML</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Informação confiável em um mundo de desinformação
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              Nosso compromisso é com a verdade, transparência e independência total
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BenefitCard
              icon={ShieldCheck}
              title="Totalmente Independente"
              description="Sem vínculos partidários, governamentais ou corporativos. Decisões técnicas transparentes e metodologia aberta."
            />
            <BenefitCard
              icon={Globe}
              title="Fontes Imparciais"
              description="Priorizamos verificadores internacionais, ONGs de direitos humanos, academia e mídia independente reconhecida."
            />
            <BenefitCard
              icon={BookOpenCheck}
              title="Metodologia Rigorosa"
              description="Classificação objetiva com explicações detalhadas, correções quando necessário e transparência total no processo."
            />
            <BenefitCard
              icon={Zap}
              title="Verificação em Tempo Real"
              description="Análise instantânea usando IA avançada. Resultados em segundos, não em dias como fact-checkers tradicionais."
            />
            <BenefitCard
              icon={HeartHandshake}
              title="Gratuito e Acessível"
              description="100% gratuito para sempre. Acreditamos que acesso à verdade é um direito, não um privilégio."
            />
            <BenefitCard
              icon={Sparkles}
              title="Tecnologia de Ponta"
              description="Powered by Google Gemini AI com filtros inteligentes para garantir apenas fontes confiáveis e imparciais."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="py-20 sm:py-28 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-900/40 bg-emerald-950/30 text-xs text-emerald-200 mb-6">
                <Zap className="w-3.5 h-3.5" />
                <span className="font-medium">Simples e Rápido</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Como funciona a verificação
              </h2>
              <p className="text-base sm:text-lg text-zinc-400 mb-10">
                Em apenas 4 passos simples, você obtém uma análise completa e imparcial de qualquer afirmação
              </p>

              <div className="space-y-8">
                <HowItWorksStep
                  number={1}
                  title="Envie o conteúdo"
                  description="Use o microfone para falar ou cole o texto que deseja verificar. Simples e rápido."
                />
                <HowItWorksStep
                  number={2}
                  title="Análise inteligente"
                  description="Nossa IA analisa o conteúdo usando metodologia neutra e rigorosa, sem viés político."
                />
                <HowItWorksStep
                  number={3}
                  title="Fontes verificadas"
                  description="Buscamos automaticamente fontes independentes: verificadores internacionais, ONGs e academia."
                />
                <HowItWorksStep
                  number={4}
                  title="Resultado detalhado"
                  description="Receba classificação clara (verdadeiro, falso, impreciso), explicação e links para fontes confiáveis."
                />
              </div>
            </div>

            {/* Right Column - Visual/Card */}
            <div className="lg:pl-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-red-500/10 rounded-3xl blur-2xl" />
                <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-900 p-8 backdrop-blur-sm shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center">
                      <PolygraphIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Exemplo de Verificação</div>
                      <div className="text-xs text-zinc-500">Resultado em tempo real</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="text-xs text-zinc-500 mb-1">Afirmação analisada:</div>
                      <div className="text-sm text-zinc-200 italic leading-relaxed">
                        "O desmatamento da Amazônia diminuiu 50% no último ano"
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-900/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-300">PARCIALMENTE VERDADEIRO</span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                        A redução foi de aproximadamente 22% segundo dados do INPE, não 50%. Houve diminuição significativa, mas o número está impreciso.
                      </p>
                      <div className="text-xs text-zinc-500">
                        <strong className="text-zinc-400">Fontes:</strong> INPE, AFP Checamos, Nature
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Tempo de análise</span>
                      <span className="text-emerald-400 font-semibold">~3 segundos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="apoie" className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-emerald-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 to-zinc-900 p-8 sm:p-12 backdrop-blur-sm shadow-2xl">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-700/20 mb-6">
                  <HeartHandshake className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Apoie a informação livre
                </h2>
                <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto">
                  Se você acredita em jornalismo independente e informação imparcial, ajude a manter o NML funcionando. Sua contribuição garante nossa independência e transparência.
                </p>
              </div>

              <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 mb-6">
                <div className="text-xs text-zinc-400 mb-2 font-medium">Chave PIX:</div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-sm break-all">
                    {pixKey || 'CHAVE PIX NÃO CONFIGURADA'}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyPix}
                      disabled={!pixKey}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar
                    </button>
                    {pixQr && (
                      <a
                        href={pixQr}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none px-5 py-3 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                      >
                        <QrCode className="w-4 h-4" />
                        QR Code
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center text-xs text-zinc-500">
                <p>Somos uma iniciativa 100% independente. Toda contribuição é investida em infraestrutura e melhorias.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 sm:py-28 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Perguntas Frequentes
            </h2>
            <p className="text-base sm:text-lg text-zinc-400">
              Tire suas dúvidas sobre nossa metodologia e funcionamento
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <FAQItem
              question="Como vocês escolhem as fontes?"
              answer="Priorizamos verificadores de fatos internacionais (AFP, Reuters), ONGs de direitos humanos, instituições acadêmicas e mídia independente reconhecida. Fontes governamentais de países com histórico de censura são automaticamente filtradas."
            />
            <FAQItem
              question="O que significa 'parcialmente verdadeiro'?"
              answer="Quando uma afirmação mistura fatos verdadeiros com informações imprecisas ou contexto inadequado. Fornecemos explicação detalhada e a correção necessária para esclarecer a verdade completa."
            />
            <FAQItem
              question="Como garantem a imparcialidade?"
              answer="Não temos vínculos políticos, governamentais ou corporativos. Nossa metodologia é transparente, as fontes são públicas e priorizamos diversidade de verificadores internacionais independentes."
            />
            <FAQItem
              question="Os dados são privados?"
              answer="Sim. Não coletamos dados sensíveis ou pessoais. O histórico de verificações fica armazenado apenas no seu dispositivo. Não vendemos ou compartilhamos informações com terceiros."
            />
            <FAQItem
              question="Quanto custa usar o NML?"
              answer="É 100% gratuito e sempre será. Acreditamos que o acesso à informação verificada é um direito fundamental. Aceitamos doações voluntárias para manter o projeto funcionando."
            />
            <FAQItem
              question="Posso confiar na IA?"
              answer="Usamos IA como ferramenta de análise, mas sempre com fontes verificáveis. Cada resultado mostra as fontes utilizadas para que você possa confirmar independentemente. A transparência é nossa prioridade."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para combater a desinformação?
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já verificam informações com o NML
          </p>
          <a
            href="#app"
            onClick={scrollToApp}
            className="inline-flex items-center gap-2 px-10 py-5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-lg shadow-2xl shadow-emerald-900/40 transition-all duration-300"
          >
            Começar Agora - É Grátis
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                <PolygraphIcon className="text-white w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">NML - No More Lies</div>
                <div className="text-xs text-zinc-500">Verificação independente de fatos</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">
              © {new Date().getFullYear()} No More Lies. Iniciativa independente e sem fins lucrativos.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
