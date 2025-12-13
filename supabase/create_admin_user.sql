-- ⚠️ IMPORTANTE: Ação Manual Necessária no Supabase Dashboard
-- 
-- O usuário Admin DEVE ser criado com a senha específica solicitada: "100731594"
--
-- PASSO A PASSO (Faça isso agora no navegador):
-- 1. Acesse: https://supabase.com/dashboard/project/_/auth/users
-- 2. Clique em "Add User" → "Create New User"
-- 3. Preencha os dados OBRIGATÓRIOS:
--    - Email: Brenoaugusto143@gmail.com
--    - Password: 100731594
--    - Marque "Auto Confirm User"
-- 4. Clique em "Create User"
--
-- Motivo: O sistema de segurança do Supabase não permite que eu defina a senha via código.
-- Você precisa definir essa senha manualmente para garantir que ela seja criptografada corretamente.

-- Depois de criar o usuário no painel acima, execute este comando SQL
-- para garantir que o perfil do usuário exista na tabela pública:

INSERT INTO public.users (id, email, name)
SELECT 
  id,
  email,
  'Administrador'
FROM auth.users 
WHERE email = 'Brenoaugusto143@gmail.com'
ON CONFLICT (email) DO UPDATE SET
  name = 'Administrador',
  updated_at = NOW();

-- 
-- FUNÇÕES RPC NECESSÁRIAS PARA ANALYTICS
-- Execute também o script abaixo para criar as funções de contagem de cliques e visualizações:
--

CREATE OR REPLACE FUNCTION increment_view_count(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET view_count = view_count + 1
  WHERE id = row_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_click_count(row_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET click_count = click_count + 1
  WHERE id = row_id;
END;
$$;
