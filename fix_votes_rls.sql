-- =====================================================
-- Script SQL para corrigir políticas RLS da tabela votes
-- Execute este script no SQL Editor do Supabase Dashboard
-- =====================================================
-- IMPORTANTE: Execute este script ANTES de tentar votar
-- =====================================================

-- Passo 1: Garantir que RLS está habilitado
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Passo 2: Remover políticas existentes (executar cada linha separadamente se houver erro)
DROP POLICY IF EXISTS "Anyone can insert votes" ON public.votes;
DROP POLICY IF EXISTS "Public can insert votes" ON public.votes;
DROP POLICY IF EXISTS "Public can update votes" ON public.votes;
DROP POLICY IF EXISTS "Public can delete votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can update votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can delete votes" ON public.votes;

-- Passo 3: Criar política para permitir INSERT de votos
-- Esta política permite que qualquer pessoa possa inserir votos
CREATE POLICY "Public can insert votes"
ON public.votes
FOR INSERT
TO public
WITH CHECK (true);

-- Passo 4: Criar política para permitir UPDATE de votos
-- Esta política permite atualizar votos existentes (para mudar o voto)
CREATE POLICY "Public can update votes"
ON public.votes
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Passo 5: Criar política para permitir DELETE de votos
-- Esta política permite deletar votos (para substituir votos)
CREATE POLICY "Public can delete votes"
ON public.votes
FOR DELETE
TO public
USING (true);

-- =====================================================
-- VERIFICAÇÃO
-- =====================================================
-- Execute o comando abaixo para verificar se as políticas foram criadas:
-- SELECT policyname, cmd, qual FROM pg_policies WHERE tablename = 'votes';
-- 
-- Você deve ver 3 políticas:
-- 1. Public can insert votes (INSERT)
-- 2. Public can update votes (UPDATE)
-- 3. Public can delete votes (DELETE)
-- =====================================================

