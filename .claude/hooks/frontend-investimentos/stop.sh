#!/usr/bin/env bash
# Hook Stop — frontend-investimentos
# Bloqueia encerramento se os testes da área de investimentos falharem.

echo "--- [STOP] Verificando testes de frontend-investimentos ---"
cd Principal/Frontend/questionario-perfil 2>/dev/null || { echo "ERRO: pasta do frontend não encontrada." >&2; exit 2; }

npx vitest run src/__tests__/AreaInvestimentos.test.jsx --reporter=verbose 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de AreaInvestimentos falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Formulário válido → chama adicionarInvestimento e atualiza lista" >&2
  echo "  - Quantidade vazia → erro no campo antes de chamar API" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 7.2 passando. Pode encerrar."
exit 0
