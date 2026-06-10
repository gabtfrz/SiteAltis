#!/usr/bin/env bash
# Hook PreToolUse — agents de frontend (compartilhado)
# Bloqueia: escrita em arquivos de backend Python, git push/commit, pip

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)

if echo "$TOOL" | grep -qE "^(Write|Edit)$"; then
  FILE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); i=d.get('tool_input',{}); print(i.get('file_path', i.get('path','')))" 2>/dev/null)

  if echo "$FILE" | grep -qiE "Principal/Backend|\.py$|requirements\.txt"; then
    echo "BLOQUEADO: agent de frontend não deve modificar arquivos de backend." >&2
    echo "Arquivo tentado: $FILE" >&2
    echo "Delegue ao agent backend correspondente." >&2
    exit 2
  fi

  if echo "$FILE" | grep -qE "SPEC\.md|CLAUDE\.md|PLAN\.md"; then
    echo "BLOQUEADO: arquivos de especificação são somente leitura." >&2
    exit 2
  fi
fi

if [ "$TOOL" = "Bash" ]; then
  CMD=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)

  if echo "$CMD" | grep -qE "git (push|commit|reset --hard|checkout --)"; then
    echo "BLOQUEADO: agents de implementação não fazem git push/commit." >&2
    echo "Comando tentado: $CMD" >&2
    exit 2
  fi

  if echo "$CMD" | grep -qE "^pip |^uvicorn|^python -m uvicorn"; then
    echo "BLOQUEADO: agent de frontend não executa comandos pip ou uvicorn." >&2
    echo "Comando tentado: $CMD" >&2
    exit 2
  fi

  # Bloqueia chamadas diretas à BRAPI ou Ollama (devem passar pelo backend)
  if echo "$CMD" | grep -qE "brapi\.dev|11434"; then
    echo "BLOQUEADO: chamadas à BRAPI e ao Ollama devem passar pelo backend FastAPI." >&2
    exit 2
  fi
fi

exit 0
