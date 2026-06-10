#!/usr/bin/env bash
# Hook PreToolUse — code-reviewer
# Bloqueia qualquer operação que não seja leitura pura.

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)

PERMITIDAS="Read|Glob|Grep"

if ! echo "$TOOL" | grep -qE "^($PERMITIDAS)$"; then
  echo "BLOQUEADO: o code-reviewer é somente leitura." >&2
  echo "Ferramenta tentada: '$TOOL' não é permitida." >&2
  echo "Ferramentas permitidas: Read, Glob, Grep." >&2
  echo "Este agent não modifica, executa nem cria arquivos." >&2
  exit 2
fi

exit 0
