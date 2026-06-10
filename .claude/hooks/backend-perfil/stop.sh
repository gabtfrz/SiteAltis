#!/usr/bin/env bash
# Hook Stop — backend-perfil
# Bloqueia encerramento se os testes de cálculo de perfil falharem.

echo "--- [STOP] Verificando testes de backend-perfil ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_perfil.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de perfil falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios (CVM nº 30/2021):" >&2
  echo "  - 7x opcao_index=0 → pontuação 7 → Conservador" >&2
  echo "  - 7x opcao_index=3 → pontuação 28 → Sofisticado" >&2
  echo "  - ≠7 respostas → HTTP 422" >&2
  echo "  - Sem token → HTTP 401" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 3.1 passando. Pode encerrar."
exit 0
