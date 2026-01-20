export const Hero = () => {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Background com linhas geométricas */}
      <div className="absolute inset-0 geometric-bg opacity-50" />
      
      {/* Linhas decorativas amarelas */}
      <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="absolute top-1/3 right-0 w-1/2 h-px bg-primary/20" />
      <div className="absolute bottom-1/4 left-0 w-1/3 h-px bg-primary/20" />
      
      {/* Círculo decorativo */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 border border-primary/10 rounded-full" />
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 w-64 h-64 border border-primary/20 rounded-full" />

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-border rounded-full bg-card/50 backdrop-blur-sm">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-sm text-muted-foreground">Barbearia Premium</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-card-foreground">
          Seu novo corte
          <br />
          <span className="text-primary">favorito.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Estilo, precisão e atitude. Na Sharks, cada corte é uma obra de arte
          feita sob medida para você.
        </p>

        {/* CTA Button */}
        <a
          href="#agendar"
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold text-lg rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
        >
          Agendar agora
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </a>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">5+</div>
            <div className="text-sm text-muted-foreground">Anos de experiência</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">2k+</div>
            <div className="text-sm text-muted-foreground">Clientes satisfeitos</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-primary">4.9</div>
            <div className="text-sm text-muted-foreground">Avaliação média</div>
          </div>
        </div>
      </div>
    </section>
  );
};
