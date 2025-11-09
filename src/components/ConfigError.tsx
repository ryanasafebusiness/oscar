import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Settings, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export const ConfigError = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const isVercel = window.location.hostname.includes('vercel.app');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-gold/30 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-gold" />
            <div>
              <CardTitle className="text-2xl text-foreground">
                Configuração Necessária
              </CardTitle>
              <CardDescription className="mt-1">
                As variáveis de ambiente do Supabase não estão configuradas
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-gold/10 border-gold/30">
            <AlertDescription>
              {isVercel 
                ? "Esta aplicação está rodando no Vercel. Você precisa configurar as variáveis de ambiente no dashboard do Vercel."
                : "Esta aplicação está rodando localmente. Crie um arquivo .env.local na raiz do projeto."
              }
            </AlertDescription>
          </Alert>

          {isVercel ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-gold" />
                Passo 1: Acesse o Vercel Dashboard
              </h3>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground ml-4">
                <li>Acesse <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">vercel.com/dashboard</a></li>
                <li>Encontre e abra o projeto <strong className="text-foreground">oscar</strong></li>
                <li>Vá em <strong className="text-foreground">Settings</strong> → <strong className="text-foreground">Environment Variables</strong></li>
              </ol>

              <h3 className="font-semibold text-foreground flex items-center gap-2 mt-6">
                <Settings className="w-5 h-5 text-gold" />
                Passo 2: Adicione as Variáveis de Ambiente
              </h3>
              
              <div className="space-y-3">
                <div className="border border-gold/30 rounded-lg p-4 bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold text-foreground">VITE_SUPABASE_URL</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard('https://wcstqvwgywldstplmrdg.supabase.co', 'url')}
                      className="h-6 px-2"
                    >
                      {copied === 'url' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <code className="text-xs text-muted-foreground break-all">
                    https://wcstqvwgywldstplmrdg.supabase.co
                  </code>
                </div>

                <div className="border border-gold/30 rounded-lg p-4 bg-secondary/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold text-foreground">VITE_SUPABASE_PUBLISHABLE_KEY</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard('sb_publishable_yBVS2s0O2DD4uO0IllOOlA_xKtLqUxe', 'key')}
                      className="h-6 px-2"
                    >
                      {copied === 'key' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <code className="text-xs text-muted-foreground break-all">
                    sb_publishable_yBVS2s0O2DD4uO0IllOOlA_xKtLqUxe
                  </code>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <strong>Importante:</strong> Selecione todos os ambientes (Production, Preview, Development) ao adicionar as variáveis.
                </p>
              </div>

              <h3 className="font-semibold text-foreground flex items-center gap-2 mt-6">
                <CheckCircle2 className="w-5 h-5 text-gold" />
                Passo 3: Faça um Redeploy
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Vá em <strong className="text-foreground">Deployments</strong></li>
                <li>Clique nos três pontos (...) do último deployment</li>
                <li>Selecione <strong className="text-foreground">Redeploy</strong></li>
                <li>Aguarde o deploy terminar e recarregue esta página</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Para desenvolvimento local:</h3>
              <div className="bg-secondary/50 border border-gold/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Crie um arquivo <code className="bg-background px-2 py-1 rounded">.env.local</code> na raiz do projeto com:
                </p>
                <pre className="text-xs bg-background p-3 rounded border border-gold/20 overflow-x-auto">
{`VITE_SUPABASE_URL=https://wcstqvwgywldstplmrdg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_yBVS2s0O2DD4uO0IllOOlA_xKtLqUxe`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Após criar o arquivo, reinicie o servidor de desenvolvimento.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-gold hover:bg-gold-light text-primary-foreground"
            >
              Recarregar Página
            </Button>
            {isVercel && (
              <Button
                variant="outline"
                onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
                className="border-gold/30 hover:bg-gold/10"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Vercel Dashboard
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

