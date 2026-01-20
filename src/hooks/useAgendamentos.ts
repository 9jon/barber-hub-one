import { useState, useCallback } from 'react';

const STORAGE_KEY = 'sharks_agendamentos';

export interface Agendamento {
  horario: string;
  nome: string;
  telefone: string;
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

  const getAgendamentosDia = useCallback((data: string): Agendamento[] => {
    return agendamentos[data] || [];
  }, [agendamentos]);

  const getHorariosOcupados = useCallback((data: string): string[] => {
    return (agendamentos[data] || []).map(a => a.horario);
  }, [agendamentos]);

  const limparTudo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAgendamentos({});
  }, []);

  return {
    agendamentos,
    adicionarAgendamento,
    removerAgendamento,
    getAgendamentosDia,
    getHorariosOcupados,
    limparTudo
  };
};
