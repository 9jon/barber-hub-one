import { Scissors, Sparkles } from 'lucide-react';

const servicos = [
  {
    nome: 'Corte Clássico',
    descricao: 'Corte tradicional com acabamento impecável.',
    preco: 45,
    duracao: '30 min',
  },
  {
    nome: 'Corte + Barba',
    descricao: 'Combo completo para o visual perfeito.',
    preco: 70,
    duracao: '50 min',
  },
  {
    nome: 'Barba Completa',
    descricao: 'Modelagem, toalha quente e hidratação.',
    preco: 35,
    duracao: '25 min',
  },
  {
    nome: 'Corte Degradê',
    descricao: 'Fade perfeito do zero ao topo.',
    preco: 55,
    duracao: '40 min',
  },
  {
    nome: 'Pigmentação',
    descricao: 'Cobertura de falhas na barba ou cabelo.',
    preco: 40,
    duracao: '30 min',
  },
  {
    nome: 'Tratamento Capilar',
    descricao: 'Hidratação profunda e revitalização.',
    preco: 60,
    duracao: '45 min',
  },
];

export const Servicos = () => {
  return (
    <section id="servicos" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 border border-border rounded-full">
            <Scissors className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Nossos Serviços</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-card-foreground mb-4">
            Serviços & <span className="text-primary">Preços</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Serviços premium com produtos de alta qualidade e profissionais
            experientes.
          </p>
        </div>

        {/* Grid de Serviços */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicos.map((servico, index) => (
            <div
              key={index}
              className="group p-6 bg-secondary rounded-xl border border-border hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground bg-background px-3 py-1 rounded-full">
                  {servico.duracao}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                {servico.nome}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {servico.descricao}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  R$ {servico.preco}
                </span>
                <a
                  href="#agendar"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Agendar →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
