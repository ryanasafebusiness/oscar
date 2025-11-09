-- Script SQL para configurar o Supabase Storage para upload de imagens
-- Execute este script no SQL Editor do Supabase Dashboard

-- Criar o bucket para imagens de participantes (se não existir)
-- NOTA: Se o bucket já existir, você pode criá-lo manualmente no Dashboard:
-- Storage > New Bucket > ID: participant-images > Public: true

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'participant-images',
  'participant-images',
  true,
  5242880, -- 5MB em bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg'];

-- Remover políticas existentes (se houver) para evitar conflitos
DROP POLICY IF EXISTS "Anyone can upload participant images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view participant images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update participant images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete participant images" ON storage.objects;

-- Política para permitir upload de imagens (qualquer pessoa pode fazer upload)
CREATE POLICY "Anyone can upload participant images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'participant-images'
);

-- Política para permitir leitura pública de imagens
CREATE POLICY "Public can view participant images"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'participant-images'
);

-- Política para permitir atualização de imagens
CREATE POLICY "Anyone can update participant images"
ON storage.objects
FOR UPDATE
TO public
USING (
  bucket_id = 'participant-images'
)
WITH CHECK (
  bucket_id = 'participant-images'
);

-- Política para permitir exclusão de imagens
CREATE POLICY "Anyone can delete participant images"
ON storage.objects
FOR DELETE
TO public
USING (
  bucket_id = 'participant-images'
);

