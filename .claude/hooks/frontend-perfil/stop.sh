#!/usr/bin/env bash
# Hook Stop — frontend-perfil
# Bloqueia encerramento se os testes do questionário de perfil falharem.

echo "--- [STOP] Verificando testes de frontend-perfil ---"
cd Principal/Frontend/questionario-perfil 2>/dev/null || { echo "ERRO: pasta do frontend não encontrada." >&2; exit 2; }

npx vitest run src/__tests__/QuestionarioPerfil.test.jsx --reporter=verbose 2>&1
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo "" >&2
  echo "BLOQUEADO: testes de QuestionarioPerfil falhando. Corrija antes de encerrar." >&2
  echo "Testes obrigatórios:" >&2
  echo "  - Ao concluir, POST /api/perfil/calcular chamado com 7 respostas no formato correto" >&2
  echo "  - Falha na API → mensagem de erro em TelaConclusao sem travar a tela" >&2
  exit 2
fi

echo "✓ Todos os testes da Task 6.2 passando. Pode encerrar."
exit 0
