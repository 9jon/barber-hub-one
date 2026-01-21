-- Tabela de profissionais
CREATE TABLE public.profissionais (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir profissionais padrão
INSERT INTO public.profissionais (nome) VALUES 
    ('Carlos'),
    ('André'),
    ('Felipe');

-- Habilitar RLS
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública dos profissionais
CREATE POLICY "Qualquer pessoa pode ver profissionais" 
ON public.profissionais 
FOR SELECT 
USING (true);

-- Tabela de agendamentos
CREATE TABLE public.agendamentos (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    data DATE NOT NULL,
    horario TEXT NOT NULL,
    nome_cliente TEXT NOT NULL,
    telefone TEXT NOT NULL,
    profissional_id UUID REFERENCES public.profissionais(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(data, horario, profissional_id)
);

-- Habilitar RLS
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (para verificar horários ocupados)
CREATE POLICY "Qualquer pessoa pode ver agendamentos" 
ON public.agendamentos 
FOR SELECT 
USING (true);

-- Permitir inserção pública (clientes podem agendar)
CREATE POLICY "Qualquer pessoa pode criar agendamentos" 
ON public.agendamentos 
FOR INSERT 
WITH CHECK (true);

-- Permitir atualização pública (admin pode editar)
CREATE POLICY "Qualquer pessoa pode atualizar agendamentos" 
ON public.agendamentos 
FOR UPDATE 
USING (true);

-- Permitir deleção pública (admin pode deletar)
CREATE POLICY "Qualquer pessoa pode deletar agendamentos" 
ON public.agendamentos 
FOR DELETE 
USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_agendamentos_updated_at
BEFORE UPDATE ON public.agendamentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();