#!/usr/bin/env bash
# Hook Stop — backend-investimentos
# Bloqueia encerramento se os testes de investimentos falharem.

echo "--- [STOP] Verificando testes de backend-investimentos ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_investimentos.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de investimentos falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Usuário A não acessa ativos do Usuário B (isolamento por usuario_id)" >&2
  echo "  - POST com quantidade <= 0 → HTTP 422" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 7.1 passando. Pode encerrar."
exit 0
