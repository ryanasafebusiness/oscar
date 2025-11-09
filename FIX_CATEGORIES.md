# Como Corrigir o Erro de Criação de Categorias

## Problema
As políticas RLS (Row Level Security) do Supabase não permitem operações de escrita (INSERT, UPDATE, DELETE) nas tabelas `categories` e `participants`.

## Solução

Você precisa aplicar as políticas RLS no banco de dados do Supabase. Siga um dos métodos abaixo:

### Método 1: Executar SQL no Supabase Dashboard (Recomendado)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** (menu lateral)
4. Clique em **New Query**
5. Copie e cole o conteúdo do arquivo `fix_rls_policies.sql`
6. Clique em **Run** (ou pressione Ctrl+Enter)
7. Aguarde a confirmação de sucesso

### Método 2: Usar a Migration

Se você estiver usando o Supabase CLI localmente:

```bash
# Aplicar a migração
supabase migration up
```

Ou se estiver usando o Lovable Cloud, as migrações serão aplicadas automaticamente quando você publicar o projeto.

## Verificação

Após aplicar as políticas, tente criar uma categoria novamente na área administrativa. Se ainda houver erros, verifique:

1. Se as políticas foram criadas corretamente no Supabase Dashboard
2. Se há outras políticas conflitantes
3. Os logs do console do navegador para mensagens de erro detalhadas

## Nota de Segurança

⚠️ **Atenção**: As políticas criadas permitem que qualquer pessoa (sem autenticação) possa inserir, atualizar e deletar categorias e participantes. 

Para produção, considere:
- Adicionar autenticação ao Supabase
- Criar políticas mais restritivas baseadas em roles de usuário
- Usar service role key apenas no backend

Para desenvolvimento, essas políticas são aceitáveis se você estiver usando a senha administrativa na aplicação.

