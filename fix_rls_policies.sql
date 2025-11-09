-- Script SQL para corrigir políticas RLS e permitir operações de escrita
-- Execute este script no SQL Editor do Supabase Dashboard

-- Add RLS Policies for categories (allow insert, update, delete)
CREATE POLICY "Anyone can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update categories"
ON public.categories
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete categories"
ON public.categories
FOR DELETE
USING (true);

-- Add RLS Policies for participants (allow insert, update, delete)
CREATE POLICY "Anyone can insert participants"
ON public.participants
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update participants"
ON public.participants
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can delete participants"
ON public.participants
FOR DELETE
USING (true);

