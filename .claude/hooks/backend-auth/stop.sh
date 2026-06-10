#!/usr/bin/env bash
# Hook Stop — backend-auth
# Bloqueia encerramento se os testes de autenticação falharem.

echo "--- [STOP] Verificando testes de backend-auth ---"
cd Principal/Backend 2>/dev/null || { echo "ERRO: pasta Principal/Backend não encontrada." >&2; exit 2; }

python3 -m pytest tests/test_auth.py -q --tb=short 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de auth falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - POST /api/auth/login com credenciais corretas → token JWT" >&2
  echo "  - POST /api/auth/login com senha errada → 401" >&2
  echo "  - POST /api/auth/cadastro com email duplicado → 409" >&2
  echo "  - Token expirado → 401 em endpoint protegido" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 2.1 passando. Pode encerrar."
exit 0
