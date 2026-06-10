#!/usr/bin/env bash
# Hook PreToolUse — agents de backend (compartilhado)
# Bloqueia: acesso a arquivos de frontend, git push/commit, npm/npx

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)

# Bloqueia escrita em arquivos fora do Backend
if echo "$TOOL" | grep -qE "^(Write|Edit)$"; then
  FILE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); i=d.get('tool_input',{}); print(i.get('file_path', i.get('path','')))" 2>/dev/null)

  if echo "$FILE" | grep -qiE "Principal/Frontend|\.jsx$|\.tsx$|\.css$"; then
    echo "BLOQUEADO: agent de backend não deve modificar arquivos de frontend." >&2
    echo "Arquivo tentado: $FILE" >&2
    echo "Delegue ao agent frontend correspondente." >&2
    exit 2
  fi

  if echo "$FILE" | grep -qE "SPEC\.md|CLAUDE\.md|PLAN\.md"; then
    echo "BLOQUEADO: arquivos de especificação são somente leitura para agents de implementação." >&2
    exit 2
  fi
fi

# Bloqueia comandos Bash fora do escopo de backend
if [ "$TOOL" = "Bash" ]; then
  CMD=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('tool_input',{}).get('command',''))" 2>/dev/null)

  if echo "$CMD" | grep -qE "git (push|commit|reset --hard|checkout --)"; then
    echo "BLOQUEADO: agents de implementação não fazem git push/commit." >&2
    echo "Comando tentado: $CMD" >&2
    exit 2
  fi

  if echo "$CMD" | grep -qE "^npm|^npx|^yarn"; then
    echo "BLOQUEADO: agent de backend não executa comandos npm/npx." >&2
    echo "Comando tentado: $CMD" >&2
    exit 2
  fi
fi

exit 0
