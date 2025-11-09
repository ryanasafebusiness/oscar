import { useSupabaseStatus } from '@/hooks/useSupabaseStatus';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, WifiOff } from 'lucide-react';

export const BackendStatusBanner = () => {
  const { isReady, isConnecting, error } = useSupabaseStatus();

  if (isReady) return null;

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-gold/10 border-gold/30">
      <div className="flex items-center gap-2">
        {isConnecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            <AlertDescription className="text-sm text-foreground">
              Conectando ao backend... aguarde alguns segundos.
            </AlertDescription>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-sm text-foreground">
              {error || 'Não foi possível conectar ao backend. Verifique as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.'}
            </AlertDescription>
          </>
        )}
      </div>
    </Alert>
  );
};
