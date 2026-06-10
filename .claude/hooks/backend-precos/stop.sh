#!/usr/bin/env bash
# Hook Stop — backend-precos
# Bloqueia encerramento se os testes do serviço de preços falharem.

echo "--- [STOP] Verificando testes de backend-precos ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_preco_service.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de atualização de preços falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Mock BRAPI retorna 10.50 para BBAS3 → preco_atual=10.50 no banco" >&2
  echo "  - Falha em um ticker não interrompe os demais" >&2
  echo "Lembre: use unittest.mock.patch — nunca chame a BRAPI real nos testes." >&2
  exit 2
fi

echo "✓ Todos os testes da Task 4.2 passando. Pode encerrar."
exit 0
