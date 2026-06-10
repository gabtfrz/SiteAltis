---
description: Verifica se o projeto está completo e pronto para entrega — checa checkboxes do PLAN.md, roda todos os testes, valida pré-condições de clone e gera relatório de próximos passos.
---

Você vai executar a checklist de entrega do projeto NODAL.

## Passo 1 — Verificar checkboxes do PLAN.md

Leia o PLAN.md completo. Para cada task, verifique se todos os testes críticos estão marcados com `[x]`.

Gere uma tabela de status:

```
| Task | Nome | Status |
|------|------|--------|
| 1.1  | Estrutura FastAPI | ✓ completa / ✗ pendente |
| 1.2  | Models banco      | ... |
...
```

Se qualquer task tiver checkbox `[ ]` ainda aberto, marque como **pendente** e liste o que falta.

## Passo 2 — Rodar suite de testes completa

**Backend:**
```bash
cd Principal/Backend
python -m pytest tests/ -v --tb=short
```

**Frontend:**
```bash
cd Principal/Frontend/questionario-perfil
npx vitest run --reporter=verbose
```

Registre o resultado: quantos passaram, quantos falharam, quais falharam.

## Passo 3 — Revisão final do código

Execute `/review` sem argumentos para auditar os arquivos do último commit.

Se houver BLOQUEANTES → **entrega bloqueada**. Liste e encerre com status REPROVADO.
Se houver IMPORTANTES → registre no relatório como dívida técnica.

## Passo 4 — Verificar pré-condições para clone

Confirme que o repositório está em estado clonável:

- [ ] `.env` não está versionado (verificar `.gitignore`)
- [ ] `.env.example` existe em `Principal/Backend/` com todas as variáveis documentadas
- [ ] `requirements.txt` existe e está atualizado
- [ ] `Principal/Backend/README.md` ou `CLAUDE.md` descreve como subir o projeto
- [ ] Nenhuma credencial hardcodada nos arquivos de código (`SECRET_KEY`, `BRAPI_TOKEN`)
- [ ] Pasta `node_modules/` não está versionada

Para cada item, use Grep para verificar ativamente — não assuma.

## Passo 5 — Relatório final

Gere o relatório no seguinte formato:

```
## Relatório de Entrega — NODAL
Data: [data atual]

### Status das Tasks
[tabela do Passo 1]

### Resultado dos Testes
Backend:  [n] passando / [n] falhando
Frontend: [n] passando / [n] falhando

### Revisão de Código
Veredicto: APROVADO / APROVADO COM RESSALVAS / REPROVADO
[findings BLOQUEANTES e IMPORTANTES se houver]

### Pré-condições de Clone
[lista com ✓ ou ✗ para cada item do Passo 4]

### Dívida Técnica Registrada
[IMPORTANTES encontrados que não foram corrigidos]

### Próximos Passos
[tasks ainda pendentes do PLAN.md em ordem de dependência]

### Veredicto Final
PRONTO PARA ENTREGA / PENDÊNCIAS A RESOLVER

[Se pendências: lista exata do que falta com referência ao PLAN.md]
```

## Critério de "Pronto para Entrega"

O projeto está pronto quando:
1. Todas as tasks do Sprint 1 têm checkboxes marcados
2. Zero testes falhando
3. Zero BLOQUEANTES na revisão de código
4. Todas as pré-condições de clone satisfeitas

Se qualquer um falhar → **PENDÊNCIAS A RESOLVER** com lista exata.
