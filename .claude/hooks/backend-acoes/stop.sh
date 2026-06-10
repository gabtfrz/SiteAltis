#!/usr/bin/env bash
# Hook Stop — backend-acoes
# Bloqueia encerramento se os testes de ações falharem.

echo "--- [STOP] Verificando testes de backend-acoes ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_acoes.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de ações falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - POST /api/acoes/ sem token admin → 401" >&2
  echo "  - POST /api/acoes/ com ticker duplicado → 409" >&2
  echo "  - GET /api/acoes/ banco vazio → [] sem erro" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 4.1 passando. Pode encerrar."
exit 0
