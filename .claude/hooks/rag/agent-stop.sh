#!/usr/bin/env bash
# Hook Stop (async) — captura aprendizado do agent que acabou de encerrar.
# Chamado de cada agent via hooks.Stop no frontmatter.
# Variável CLAUDE_AGENT_NAME deve ser passada pelo agent ou inferida do diretório.

SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPTS="$SCRIPT_DIR/scripts"
AGENT="${CLAUDE_AGENT_NAME:-${1:-unknown}}"

# Lê o transcript do stdin (JSON do Stop hook)
INPUT=$(cat)

# Extrai o transcript da conversa do JSON
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
        lines.append(f'{role}: {content[:500]}')
print('\n'.join(lines[-40:]))  # últimas 40 mensagens
" 2>/dev/null)

if [ -z "$TRANSCRIPT" ] || [ ${#TRANSCRIPT} -lt 100 ]; then
  exit 0
fi

# Roda summarize em background (async — não bloqueia o encerramento)
(
  cd "$SCRIPT_DIR"
  MD_FILE=$(echo "$TRANSCRIPT" | node --input-type=module \
    --experimental-vm-modules \
    "$SCRIPTS/node_modules/.bin/tsx" "$SCRIPTS/summarize.ts" --agent "$AGENT" 2>/dev/null)

  if [ -n "$MD_FILE" ] && [ -f "$MD_FILE" ]; then
    node --input-type=module \
      "$SCRIPTS/node_modules/.bin/tsx" "$SCRIPTS/embed.ts" \
      --file "$MD_FILE" --agent "$AGENT" 2>/dev/null
    echo "[RAG] Aprendizado do agent $AGENT salvo: $MD_FILE" >> "$SCRIPT_DIR/knowledge/rag.log"
  fi
) &

exit 0
