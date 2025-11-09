# Como Configurar Variáveis de Ambiente no Vercel

## Problema
A aplicação no Vercel está mostrando o erro: "Supabase não está configurado. Verifique as variáveis de ambiente."

Isso acontece porque as variáveis de ambiente não foram configuradas no Vercel.

## Solução: Configurar Variáveis de Ambiente no Vercel

### Passo 1: Acesse as Configurações do Projeto

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Encontre o projeto `oscar` (ou o nome do seu projeto)
3. Clique no projeto para abrir
4. Vá em **Settings** (Configurações)
5. Clique em **Environment Variables** (Variáveis de Ambiente)

### Passo 2: Adicione as Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente:

#### Variável 1:
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://wcstqvwgywldstplmrdg.supabase.co`
- **Environments**: Selecione todas (Production, Preview, Development)

#### Variável 2:
- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: `sb_publishable_yBVS2s0O2DD4uO0IllOOlA_xKtLqUxe`
- **Environments**: Selecione todas (Production, Preview, Development)

### Passo 3: Faça um Novo Deploy

Após adicionar as variáveis de ambiente:

1. Vá em **Deployments**
2. Clique nos três pontos (...) do último deployment
3. Selecione **Redeploy**
4. Ou faça um novo commit e push para o GitHub (o Vercel fará deploy automaticamente)

### Passo 4: Verifique se Funcionou

1. Aguarde o deploy terminar
2. Acesse a aplicação no Vercel
3. O banner de erro deve desaparecer
4. A aplicação deve conectar ao Supabase

## Importante

⚠️ **As variáveis de ambiente no Vercel são diferentes do arquivo `.env.local` local!**

- O arquivo `.env.local` só funciona localmente
- No Vercel, você DEVE configurar as variáveis nas configurações do projeto
- As variáveis devem começar com `VITE_` para serem expostas no frontend

## Verificação

Para verificar se as variáveis estão configuradas corretamente:

1. Acesse o deployment no Vercel
2. Clique em **Functions** ou **Logs**
3. Procure por mensagens sobre variáveis de ambiente
4. Ou verifique no console do navegador se há erros

## Troubleshooting

### Erro persiste após configurar variáveis
- Certifique-se de que as variáveis começam com `VITE_`
- Verifique se selecionou todos os ambientes (Production, Preview, Development)
- Faça um novo deploy após adicionar as variáveis
- Aguarde alguns minutos para o cache atualizar

### Variáveis não aparecem no build
- Verifique se o nome da variável está correto (case-sensitive)
- Certifique-se de que o valor não tem espaços extras
- Faça um redeploy completo (não apenas um rebuild)

### Ainda vê o erro "Supabase não está configurado"
- Verifique os logs do Vercel para erros de build
- Confirme que as variáveis estão visíveis no deployment
- Tente limpar o cache do navegador
- Verifique se a URL e a chave do Supabase estão corretas

## Valores das Variáveis

Certifique-se de usar exatamente estes valores:

```
VITE_SUPABASE_URL=https://wcstqvwgywldstplmrdg.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_yBVS2s0O2DD4uO0IllOOlA_xKtLqUxe
```

## Próximos Passos

Após configurar as variáveis de ambiente:

1. ✅ Execute as migrações SQL no Supabase
2. ✅ Configure as políticas RLS
3. ✅ Configure o Storage para upload de imagens
4. ✅ Teste a aplicação no Vercel

