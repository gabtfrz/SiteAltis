#!/usr/bin/env bash
# Hook Stop (async) — captura síntese da sessão inteira ao encerrar o Claude Code.
# Configurado em .claude/settings.json como hook global de Stop.

SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPTS="$SCRIPT_DIR/scripts"

INPUT=$(cat)

# Extrai o transcript completo da sessão
TRANSCRIPT=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
msgs = data.get('transcript', data.get('messages', []))
lines = []
for m in msgs:
    role = m.get('role','')
    content = m.get('content','')
    if isinstance(content, list):
        content = ' '.join(c.get('text','') for c in content if isinstance(c, dict))
    if content:
        lines.append(f'{role}: {content[:300]}')
print('\n'.join(lines[-80:]))  # últimas 80 mensagens da sessão
" 2>/dev/null)

if [ -z "$TRANSCRIPT" ] || [ ${#TRANSCRIPT} -lt 200 ]; then
  exit 0
fi

(
  cd "$SCRIPT_DIR"
  MD_FILE=$(echo "$TRANSCRIPT" | \
    "$SCRIPTS/node_modules/.bin/tsx" "$SCRIPTS/summarize.ts" --agent "session" 2>/dev/null)

  if [ -n "$MD_FILE" ] && [ -f "$MD_FILE" ]; then
    "$SCRIPTS/node_modules/.bin/tsx" "$SCRIPTS/embed.ts" \
      --file "$MD_FILE" --agent "session" 2>/dev/null
    echo "[RAG] Síntese de sessão salva: $MD_FILE" >> "$SCRIPT_DIR/knowledge/rag.log"
  fi
) &

exit 0
