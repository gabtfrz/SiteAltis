#!/usr/bin/env bash
# Hook PostToolUse — agents de frontend (compartilhado)
# Após editar qualquer .jsx/.js, roda vitest no arquivo de teste correspondente.
# Não bloqueia (exit 0 sempre) — o Stop hook bloqueia ao encerrar.

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)

if echo "$TOOL" | grep -qE "^(Write|Edit)$"; then
  FILE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); i=d.get('tool_input',{}); print(i.get('file_path', i.get('path','')))" 2>/dev/null)

  if echo "$FILE" | grep -qE "\.(jsx|js|ts|tsx)$"; then
    FRONTEND_DIR="Principal/Frontend/questionario-perfil"

    # Extrai nome do componente do caminho do arquivo
    COMPONENT=$(basename "$FILE" | sed 's/\.\(jsx\|js\|ts\|tsx\)$//')

    TEST_FILE="$FRONTEND_DIR/src/__tests__/${COMPONENT}.test.jsx"

    if [ -f "$TEST_FILE" ]; then
      echo "--- [POST-EDIT] Rodando testes para: $COMPONENT ---"
      cd "$FRONTEND_DIR" 2>/dev/null || true

      npx vitest run "src/__tests__/${COMPONENT}.test.jsx" --reporter=verbose 2>&1
      RESULT=$?

      if [ $RESULT -ne 0 ]; then
        echo ""
        echo "⚠ AVISO: testes falhando após edição de $FILE" >&2
        echo "Corrija antes de encerrar (o hook Stop vai bloquear se ainda falharem)." >&2
      else
        echo "✓ Testes passando."
      fi
    fi
  fi
fi

exit 0
