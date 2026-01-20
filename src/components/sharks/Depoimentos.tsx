import { Star, Quote } from 'lucide-react';

const depoimentos = [
  {
    nome: 'Lucas Mendes',
    texto: 'Melhor barbearia da cidade! Atendimento impecável e o corte fica sempre perfeito. Recomendo demais.',
    nota: 5,
  },
  {
    nome: 'Rafael Costa',
    texto: 'Ambiente top, profissionais de primeira. Virei cliente fiel desde a primeira visita.',
    nota: 5,
  },
  {
    nome: 'Bruno Almeida',
    texto: 'Corte degradê perfeito! Os caras são muito habilidosos. O combo corte + barba é sensacional.',
    nota: 5,
  },
  {
    nome: 'Pedro Henrique',
    texto: 'Pontualidade, qualidade e preço justo. A Sharks é referência em barbearia moderna.',
    nota: 5,
  },
];

export const Depoimentos = () => {
  return (
    <section id="depoimentos" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 border border-border rounded-full">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm text-muted-foreground">Depoimentos</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-card-foreground mb-4">
            O que nossos <span className="text-primary">clientes</span> dizem
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A satisfação dos nossos clientes é nossa maior conquista.
          </p>
        </div>

        {/* Grid de Depoimentos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {depoimentos.map((depo, index) => (
            <div
              key={index}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/30 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-primary/30 mb-4" />
              <p className="text-card-foreground mb-6 leading-relaxed">
                "{depo.texto}"
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {depo.nome.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-card-foreground">
                    {depo.nome}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[...Array(depo.nota)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-primary fill-primary"
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
