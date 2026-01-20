import { useState } from 'react';
import { Settings, X, Trash2, AlertTriangle, Calendar } from 'lucide-react';
import { useAgendamentos, Agendamento } from '@/hooks/useAgendamentos';

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const AdminModal = () => {
  const [aberto, setAberto] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  });
  const [confirmarLimpeza, setConfirmarLimpeza] = useState(false);

  const { getAgendamentosDia, removerAgendamento, limparTudo } = useAgendamentos();

  const agendamentosDia = getAgendamentosDia(dataSelecionada);

  const handleLimparTudo = () => {
    if (confirmarLimpeza) {
      limparTudo();
      setConfirmarLimpeza(false);
    } else {
      setConfirmarLimpeza(true);
    }
  };

  const formatarData = (dataStr: string) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia} de ${MESES[parseInt(mes) - 1]} de ${ano}`;
  };

  return (
    <>
      {/* Botão discreto */}
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-4 right-4 p-3 bg-secondary border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors shadow-lg z-40"
        aria-label="Painel Admin"
        title="Admin Local"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Modal */}
      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => {
              setAberto(false);
              setConfirmarLimpeza(false);
            }}
          />

          {/* Conteúdo */}
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Admin Local
              </h2>
              <button
                onClick={() => {
                  setAberto(false);
                  setConfirmarLimpeza(false);
                }}
                className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-card-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Seletor de data */}
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Selecionar Data
                </label>
                <input
                  type="date"
                  value={dataSelecionada}
                  onChange={(e) => setDataSelecionada(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Agendamentos do dia */}
              <div>
                <h3 className="text-sm text-muted-foreground mb-3">
                  Agendamentos para {formatarData(dataSelecionada)}:
                </h3>

                {agendamentosDia.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8 bg-secondary rounded-lg">
                    Nenhum agendamento para esta data.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {agendamentosDia.map((ag: Agendamento) => (
                      <div
                        key={ag.horario}
                        className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
                      >
                        <div>
                          <div className="font-medium text-card-foreground">
                            {ag.horario} - {ag.nome}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {ag.telefone}
                          </div>
                        </div>
                        <button
                          onClick={() => removerAgendamento(dataSelecionada, ag.horario)}
                          className="p-2 text-destructive hover:bg-destructive/20 rounded-lg transition-colors"
                          title="Liberar horário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Limpar tudo */}
              <div className="pt-4 border-t border-border">
                {confirmarLimpeza ? (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                    <div className="flex items-center gap-2 text-destructive mb-3">
                      <AlertTriangle className="w-5 h-5" />
                      <span className="font-medium">Confirmar exclusão?</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Isso removerá TODOS os agendamentos salvos. Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleLimparTudo}
                        className="flex-1 py-2 bg-destructive text-destructive-foreground font-medium rounded-lg hover:bg-destructive/90 transition-colors"
                      >
                        Sim, limpar tudo
                      </button>
                      <button
                        onClick={() => setConfirmarLimpeza(false)}
                        className="flex-1 py-2 bg-secondary text-card-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleLimparTudo}
                    className="w-full py-3 bg-secondary text-destructive font-medium rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpar todos os agendamentos
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
