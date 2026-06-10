#!/usr/bin/env bash
# Hook Stop — backend-recomendacoes
# Bloqueia encerramento se os testes de recomendações falharem.

echo "--- [STOP] Verificando testes de backend-recomendacoes ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_recomendacoes.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de recomendações falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Usuário Moderado recebe só ações perfil_compativel=Moderado" >&2
  echo "  - Usuário sem perfil calculado → HTTP 400 'Perfil não calculado'" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 5.1 passando. Pode encerrar."
exit 0
