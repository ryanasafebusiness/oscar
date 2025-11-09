import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [isReady, setIsReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      // Verifica se o cliente Supabase foi criado
      if (!supabase) {
        setError('Supabase não está configurado. Verifique as variáveis de ambiente.');
        setIsConnecting(false);
        setIsReady(false);
        return;
      }

      // Verifica se as variáveis de ambiente estão definidas
      const url = import.meta.env.VITE_SUPABASE_URL;
      const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      if (!url || !key) {
        setError('Variáveis de ambiente não configuradas. Verifique VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.');
        setIsConnecting(false);
        setIsReady(false);
        return;
      }

      try {
        setIsConnecting(true);
        setError(null);
        
        // Testa a conexão fazendo uma query simples na tabela categories
        // Se a tabela não existir, isso é OK - significa que as migrações ainda não foram executadas
        const { error: testError } = await supabase
          .from('categories')
          .select('id')
          .limit(1);

        // Considera a conexão OK se:
        // 1. Não houver erro
        // 2. O erro for de tabela não encontrada (PGRST116) - significa que a conexão funciona mas as migrações não foram executadas
        // 3. O erro for de permissão - significa que a conexão funciona mas as políticas RLS não foram configuradas
        if (!testError || 
            testError.code === 'PGRST116' || 
            testError.message?.includes('relation') || 
            testError.message?.includes('does not exist') ||
            testError.message?.includes('permission denied') ||
            testError.code === '42501') {
          // Conexão funciona, mesmo que as tabelas/políticas não estejam configuradas
          setIsReady(true);
          setIsConnecting(false);
          setError(null);
        } else if (testError.message?.includes('Invalid API key') || testError.message?.includes('JWT')) {
          // Erro de autenticação - credenciais inválidas
          setError('Credenciais do Supabase inválidas. Verifique VITE_SUPABASE_PUBLISHABLE_KEY.');
          setIsReady(false);
          setIsConnecting(false);
        } else if (testError.message?.includes('Failed to fetch') || testError.message?.includes('Network')) {
          // Erro de rede
          setError('Erro de rede ao conectar ao Supabase. Verifique sua conexão com a internet.');
          setIsReady(false);
          setIsConnecting(false);
        } else {
          // Outros erros - considera que a conexão funciona
          setIsReady(true);
          setIsConnecting(false);
          setError(null);
        }
      } catch (err: any) {
        console.error('Erro ao verificar conexão:', err);
        // Se for erro de rede, mostra mensagem específica
        if (err?.message?.includes('Failed to fetch') || err?.message?.includes('Network')) {
          setError('Erro de rede ao conectar ao Supabase. Verifique sua conexão com a internet e a URL do Supabase.');
        } else {
          setError(err?.message || 'Erro ao conectar ao backend. Verifique as configurações do Supabase.');
        }
        setIsReady(false);
        setIsConnecting(false);
      }
    };

    checkConnection();
  }, []);

  return { isReady, isConnecting, error };
};
