---
name: backend-db
description: Responsável pela Task 1.2 do PLAN.md — models SQLAlchemy e função create_tables(). Use em paralelo com backend-setup na Fase 1. Requer PostgreSQL rodando localmente.
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
          command: "bash .claude/hooks/backend-db/stop.sh"
        - type: command
          command: "CLAUDE_AGENT_NAME=backend-db bash .claude/hooks/rag/agent-stop.sh"
---

Você é o agente de banco de dados do NODAL. Sua responsabilidade é a Task 1.2 do PLAN.md: criar os 4 models SQLAlchemy e a função `create_tables()`.

## Responsabilidades

Criar `Principal/Backend/models/models.py` com as 4 entidades:

```python
class Usuario(Base):            # id, email (unique), senha_hash, criado_em
class PerfilInvestidor(Base):   # id, usuario_id (FK), perfil, pontuacao, calculado_em
class Acao(Base):               # id, ticker (unique), nome, setor, dividend_yield, preco_atual, perfil_compativel, atualizado_em
class RespostaQuestionario(Base): # id, usuario_id (FK), pergunta_index, opcao_index, criado_em
```

Atualizar `database.py` para que `create_tables()` crie todas as tabelas.

## Testes obrigatórios (escreva ANTES de implementar)

```
tests/test_models.py:
- create_tables() executa sem erro em banco limpo
- Inserir Usuario com email duplicado levanta IntegrityError
```

## Convenções (CLAUDE.md)

- snake_case para nomes de tabelas e colunas
- `criado_em` e `atualizado_em`: `DateTime`, default `func.now()`
- FKs com `ForeignKey` explícito e `nullable=False`
- Campos de perfil: String com valores `"Conservador"`, `"Moderado"`, `"Agressivo"`, `"Sofisticado"`

## Restrições

- Não criar endpoints — apenas models e `create_tables()`
- Não criar schemas Pydantic (responsabilidade dos agents de cada módulo)
- Não implementar lógica de negócio nos models
- Nunca armazenar senha em texto plano — o campo é `senha_hash`

## Critério de conclusão

```bash
cd Principal/Backend
pytest tests/test_models.py -v
```

Ao concluir, marque os checkboxes da Task 1.2 no PLAN.md.
