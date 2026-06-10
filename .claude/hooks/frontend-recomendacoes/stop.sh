#!/usr/bin/env bash
# Hook Stop — frontend-recomendacoes
# Bloqueia encerramento se os testes da lista de recomendações falharem.

echo "--- [STOP] Verificando testes de frontend-recomendacoes ---"
cd Principal/Frontend/questionario-perfil 2>/dev/null || { echo "ERRO: pasta do frontend não encontrada." >&2; exit 2; }

npx vitest run src/__tests__/ListaRecomendacoes.test.jsx --reporter=verbose 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de ListaRecomendacoes falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Renderiza só ações compatíveis com o perfil do usuário logado" >&2
  echo "  - Loading → skeleton; erro → mensagem sem quebrar layout" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 6.3 passando. Pode encerrar."
exit 0
