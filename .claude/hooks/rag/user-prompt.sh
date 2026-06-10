#!/usr/bin/env bash
# Hook UserPromptSubmit — busca conhecimento relevante para o prompt atual.
# Injeta os chunks encontrados no contexto antes do model responder.
# Falha silenciosamente (exit 0) se o banco não existir ou estiver vazio.

SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPTS="$SCRIPT_DIR/scripts"
DB="$SCRIPT_DIR/knowledge/rag.db"

# Banco não inicializado — não injetar nada
if [ ! -f "$DB" ]; then
  exit 0
fi

INPUT=$(cat)

# Extrai o prompt e o agent ativo do JSON
PROMPT=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data.get('prompt', data.get('user_prompt', ''))[:500])
" 2>/dev/null)

AGENT=$(echo "$INPUT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(data.get('agent_name', data.get('current_agent', 'unknown')))
" 2>/dev/null)

if [ -z "$PROMPT" ] || [ ${#PROMPT} -lt 10 ]; then
  exit 0
fi

# Busca chunks relevantes e injeta no contexto via stdout
CONTEXT=$(echo "$PROMPT" | \
  "$SCRIPTS/node_modules/.bin/tsx" "$SCRIPTS/search.ts" \
  --agent "${AGENT:-unknown}" 2>/dev/null)

if [ -n "$CONTEXT" ]; then
  # Saída para stdout é injetada no contexto pelo Claude Code
  echo "$CONTEXT"
fi

exit 0
