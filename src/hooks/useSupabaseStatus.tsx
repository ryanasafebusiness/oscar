import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseStatus = () => {
  const [isReady, setIsReady] = useState(!!supabase);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isReady) return;

    const checkStatus = () => {
      const ready = !!supabase;
      setIsReady(ready);
      
      if (!ready && attempts < 10) {
        setAttempts(prev => prev + 1);
        setTimeout(checkStatus, 2000); // Tenta novamente após 2 segundos
      }
    };

    checkStatus();
  }, [isReady, attempts]);

  return { isReady, isConnecting: !isReady && attempts < 10 };
};
