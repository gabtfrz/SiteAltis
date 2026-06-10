#!/usr/bin/env bash
# Hook Stop — backend-db
# Bloqueia encerramento se os testes de models falharem.

echo "--- [STOP] Verificando testes de backend-db ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_models.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de models falhando. Corrija antes de encerrar." >&2
  echo "Execute: cd Principal/Backend && pytest tests/test_models.py -v" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 1.2 passando. Pode encerrar."
exit 0
