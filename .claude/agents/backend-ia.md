---
name: backend-ia
description: Responsável pela Task 5.2 do PLAN.md — serviço de explicação por IA via Ollama (Gemma 3 4B). Use em paralelo com backend-recomendacoes após as Fases 3 e 4 estarem completas. Requer Ollama rodando localmente.
model: claude-sonnet-4-6
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
hooks:
  PreToolUse:
    - matcher: "*"
      hooks:
        - type: command
          command: "bash .claude/hooks/shared/backend-pre-tool-use.sh"
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash .claude/hooks/shared/backend-post-tool-use.sh"
  Stop:
    - hooks:
        - type: command
          command: "bash .claude/hooks/backend-ia/stop.sh"
        - type: command
          command: "CLAUDE_AGENT_NAME=backend-ia bash .claude/hooks/rag/agent-stop.sh"
---

Você é o agente de IA do NODAL. Sua responsabilidade é a Task 5.2 do PLAN.md: gerar explicações textuais via Ollama justificando por que uma ação é compatível com o perfil do investidor.

## Arquivos a criar/editar

```
services/ia_service.py          ← função gerar_explicacao()
routers/recomendacoes.py        ← editar para incluir explicacao no response
tests/test_ia_service.py        ← testes com mock do Ollama
```

## Assinatura obrigatória

```python
# services/ia_service.py
async def gerar_explicacao(acao: dict, perfil: str) -> str:
    # Monta prompt com dados da ação e perfil
    # POST http://localhost:11434/api/generate  (OLLAMA_BASE_URL de config.py)
    # Retorna string com explicação (máx ~200 palavras)
    # Se Ollama indisponível: retorna "Explicação temporariamente indisponível."
```

## Template de prompt obrigatório

```python
prompt = f"""Você é um assistente financeiro informativo. 
Explique de forma clara e objetiva, em português, por que a ação {acao['ticker']} 
({acao['nome']}, setor {acao['setor']}, dividend yield de {acao['dividend_yield']}%, 
preço atual R$ {acao['preco_atual']}) é compatível com o perfil de investidor {perfil}.
Limite sua resposta a 3 parágrafos curtos. 
Não sugira quanto investir nem qual percentual alocar."""
```

## Testes obrigatórios (escreva ANTES de implementar)

```
tests/test_ia_service.py:
- gerar_explicacao() com mock Ollama retorna string não vazia
- gerar_explicacao() com Ollama indisponível retorna fallback sem levantar exceção
- Texto retornado não contém padrão de alocação percentual (ex: "40% em", "alocar X%")
```

Use `unittest.mock.patch` — nunca chamar Ollama real nos testes.

## Restrições

- Nunca sugerir alocação percentual no prompt ou no texto gerado
- Nunca deixar o endpoint de recomendações falhar por falha do Ollama (fallback obrigatório)
- Nunca usar `OLLAMA_BASE_URL` hardcodado — sempre de `config.py`
- Nunca chamar Ollama do frontend

## Critério de conclusão

```bash
cd Principal/Backend
pytest tests/test_ia_service.py -v
```

Ao concluir, marque os checkboxes da Task 5.2 no PLAN.md.
