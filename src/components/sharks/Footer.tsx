const navLinks = [
  { href: '#inicio', label: 'Início' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#agendar', label: 'Agendar' },
  { href: '#contato', label: 'Contato' },
];

export const Footer = () => {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="py-12 bg-card border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <a href="#inicio" className="text-2xl font-bold tracking-tight">
              <span className="text-card-foreground">SHARKS</span>
              <span className="text-primary">.</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              Barbearia Premium
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap justify-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© {anoAtual} Sharks Barbearia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};
