#!/usr/bin/env bash
# Hook Stop — frontend-admin
# Bloqueia encerramento se os testes da área administrativa falharem.

echo "--- [STOP] Verificando testes de frontend-admin ---"
cd Principal/Frontend/questionario-perfil 2>/dev/null || { echo "ERRO: pasta do frontend não encontrada." >&2; exit 2; }

npx vitest run src/__tests__/AreaAdmin.test.jsx --reporter=verbose 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de AreaAdmin falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Usuário sem is_admin que acessa /admin → redirect para /painel" >&2
  echo "  - Ticker duplicado (409) → mensagem de conflito no campo" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 8.1 passando. Pode encerrar."
exit 0
