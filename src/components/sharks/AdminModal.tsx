import { useState, useEffect, useMemo } from 'react';
import { Settings, X, Trash2, AlertTriangle, LogOut, Pencil, Check, Filter, ArrowUpDown, User } from 'lucide-react';
import { useAgendamentos, AgendamentoCompleto } from '@/hooks/useAgendamentos';

const SENHA_ADMIN = "1234";
const SESSION_KEY = 'sharks_admin_session';

type OrdenacaoColuna = 'data' | 'horario' | 'nome_cliente' | 'telefone' | 'profissional_nome';
type OrdenacaoDirecao = 'asc' | 'desc';

export const AdminModal = () => {
  const [aberto, setAberto] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [filtroData, setFiltroData] = useState('');
  const [filtroProfissional, setFiltroProfissional] = useState('');
  const [ordenacao, setOrdenacao] = useState<{ coluna: OrdenacaoColuna; direcao: OrdenacaoDirecao }>({
    coluna: 'data',
    direcao: 'asc'
  });
  const [editando, setEditando] = useState<string | null>(null);
  const [dadosEdicao, setDadosEdicao] = useState<{ nome_cliente: string; telefone: string }>({ nome_cliente: '', telefone: '' });
  const [confirmarExclusao, setConfirmarExclusao] = useState<string | null>(null);
  const [confirmarLimparDia, setConfirmarLimparDia] = useState(false);
  const [confirmarLimparTudo, setConfirmarLimparTudo] = useState(false);
  const [cliquesFooter, setCliquesFooter] = useState(0);

  const { 
    getTodosAgendamentos, 
    removerAgendamento, 
    editarAgendamento,
    limparDia,
    limparTudo,
    profissionais,
    loading,
    carregarAgendamentos
  } = useAgendamentos();

  // Verificar sessão ao montar
  useEffect(() => {
    const sessao = sessionStorage.getItem(SESSION_KEY);
    if (sessao === 'true') {
      setAutenticado(true);
    }
  }, []);

  // Verificar hash da URL
  useEffect(() => {
    const verificarHash = () => {
      if (window.location.hash === '#admin') {
        setAberto(true);
      }
    };
    
    verificarHash();
    window.addEventListener('hashchange', verificarHash);
    return () => window.removeEventListener('hashchange', verificarHash);
  }, []);

  // Recarregar dados quando o modal abrir
  useEffect(() => {
    if (aberto && autenticado) {
      carregarAgendamentos();
    }
  }, [aberto, autenticado]);

  // Handler para cliques secretos no footer
  useEffect(() => {
    if (cliquesFooter >= 5) {
      setAberto(true);
      setCliquesFooter(0);
    }
  }, [cliquesFooter]);

  const handleFooterClick = () => {
    setCliquesFooter(prev => prev + 1);
    setTimeout(() => setCliquesFooter(0), 2000);
  };

  const handleLogin = () => {
    const senha = prompt("Digite a senha do admin:");
    if (senha === SENHA_ADMIN) {
      setAutenticado(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
    } else if (senha !== null) {
      alert("Senha incorreta");
    }
  };

  const handleLogout = () => {
    setAutenticado(false);
    sessionStorage.removeItem(SESSION_KEY);
    setAberto(false);
    window.location.hash = '';
  };

  const abrirAdminComSenha = () => {
    if (autenticado) {
      setAberto(true);
    } else {
      const senha = prompt("Digite a senha do admin:");
      if (senha === SENHA_ADMIN) {
        setAutenticado(true);
        sessionStorage.setItem(SESSION_KEY, 'true');
        setAberto(true);
      } else if (senha !== null) {
        alert("Senha incorreta");
      }
    }
  };

  const fecharModal = () => {
    setAberto(false);
    setConfirmarExclusao(null);
    setConfirmarLimparDia(false);
    setConfirmarLimparTudo(false);
    setEditando(null);
    window.location.hash = '';
  };

  // Ordenação e filtro
  const agendamentosFiltrados = useMemo(() => {
    let lista = getTodosAgendamentos();

    // Filtrar por data
    if (filtroData) {
      lista = lista.filter(ag => ag.data === filtroData);
    }

    // Filtrar por profissional
    if (filtroProfissional) {
      lista = lista.filter(ag => ag.profissional_id === filtroProfissional);
    }

    // Ordenar
    lista.sort((a, b) => {
      let valorA: string, valorB: string;
      
      switch (ordenacao.coluna) {
        case 'data':
          valorA = a.data;
          valorB = b.data;
          break;
        case 'horario':
          valorA = a.horario;
          valorB = b.horario;
          break;
        case 'nome_cliente':
          valorA = a.nome_cliente.toLowerCase();
          valorB = b.nome_cliente.toLowerCase();
          break;
        case 'telefone':
          valorA = a.telefone;
          valorB = b.telefone;
          break;
        case 'profissional_nome':
          valorA = (a.profissional_nome || '').toLowerCase();
          valorB = (b.profissional_nome || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (ordenacao.direcao === 'asc') {
        return valorA.localeCompare(valorB);
      } else {
        return valorB.localeCompare(valorA);
      }
    });

    return lista;
  }, [getTodosAgendamentos, filtroData, filtroProfissional, ordenacao]);

  const handleOrdenar = (coluna: OrdenacaoColuna) => {
    setOrdenacao(prev => ({
      coluna,
      direcao: prev.coluna === coluna && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const iniciarEdicao = (ag: AgendamentoCompleto) => {
    setEditando(ag.id);
    setDadosEdicao({ nome_cliente: ag.nome_cliente, telefone: ag.telefone });
  };

  const salvarEdicao = async (id: string) => {
    await editarAgendamento(id, dadosEdicao);
    setEditando(null);
  };

  const handleExcluir = async (id: string) => {
    await removerAgendamento(id);
    setConfirmarExclusao(null);
  };

  const handleLimparDia = async () => {
    if (filtroData) {
      await limparDia(filtroData);
      setConfirmarLimparDia(false);
      setFiltroData('');
    }
  };

  const handleLimparTudo = async () => {
    await limparTudo();
    setConfirmarLimparTudo(false);
  };

  const formatarData = (dataStr: string) => {
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  // Obter datas únicas para o filtro
  const datasDisponiveis = useMemo(() => {
    const datas = new Set(getTodosAgendamentos().map(ag => ag.data));
    return Array.from(datas).sort();
  }, [getTodosAgendamentos]);

  return (
    <>
      {/* Botão discreto (engrenagem) */}
      <button
        onClick={abrirAdminComSenha}
        className="fixed bottom-4 right-4 p-3 bg-secondary border border-border rounded-full text-muted-foreground hover:text-primary hover:border-primary transition-colors shadow-lg z-40"
        aria-label="Painel Admin"
        title="Admin Local"
      >
        <Settings className="w-5 h-5" />
      </button>

      {/* Área clicável secreta no footer */}
      <div
        onClick={handleFooterClick}
        className="fixed bottom-4 left-4 w-8 h-8 cursor-default z-30"
        aria-hidden="true"
      />

      {/* Modal */}
      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            onClick={fecharModal}
          />

          {/* Conteúdo */}
          <div className="relative bg-card border border-border rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
              <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Painel Administrativo
              </h2>
              <div className="flex items-center gap-2">
                {autenticado && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                )}
                <button
                  onClick={fecharModal}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-card-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            {!autenticado ? (
              <div className="p-12 text-center">
                <AlertTriangle className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-card-foreground mb-2">Acesso Restrito</h3>
                <p className="text-muted-foreground mb-6">Este painel é exclusivo para administradores.</p>
                <button
                  onClick={handleLogin}
                  className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Fazer Login
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-4 max-h-[calc(90vh-80px)] overflow-auto">
                {/* Filtros e Ações */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Filtro por data */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-muted-foreground" />
                      <select
                        value={filtroData}
                        onChange={(e) => setFiltroData(e.target.value)}
                        className="px-3 py-2 bg-secondary border border-border rounded-lg text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todas as datas</option>
                        {datasDisponiveis.map(data => (
                          <option key={data} value={data}>{formatarData(data)}</option>
                        ))}
                      </select>
                    </div>

                    {/* Filtro por profissional */}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <select
                        value={filtroProfissional}
                        onChange={(e) => setFiltroProfissional(e.target.value)}
                        className="px-3 py-2 bg-secondary border border-border rounded-lg text-card-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Todos os profissionais</option>
                        {profissionais.map(prof => (
                          <option key={prof.id} value={prof.id}>{prof.nome}</option>
                        ))}
                      </select>
                    </div>
                    
                    {filtroData && (
                      <button
                        onClick={() => setConfirmarLimparDia(true)}
                        className="px-3 py-2 text-sm text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
                      >
                        Limpar dia
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setConfirmarLimparTudo(true)}
                    className="px-3 py-2 text-sm text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpar tudo
                  </button>
                </div>

                {/* Tabela Planilha */}
                {loading ? (
                  <div className="text-center py-16 bg-secondary/30 rounded-xl">
                    <p className="text-muted-foreground">Carregando...</p>
                  </div>
                ) : agendamentosFiltrados.length === 0 ? (
                  <div className="text-center py-16 bg-secondary/30 rounded-xl">
                    <p className="text-muted-foreground">Nenhum agendamento encontrado.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="bg-secondary/80">
                          <th className="text-left p-3">
                            <button
                              onClick={() => handleOrdenar('data')}
                              className="flex items-center gap-1 text-sm font-semibold text-card-foreground hover:text-primary transition-colors"
                            >
                              Data
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                          <th className="text-left p-3">
                            <button
                              onClick={() => handleOrdenar('horario')}
                              className="flex items-center gap-1 text-sm font-semibold text-card-foreground hover:text-primary transition-colors"
                            >
                              Horário
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                          <th className="text-left p-3">
                            <button
                              onClick={() => handleOrdenar('profissional_nome')}
                              className="flex items-center gap-1 text-sm font-semibold text-card-foreground hover:text-primary transition-colors"
                            >
                              Profissional
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                          <th className="text-left p-3">
                            <button
                              onClick={() => handleOrdenar('nome_cliente')}
                              className="flex items-center gap-1 text-sm font-semibold text-card-foreground hover:text-primary transition-colors"
                            >
                              Cliente
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                          <th className="text-left p-3">
                            <button
                              onClick={() => handleOrdenar('telefone')}
                              className="flex items-center gap-1 text-sm font-semibold text-card-foreground hover:text-primary transition-colors"
                            >
                              Telefone
                              <ArrowUpDown className="w-3 h-3" />
                            </button>
                          </th>
                          <th className="text-center p-3 text-sm font-semibold text-card-foreground">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {agendamentosFiltrados.map((ag, index) => {
                          const estaEditando = editando === ag.id;
                          
                          return (
                            <tr 
                              key={ag.id}
                              className={`border-t border-border ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/30'} hover:bg-primary/5 transition-colors`}
                            >
                              <td className="p-3 text-sm text-card-foreground font-medium">
                                {formatarData(ag.data)}
                              </td>
                              <td className="p-3 text-sm text-primary font-semibold">
                                {ag.horario}
                              </td>
                              <td className="p-3 text-sm text-card-foreground">
                                {ag.profissional_nome}
                              </td>
                              <td className="p-3">
                                {estaEditando ? (
                                  <input
                                    type="text"
                                    value={dadosEdicao.nome_cliente}
                                    onChange={(e) => setDadosEdicao(prev => ({ ...prev, nome_cliente: e.target.value }))}
                                    className="w-full px-2 py-1 bg-secondary border border-primary rounded text-sm text-card-foreground focus:outline-none"
                                  />
                                ) : (
                                  <span className="text-sm text-card-foreground">{ag.nome_cliente}</span>
                                )}
                              </td>
                              <td className="p-3">
                                {estaEditando ? (
                                  <input
                                    type="text"
                                    value={dadosEdicao.telefone}
                                    onChange={(e) => setDadosEdicao(prev => ({ ...prev, telefone: e.target.value }))}
                                    className="w-full px-2 py-1 bg-secondary border border-primary rounded text-sm text-card-foreground focus:outline-none"
                                  />
                                ) : (
                                  <span className="text-sm text-muted-foreground">{ag.telefone}</span>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center justify-center gap-2">
                                  {estaEditando ? (
                                    <button
                                      onClick={() => salvarEdicao(ag.id)}
                                      className="p-2 text-green-500 hover:bg-green-500/20 rounded transition-colors"
                                      title="Salvar"
                                    >
                                      <Check className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => iniciarEdicao(ag)}
                                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                      title="Editar"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                  )}
                                  
                                  {confirmarExclusao === ag.id ? (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handleExcluir(ag.id)}
                                        className="px-2 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
                                      >
                                        Sim
                                      </button>
                                      <button
                                        onClick={() => setConfirmarExclusao(null)}
                                        className="px-2 py-1 text-xs bg-secondary text-card-foreground rounded hover:bg-muted transition-colors"
                                      >
                                        Não
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setConfirmarExclusao(ag.id)}
                                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                      title="Excluir"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Modal Confirmar Limpar Dia */}
                {confirmarLimparDia && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80" onClick={() => setConfirmarLimparDia(false)} />
                    <div className="relative bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-xl">
                      <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-card-foreground text-center mb-2">
                        Limpar todos os agendamentos de {formatarData(filtroData)}?
                      </h3>
                      <p className="text-muted-foreground text-center text-sm mb-6">
                        Esta ação não pode ser desfeita.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setConfirmarLimparDia(false)}
                          className="flex-1 py-2 bg-secondary text-card-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleLimparDia}
                          className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Confirmar Limpar Tudo */}
                {confirmarLimparTudo && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background/80" onClick={() => setConfirmarLimparTudo(false)} />
                    <div className="relative bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-xl">
                      <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-card-foreground text-center mb-2">
                        Limpar TODOS os agendamentos?
                      </h3>
                      <p className="text-muted-foreground text-center text-sm mb-6">
                        Esta ação não pode ser desfeita.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setConfirmarLimparTudo(false)}
                          className="flex-1 py-2 bg-secondary text-card-foreground rounded-lg hover:bg-muted transition-colors"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleLimparTudo}
                          className="flex-1 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                        >
                          Confirmar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
