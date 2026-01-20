import { useState } from 'react';
import { Mail, MapPin, Send, Check } from 'lucide-react';

export const Contato = () => {
  const [enviado, setEnviado] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simula envio (sem integração externa)
    setEnviado(true);
    setNome('');
    setEmail('');
    setMensagem('');
    setTimeout(() => setEnviado(false), 5000);
  };

  return (
    <section id="contato" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 border border-border rounded-full">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Contato</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-card-foreground mb-4">
            Fale <span className="text-primary">conosco</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tem alguma dúvida? Entre em contato e responderemos o mais breve possível.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Info */}
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-xl border border-border">
              <MapPin className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-card-foreground mb-2">
                Endereço
              </h3>
              <p className="text-muted-foreground">
                Av. Principal, 1234<br />
                Centro - Cidade, Estado<br />
                CEP: 00000-000
              </p>
            </div>

            <div className="p-6 bg-card rounded-xl border border-border">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Horário de Funcionamento
              </h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Segunda - Sexta</span>
                  <span className="text-primary font-medium">08:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sábado - Domingo</span>
                  <span>Fechado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-card rounded-xl p-6 border border-border">
            {enviado ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Mensagem enviada!
                </h3>
                <p className="text-muted-foreground">
                  Entraremos em contato em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    maxLength={100}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={255}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Mensagem
                  </label>
                  <textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    required
                    maxLength={1000}
                    rows={4}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Sua mensagem..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar Mensagem
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
