#!/usr/bin/env bash
# Hook PostToolUse — agents de backend (compartilhado)
# Após editar qualquer .py, roda pytest no módulo correspondente e avisa se falhar.
# Não bloqueia (exit 0 sempre) — o Stop hook é quem bloqueia ao encerrar.

INPUT=$(cat)
TOOL=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)

if echo "$TOOL" | grep -qE "^(Write|Edit)$"; then
  FILE=$(echo "$INPUT" | python3 -c "import sys,json; d=json.load(sys.stdin); i=d.get('tool_input',{}); print(i.get('file_path', i.get('path','')))" 2>/dev/null)

  if echo "$FILE" | grep -qE "\.py$"; then
    BACKEND_DIR="Principal/Backend"

    # Identifica o módulo pelo caminho do arquivo editado
    MODULE=$(echo "$FILE" | grep -oE "(auth|perfil|acoes|recomendacoes|ia|preco|investimentos|models|health)" | head -1)

    if [ -n "$MODULE" ]; then
      TEST_FILE="$BACKEND_DIR/tests/test_${MODULE}.py"

      # Fallback para test_health se módulo não mapeado
      if [ ! -f "$TEST_FILE" ]; then
        TEST_FILE="$BACKEND_DIR/tests/test_health.py"
      fi

      echo "--- [POST-EDIT] Rodando testes para módulo: $MODULE ---"
      cd "$BACKEND_DIR" 2>/dev/null || true

      python3 -m pytest "$TEST_FILE" -q --tb=short 2>&1
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
