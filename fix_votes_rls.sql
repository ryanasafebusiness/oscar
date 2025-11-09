-- Script SQL para corrigir políticas RLS da tabela votes
-- Execute este script no SQL Editor do Supabase Dashboard

-- Remover políticas existentes se houver (para evitar conflitos)
DROP POLICY IF EXISTS "Anyone can insert votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can update votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can delete votes" ON public.votes;

-- Criar política para permitir INSERT de votos (qualquer pessoa pode votar)
CREATE POLICY "Anyone can insert votes"
ON public.votes
FOR INSERT
TO public
WITH CHECK (true);

-- Criar política para permitir UPDATE de votos (para atualizar votos existentes)
CREATE POLICY "Anyone can update votes"
ON public.votes
FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Criar política para permitir DELETE de votos (para substituir votos)
CREATE POLICY "Anyone can delete votes"
ON public.votes
FOR DELETE
TO public
USING (true);

-- Verificar se as políticas foram criadas corretamente
-- Você pode executar: SELECT * FROM pg_policies WHERE tablename = 'votes';

