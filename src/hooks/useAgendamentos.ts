import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sharks_agendamentos';

export interface Agendamento {
  horario: string;
  nome: string;
  telefone: string;
}

export interface AgendamentoCompleto extends Agendamento {
  data: string;
}

export interface AgendamentosPorData {
  [data: string]: Agendamento[];
}

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<AgendamentosPorData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const salvarAgendamentos = useCallback((novosAgendamentos: AgendamentosPorData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosAgendamentos));
    setAgendamentos(novosAgendamentos);
  }, []);

  const adicionarAgendamento = useCallback((data: string, agendamento: Agendamento): boolean => {
    const agendamentosData = agendamentos[data] || [];
    const jaReservado = agendamentosData.some(a => a.horario === agendamento.horario);
    
    if (jaReservado) {
      return false;
    }

    const novosAgendamentos = {
      ...agendamentos,
      [data]: [...agendamentosData, agendamento]
    };
    salvarAgendamentos(novosAgendamentos);
    return true;
  }, [agendamentos, salvarAgendamentos]);

  const removerAgendamento = useCallback((data: string, horario: string) => {
    const agendamentosData = agendamentos[data] || [];
    const novosAgendamentos = {
      ...agendamentos,
      [data]: agendamentosData.filter(a => a.horario !== horario)
    };
    salvarAgendamentos(novosAgendamentos);
  }, [agendamentos, salvarAgendamentos]);

  const editarAgendamento = useCallback((data: string, horarioOriginal: string, novosDados: Partial<Agendamento>) => {
    const agendamentosData = agendamentos[data] || [];
    const novosAgendamentos = {
      ...agendamentos,
      [data]: agendamentosData.map(a => 
        a.horario === horarioOriginal 
          ? { ...a, ...novosDados }
          : a
      )
    };
    salvarAgendamentos(novosAgendamentos);
  }, [agendamentos, salvarAgendamentos]);

  const getAgendamentosDia = useCallback((data: string): Agendamento[] => {
    return agendamentos[data] || [];
  }, [agendamentos]);

  const getTodosAgendamentos = useCallback((): AgendamentoCompleto[] => {
    const todos: AgendamentoCompleto[] = [];
    Object.entries(agendamentos).forEach(([data, lista]) => {
      lista.forEach(ag => {
        todos.push({ ...ag, data });
      });
    });
    return todos;
  }, [agendamentos]);

  const getHorariosOcupados = useCallback((data: string): string[] => {
    return (agendamentos[data] || []).map(a => a.horario);
  }, [agendamentos]);

  const limparDia = useCallback((data: string) => {
    const novosAgendamentos = { ...agendamentos };
    delete novosAgendamentos[data];
    salvarAgendamentos(novosAgendamentos);
  }, [agendamentos, salvarAgendamentos]);

  const limparTudo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAgendamentos({});
  }, []);

  return {
    agendamentos,
    adicionarAgendamento,
    removerAgendamento,
    editarAgendamento,
    getAgendamentosDia,
    getTodosAgendamentos,
    getHorariosOcupados,
    limparDia,
    limparTudo
  };
};
