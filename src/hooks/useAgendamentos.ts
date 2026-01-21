import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Profissional {
  id: string;
  nome: string;
  ativo: boolean;
}

export interface Agendamento {
  id: string;
  horario: string;
  nome_cliente: string;
  telefone: string;
  profissional_id: string;
  profissional_nome?: string;
}

export interface AgendamentoCompleto extends Agendamento {
  data: string;
}

export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<AgendamentoCompleto[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar profissionais
  const carregarProfissionais = useCallback(async () => {
    const { data, error } = await supabase
      .from('profissionais')
      .select('*')
      .eq('ativo', true)
      .order('nome');

    if (!error && data) {
      setProfissionais(data);
    }
    return data || [];
  }, []);

  // Carregar todos os agendamentos
  const carregarAgendamentos = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`
        id,
        data,
        horario,
        nome_cliente,
        telefone,
        profissional_id,
        profissionais (nome)
      `)
      .order('data', { ascending: true })
      .order('horario', { ascending: true });

    if (!error && data) {
      const formatados = data.map(ag => ({
        id: ag.id,
        data: ag.data,
        horario: ag.horario,
        nome_cliente: ag.nome_cliente,
        telefone: ag.telefone,
        profissional_id: ag.profissional_id,
        profissional_nome: (ag.profissionais as { nome: string } | null)?.nome || ''
      }));
      setAgendamentos(formatados);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    carregarProfissionais();
    carregarAgendamentos();
  }, [carregarProfissionais, carregarAgendamentos]);

  const adicionarAgendamento = useCallback(async (
    data: string,
    agendamento: { horario: string; nome: string; telefone: string; profissional_id: string }
  ): Promise<boolean> => {
    const { error } = await supabase
      .from('agendamentos')
      .insert({
        data,
        horario: agendamento.horario,
        nome_cliente: agendamento.nome,
        telefone: agendamento.telefone,
        profissional_id: agendamento.profissional_id
      });

    if (error) {
      console.error('Erro ao agendar:', error);
      return false;
    }

    await carregarAgendamentos();
    return true;
  }, [carregarAgendamentos]);

  const removerAgendamento = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id);

    if (!error) {
      await carregarAgendamentos();
    }
  }, [carregarAgendamentos]);

  const editarAgendamento = useCallback(async (
    id: string,
    novosDados: { nome_cliente?: string; telefone?: string }
  ) => {
    const { error } = await supabase
      .from('agendamentos')
      .update(novosDados)
      .eq('id', id);

    if (!error) {
      await carregarAgendamentos();
    }
  }, [carregarAgendamentos]);

  const getTodosAgendamentos = useCallback((): AgendamentoCompleto[] => {
    return agendamentos;
  }, [agendamentos]);

  const getHorariosOcupados = useCallback((data: string, profissionalId: string): string[] => {
    return agendamentos
      .filter(ag => ag.data === data && ag.profissional_id === profissionalId)
      .map(ag => ag.horario);
  }, [agendamentos]);

  const limparDia = useCallback(async (data: string) => {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('data', data);

    if (!error) {
      await carregarAgendamentos();
    }
  }, [carregarAgendamentos]);

  const limparTudo = useCallback(async () => {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta tudo

    if (!error) {
      await carregarAgendamentos();
    }
  }, [carregarAgendamentos]);

  return {
    agendamentos,
    profissionais,
    loading,
    adicionarAgendamento,
    removerAgendamento,
    editarAgendamento,
    getTodosAgendamentos,
    getHorariosOcupados,
    limparDia,
    limparTudo,
    carregarAgendamentos
  };
};
