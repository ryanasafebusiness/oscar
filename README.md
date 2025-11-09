# OSCAR ADOLS 2025 - Sistema de Votação

Sistema completo de votação para o OSCAR ADOLS 2025 - Gala Ibae, permitindo que usuários votem em categorias e participantes, com área administrativa para gerenciamento.

## 🚀 Funcionalidades

- ✅ Sistema de votação por categorias
- ✅ Upload de imagens para participantes
- ✅ Área administrativa com autenticação
- ✅ Gerenciamento de categorias e participantes
- ✅ Resultados de votação em tempo real
- ✅ Interface moderna e responsiva
- ✅ Integração com Supabase

## 🛠️ Tecnologias

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deploy**: Vercel

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Conta no Supabase
- Conta no Vercel (para deploy)

## 🔧 Configuração Local

### 1. Clone o repositório

```bash
git clone https://github.com/ryanasafebusiness/oscar.git
cd oscar
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_publishable_key_aqui
```

### 4. Configure o Supabase

1. Execute o script `supabase/migrations/20251109184548_f57b959a-d6b8-4f5e-97ef-dfa859b6454f.sql` no SQL Editor do Supabase
2. Execute o script `fix_rls_policies.sql` para configurar as políticas RLS
3. Execute o script `setup_storage.sql` para configurar o Storage para upload de imagens

### 5. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8080`

## 🚀 Deploy no Vercel

### 1. Conecte o repositório ao Vercel

1. Acesse [Vercel](https://vercel.com)
2. Clique em "Add New Project"
3. Conecte o repositório GitHub `ryanasafebusiness/oscar`
4. Selecione o repositório

### 2. Configure as variáveis de ambiente ⚠️ IMPORTANTE

No Vercel, vá em **Settings > Environment Variables** e adicione:

- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://wcstqvwgywldstplmrdg.supabase.co`
- **Environments**: Selecione todas (Production, Preview, Development)

- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: `sb_publishable_yBVS2s0O2DD4uO0IllOOlA_xKtLqUxe`
- **Environments**: Selecione todas (Production, Preview, Development)

**⚠️ IMPORTANTE**: Sem essas variáveis, a aplicação não funcionará no Vercel!

### 3. Configure o Build

- **Framework Preset**: Vite (deve ser detectado automaticamente)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Deploy

1. Clique em "Deploy" e aguarde o processo concluir
2. **Após o primeiro deploy**, faça um **Redeploy** para garantir que as variáveis de ambiente foram carregadas
3. Acesse a aplicação e verifique se não há erros de conexão

### 5. Troubleshooting

Se você ver o erro "Supabase não está configurado":
- Verifique se as variáveis foram adicionadas corretamente
- Certifique-se de que selecionou todos os ambientes
- Faça um novo deploy após adicionar as variáveis
- Veja [VERCEL_SETUP.md](./VERCEL_SETUP.md) para instruções detalhadas

## 📚 Documentação Adicional

- [FIX_CATEGORIES.md](./FIX_CATEGORIES.md) - Como corrigir políticas RLS para categorias
- [FIX_VOTES.md](./FIX_VOTES.md) - Como corrigir políticas RLS para votação
- [SETUP_STORAGE.md](./SETUP_STORAGE.md) - Como configurar o Storage para upload de imagens
- [VERCEL_SETUP.md](./VERCEL_SETUP.md) - Como configurar variáveis de ambiente no Vercel

## 🔐 Segurança

- ⚠️ **Nunca commite arquivos `.env` ou `.env.local`**
- ⚠️ As políticas RLS permitem operações públicas - considere adicionar autenticação para produção
- ⚠️ A senha administrativa está no código - considere usar autenticação do Supabase para produção

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e pertence a ryanasafebusiness.

## 🆘 Suporte

Para problemas ou dúvidas, abra uma issue no repositório.
