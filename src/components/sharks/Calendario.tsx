import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Check, X, User } from 'lucide-react';
import { useAgendamentos } from '@/hooks/useAgendamentos';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const HORARIOS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

const formatarData = (date: Date): string => {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
};

export const Calendario = () => {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<string>('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const { adicionarAgendamento, getHorariosOcupados, profissionais } = useAgendamentos();

  // Selecionar primeiro profissional automaticamente
  useEffect(() => {
    if (profissionais.length > 0 && !profissionalSelecionado) {
      setProfissionalSelecionado(profissionais[0].id);
    }
  }, [profissionais, profissionalSelecionado]);

  const hoje = useMemo(() => {
    const h = new Date();
    h.setHours(0, 0, 0, 0);
    return h;
  }, []);

  const diasDoMes = useMemo(() => {
    const ano = mesAtual.getFullYear();
    const mes = mesAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasAntes = primeiroDia.getDay();
    const dias: (Date | null)[] = [];

    for (let i = 0; i < diasAntes; i++) {
      dias.push(null);
    }

    for (let d = 1; d <= ultimoDia.getDate(); d++) {
      dias.push(new Date(ano, mes, d));
    }

    return dias;
  }, [mesAtual]);

  const isDiaUtil = (date: Date): boolean => {
    const diaSemana = date.getDay();
    return diaSemana >= 1 && diaSemana <= 5;
  };

  const isDiaPassado = (date: Date): boolean => {
    return date < hoje;
  };

  const isDiaDisponivel = (date: Date): boolean => {
    return isDiaUtil(date) && !isDiaPassado(date);
  };

  const mesAnterior = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1, 1));
    setDiaSelecionado(null);
    setHorarioSelecionado(null);
    setMostrarFormulario(false);
  };

  const proximoMes = () => {
    setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 1));
    setDiaSelecionado(null);
    setHorarioSelecionado(null);
    setMostrarFormulario(false);
  };

  const selecionarDia = (dia: Date) => {
    if (isDiaDisponivel(dia)) {
      setDiaSelecionado(dia);
      setHorarioSelecionado(null);
      setMostrarFormulario(false);
      setMensagem(null);
    }
  };

  const selecionarHorario = (horario: string) => {
    setHorarioSelecionado(horario);
    setMostrarFormulario(true);
    setMensagem(null);
  };

  const confirmarAgendamento = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!diaSelecionado || !horarioSelecionado || !nome.trim() || !telefone.trim() || !profissionalSelecionado) {
      setMensagem({ tipo: 'erro', texto: 'Preencha todos os campos.' });
      return;
    }

    setEnviando(true);
    const dataStr = formatarData(diaSelecionado);
    const sucesso = await adicionarAgendamento(dataStr, {
      horario: horarioSelecionado,
      nome: nome.trim(),
      telefone: telefone.trim(),
      profissional_id: profissionalSelecionado
    });

    setEnviando(false);

    if (sucesso) {
      setMensagem({ tipo: 'sucesso', texto: 'Agendamento confirmado! Aguardamos você.' });
      setNome('');
      setTelefone('');
      setHorarioSelecionado(null);
      setMostrarFormulario(false);
    } else {
      setMensagem({ tipo: 'erro', texto: 'Horário já reservado. Escolha outro.' });
    }
  };

  const horariosOcupados = diaSelecionado && profissionalSelecionado 
    ? getHorariosOcupados(formatarData(diaSelecionado), profissionalSelecionado) 
    : [];

  const profissionalNome = profissionais.find(p => p.id === profissionalSelecionado)?.nome || '';

  return (
    <section id="agendar" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 border border-border rounded-full">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Agendamento Online</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-card-foreground mb-4">
            Agende seu <span className="text-primary">horário</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Escolha o dia e horário que melhor se encaixa na sua rotina.
            Atendemos de segunda a sexta, das 08:00 às 18:00.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Calendário */}
          <div className="bg-secondary rounded-2xl p-6 border border-border">
            {/* Seleção de Profissional */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <User className="w-4 h-4" />
                Profissional
              </label>
              <select
                value={profissionalSelecionado}
                onChange={(e) => {
                  setProfissionalSelecionado(e.target.value);
                  setHorarioSelecionado(null);
                  setMostrarFormulario(false);
                }}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {profissionais.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.nome}</option>
                ))}
              </select>
            </div>

            {/* Navegação do mês */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={mesAnterior}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-card-foreground"
                aria-label="Mês anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold text-card-foreground">
                {MESES[mesAtual.getMonth()]} {mesAtual.getFullYear()}
              </h3>
              <button
                onClick={proximoMes}
                className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-card-foreground"
                aria-label="Próximo mês"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DIAS_SEMANA.map((dia) => (
                <div
                  key={dia}
                  className="text-center text-xs font-medium text-muted-foreground py-2"
                >
                  {dia}
                </div>
              ))}
            </div>

            {/* Dias */}
            <div className="grid grid-cols-7 gap-1">
              {diasDoMes.map((dia, index) => {
                if (!dia) {
                  return <div key={`empty-${index}`} className="p-2" />;
                }

                const disponivel = isDiaDisponivel(dia);
                const selecionado = diaSelecionado?.toDateString() === dia.toDateString();
                const ehHoje = dia.toDateString() === hoje.toDateString();

                return (
                  <button
                    key={dia.toISOString()}
                    onClick={() => selecionarDia(dia)}
                    disabled={!disponivel}
                    className={`
                      p-2 text-sm rounded-lg transition-all duration-200
                      ${disponivel 
                        ? 'hover:bg-primary/20 cursor-pointer' 
                        : 'opacity-30 cursor-not-allowed'}
                      ${selecionado 
                        ? 'bg-primary text-primary-foreground font-semibold' 
                        : 'text-card-foreground'}
                      ${ehHoje && !selecionado 
                        ? 'ring-1 ring-primary' 
                        : ''}
                    `}
                  >
                    {dia.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-4 mt-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded" />
                <span>Selecionado</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 border border-primary rounded" />
                <span>Hoje</span>
              </div>
            </div>
          </div>

          {/* Horários e Formulário */}
          <div className="bg-secondary rounded-2xl p-6 border border-border">
            {!diaSelecionado ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                <Clock className="w-12 h-12 mb-4 opacity-50" />
                <p>Selecione um dia disponível</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Horários para {diaSelecionado.getDate()} de {MESES[diaSelecionado.getMonth()]}
                </h3>
                <p className="text-sm text-primary mb-4">Profissional: {profissionalNome}</p>

                {/* Grid de horários */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {HORARIOS.map((horario) => {
                    const ocupado = horariosOcupados.includes(horario);
                    const selecionado = horarioSelecionado === horario;

                    return (
                      <button
                        key={horario}
                        onClick={() => !ocupado && selecionarHorario(horario)}
                        disabled={ocupado}
                        className={`
                          py-3 px-2 text-sm rounded-lg transition-all duration-200
                          ${ocupado 
                            ? 'bg-muted text-muted-foreground line-through cursor-not-allowed' 
                            : selecionado
                              ? 'bg-primary text-primary-foreground font-semibold'
                              : 'bg-background text-card-foreground hover:bg-primary/20'}
                        `}
                      >
                        {horario}
                      </button>
                    );
                  })}
                </div>

                {/* Formulário */}
                {mostrarFormulario && (
                  <form onSubmit={confirmarAgendamento} className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        maxLength={100}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-1">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        required
                        maxLength={20}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={enviando}
                      className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                      {enviando ? 'Agendando...' : 'Confirmar Agendamento'}
                    </button>
                  </form>
                )}

                {/* Mensagem */}
                {mensagem && (
                  <div
                    className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                      mensagem.tipo === 'sucesso'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {mensagem.tipo === 'sucesso' ? (
                      <Check className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span>{mensagem.texto}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
