-- Migration para corrigir políticas RLS da tabela votes
-- Esta migration garante que as políticas RLS estejam configuradas corretamente

-- Garantir que RLS está habilitado
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes que possam causar conflitos
DROP POLICY IF EXISTS "Anyone can insert votes" ON public.votes;
DROP POLICY IF EXISTS "Public can insert votes" ON public.votes;
DROP POLICY IF EXISTS "Public can update votes" ON public.votes;
DROP POLICY IF EXISTS "Public can delete votes" ON public.votes;
DROP POLICY IF EXISTS "Public can view votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can update votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can delete votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;

-- Criar política para permitir INSERT de votos (qualquer pessoa pode votar)
CREATE POLICY "Public can insert votes"
ON public.votes
FOR INSERT
TO public
WITH CHECK (true);

-- Criar política para permitir UPDATE de votos (para atualizar votos existentes)
CREATE POLICY "Public can update votes"
ON public.votes
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Criar política para permitir DELETE de votos (para substituir votos)
CREATE POLICY "Public can delete votes"
ON public.votes
FOR DELETE
TO public
USING (true);

-- Criar política para permitir SELECT de votos (para exibir resultados)
CREATE POLICY "Public can view votes"
ON public.votes
FOR SELECT
TO public
USING (true);

