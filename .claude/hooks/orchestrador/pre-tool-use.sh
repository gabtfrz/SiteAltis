#!/usr/bin/env bash
# Hook PreToolUse — orchestrador
# Bloqueia qualquer operação de escrita. O orquestrador é somente leitura.

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)

BLOQUEADAS="Write|Edit|NotebookEdit"

if echo "$TOOL" | grep -qE "^($BLOQUEADAS)$"; then
  echo "BLOQUEADO: o agent orchestrador é somente leitura e não pode usar '$TOOL'." >&2
  echo "Delegue a implementação para o sub-agent correto via Agent tool." >&2
  exit 2
fi

# Bloqueia comandos Bash destrutivos ou de escrita
if [ "$TOOL" = "Bash" ]; then
  CMD=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)

  PADROES_BLOQUEADOS="git (push|commit|reset|checkout|merge|rebase)|pip install|npm install|uvicorn|rm -rf"

  if echo "$CMD" | grep -qE "$PADROES_BLOQUEADOS"; then
    echo "BLOQUEADO: o orchestrador não executa comandos de instalação, deploy ou git write." >&2
    echo "Comando tentado: $CMD" >&2
    exit 2
  fi
fi

exit 0
