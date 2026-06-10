---
description: Recebe uma solicitação de melhoria em texto livre, faz 2 perguntas de clarificação, monta um plano em sprints/fases/tasks e delega a implementação para o /implementar via agent orchestrador. Uso: /melhoria <descrição da melhoria>
---

Você vai conduzir o processo completo de planejamento e implementação de uma melhoria para o projeto NODAL.

Melhoria solicitada: **$ARGUMENTS**

---

## Etapa 1 — Leitura de contexto

Antes de fazer qualquer pergunta, leia silenciosamente:
- `SPEC.md` — para entender o escopo e o que está fora dos limites do projeto
- `PLAN.md` — para entender as tasks já existentes e evitar duplicação
- `CLAUDE.md` — para conhecer as convenções que a implementação deve seguir

---

## Etapa 2 — Duas perguntas de clarificação

Com base na solicitação e no contexto lido, formule exatamente **2 perguntas** que removam as ambiguidades mais críticas para planejar a implementação.

Critérios para escolher as perguntas:
- Prefira perguntas sobre **escopo** (o que entra e o que não entra) e **comportamento esperado** (como deve funcionar na prática)
- Não pergunte o que já está claro na solicitação
- Não pergunte sobre stack ou convenções — essas já estão definidas no CLAUDE.md
- Se a melhoria tocar em restrições do SPEC (ex: consultoria de investimentos, deploy), sinalize antes de perguntar

Apresente as perguntas no formato:

```
Para planejar esta melhoria com precisão, preciso entender:

1. [pergunta sobre escopo ou comportamento]

2. [pergunta sobre comportamento ou prioridade]
```

**Aguarde a resposta do usuário antes de continuar.**

---

## Etapa 3 — Montar o plano de implementação

Com as respostas recebidas, gere o plano completo no seguinte formato:

```markdown
# Plano de Melhoria — [nome curto da melhoria]

## Problema / Motivação
[1-2 frases descrevendo o que está faltando ou o que vai melhorar]

## Critério de aceitação
[Lista de comportamentos verificáveis que confirmam que a melhoria está completa]
- [ ] comportamento 1
- [ ] comportamento 2

## Sprint [N+1] — [critério de conclusão em 1 frase verificável]

### Fase 1 — [nome]
> Dependências: [fases anteriores ou "nenhuma"]
> Paralelismo: [quais tasks desta fase rodam em paralelo ou "sequencial"]

#### Task M.1 — [nome]
- Agent: [agent responsável conforme .claude/agents/]
- Input: [o que precisa estar pronto para iniciar]
- Output: [entregável específico com arquivo ou função]
- Testes críticos:
  - [ ] [comportamento esperado — input válido]
  - [ ] [caso de erro tratado]

#### Task M.2 — [nome]
...

### Fase 2 — [nome]
...

## Impacto em arquivos existentes
[Lista de arquivos do projeto que serão modificados — nunca SPEC.md, CLAUDE.md ou PLAN.md]

## Riscos e restrições
[O que pode dar errado ou quais limites do SPEC esta melhoria respeita]
```

Regras obrigatórias ao montar o plano:
- Numere as tasks com prefixo `M` (de Melhoria) para não conflitar com tasks do PLAN.md original — ex: `M.1`, `M.2`
- Toda task tem mínimo 2 testes críticos definidos antes de qualquer implementação
- Tasks genuinamente independentes ficam na mesma fase com paralelismo marcado
- O agent de cada task deve ser um dos agents existentes em `.claude/agents/`
- Nunca propor tasks que violem o SPEC.md (sem consultoria, sem execução de ordens, sem deploy)

---

## Etapa 4 — Confirmar com o usuário

Apresente o plano e pergunte:

```
Plano pronto. Deseja que eu inicie a implementação agora via orchestrador?

- Digite CONFIRMAR para iniciar
- Digite AJUSTAR + o que mudar para revisar o plano
- Digite CANCELAR para encerrar sem implementar
```

**Aguarde a confirmação antes de continuar.**

---

## Etapa 5 — Delegar ao orchestrador via /implementar

Se o usuário confirmar, acione o agent **orchestrador** para gerenciar a execução:

```
Você é o orchestrador do projeto NODAL.

Execute o plano de melhoria abaixo fase por fase, respeitando as dependências.
Para cada task, use o comando /implementar M.X onde X é o número da task.
Verifique o gate de cada fase (testes passando) antes de avançar para a próxima.
Ao final de todas as tasks, execute /review para auditoria final.

[COLE AQUI O PLANO GERADO NA ETAPA 3]
```

O orchestrador então chamará `/implementar M.1`, `/implementar M.2`, etc. na ordem correta, respeitando paralelismo e gates entre fases — exatamente como faz com as tasks do PLAN.md original.

---

## Restrições deste command

- Nunca iniciar a implementação sem confirmação explícita do usuário
- Nunca modificar SPEC.md, CLAUDE.md ou PLAN.md como parte da melhoria
- Nunca propor tasks sem testes críticos definidos
- Se a melhoria contradizer uma constraint do SPEC, sinalize e proponha uma alternativa compatível
- Se a melhoria já estiver coberta por uma task existente no PLAN.md, informe e sugira usar `/implementar` diretamente
