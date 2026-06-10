---
description: Lê a task especificada no PLAN.md, despacha o agent correto, enforça TDD (RED→GREEN) e invoca o /review ao final. Uso: /implementar 2.1
---

Você vai implementar a task **$ARGUMENTS** do PLAN.md seguindo TDD e as convenções do CLAUDE.md.

## Passo 1 — Carregar contexto da task

Leia o PLAN.md e extraia para a task $ARGUMENTS:
- Nome da task e módulo
- Input (o que precisa estar pronto)
- Output esperado (arquivos, funções, assinaturas)
- Testes críticos listados

Leia também `.claude/agents/{agent-da-task}.md` para carregar as restrições específicas do módulo.

## Passo 2 — Verificar pré-condições

Verifique se o Input da task está disponível:
- Arquivos que devem existir → confirme com Glob
- Endpoints que devem estar respondendo → leia os arquivos de router correspondentes

Se algum pré-requisito estiver faltando, **pare aqui** e informe:
```
BLOQUEADO: Task $ARGUMENTS não pode iniciar.
Faltando: [lista do que está ausente]
Resolva a fase anterior antes de continuar.
```

## Passo 3 — RED (escreva os testes primeiro)

Crie o arquivo de teste conforme definido no PLAN.md **antes de qualquer implementação**.

Para backend (`Principal/Backend/tests/`):
- Use `fastapi.testclient.TestClient`
- Mock serviços externos com `unittest.mock.patch`
- Nomes de teste descrevem comportamento: `test_login_com_senha_errada_retorna_401`

Para frontend (`src/__tests__/`):
- Use Vitest + Testing Library
- Mock de fetch via `vi.fn()`

Execute os testes e confirme que **falham**:
```bash
# Backend:
cd Principal/Backend && python -m pytest tests/test_{módulo}.py -v

# Frontend:
cd Principal/Frontend/questionario-perfil && npx vitest run src/__tests__/{Componente}.test.jsx
```

Se os testes passarem sem implementação, o teste está errado — reescreva antes de continuar.

## Passo 4 — GREEN (implemente o mínimo)

Implemente apenas o suficiente para os testes passarem.

Siga a skill correspondente ao tipo de task:
- Backend: `.claude/skills/nodal-endpoint/SKILL.md`
- Frontend: `.claude/skills/nodal-api-connect/SKILL.md`

Ordem obrigatória para backend: `schemas/` → `services/` → `routers/` → registrar em `main.py`
Ordem obrigatória para frontend: função em `api.js` → hook em `hooks/` → componente atualizado

Execute os testes novamente e confirme que **passam**:
```bash
# Backend:
cd Principal/Backend && python -m pytest tests/test_{módulo}.py -v

# Frontend:
cd Principal/Frontend/questionario-perfil && npx vitest run src/__tests__/{Componente}.test.jsx
```

## Passo 5 — Marcar checkbox no PLAN.md

Localize a task $ARGUMENTS no PLAN.md e marque cada teste crítico concluído:
```
- [x] descrição do teste
```

## Passo 6 — Revisão automática

Execute `/review $ARGUMENTS` para auditar o que foi implementado.

Se o veredicto for **REPROVADO**, liste os BLOQUEANTES encontrados e corrija antes de encerrar.
Se for **APROVADO COM RESSALVAS**, liste os IMPORTANTES para que o orquestrador decida se avança ou corrige.

## Mapa de tasks para agents

| Task | Agent |
|------|-------|
| 1.1 | backend-setup |
| 1.2 | backend-db |
| 2.1 | backend-auth |
| 3.1 | backend-perfil |
| 4.1 | backend-acoes |
| 4.2 | backend-precos |
| 5.1 | backend-recomendacoes |
| 5.2 | backend-ia |
| 6.1 | frontend-auth |
| 6.2 | frontend-perfil |
| 6.3 | frontend-recomendacoes |
| 7.1 | backend-investimentos |
| 7.2 | frontend-investimentos |
| 8.1 | frontend-admin |
