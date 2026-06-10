#!/usr/bin/env bash
# Hook Stop — backend-ia
# Bloqueia encerramento se os testes do serviço de IA falharem.

echo "--- [STOP] Verificando testes de backend-ia ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_ia_service.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de IA falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Mock Ollama → string não vazia retornada" >&2
  echo "  - Ollama indisponível → fallback sem levantar exceção" >&2
  echo "  - Texto não contém sugestão de alocação percentual" >&2
  echo "Lembre: use unittest.mock.patch — nunca chame o Ollama real nos testes." >&2
  exit 2
fi

echo "✓ Todos os testes da Task 5.2 passando. Pode encerrar."
exit 0
