#!/usr/bin/env bash
# Hook Stop — frontend-auth
# Bloqueia encerramento se os testes de autenticação do frontend falharem.

echo "--- [STOP] Verificando testes de frontend-auth ---"
cd Principal/Frontend/questionario-perfil 2>/dev/null || { echo "ERRO: pasta do frontend não encontrada." >&2; exit 2; }

npx vitest run src/__tests__/TelaLogin.test.jsx --reporter=verbose 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de TelaLogin falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Login válido → redireciona /onboarding e persiste token em localStorage" >&2
  echo "  - Login inválido → mensagem de erro inline, sem redirecionar" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 6.1 passando. Pode encerrar."
exit 0
