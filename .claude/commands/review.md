---
description: Invoca o code-reviewer para auditar arquivos ou módulos contra o SPEC.md e o PLAN.md. Classifica findings em BLOQUEANTE, IMPORTANTE e SUGESTÃO e emite veredicto.
---

Você vai executar uma revisão de código do projeto NODAL.

## Escopo da revisão

$ARGUMENTS define o que revisar. Interprete assim:

- Vazio → revisar todos os arquivos modificados no último commit (`git diff HEAD~1 --name-only`)
- Nome de módulo (ex: `auth`, `perfil`, `acoes`) → revisar `Principal/Backend/routers/{módulo}.py`, `Principal/Backend/services/{módulo}_service.py`, `Principal/Backend/tests/test_{módulo}.py`
- Caminho de arquivo (ex: `Principal/Backend/routers/auth.py`) → revisar esse arquivo específico
- Número de task (ex: `2.1`) → revisar todos os arquivos listados no output da Task $ARGUMENTS do PLAN.md

## Passos obrigatórios

1. Leia o SPEC.md — identifique as constraints técnicas e critérios de aceitação relevantes ao escopo
2. Leia o PLAN.md — identifique os testes críticos e outputs esperados da(s) task(s) no escopo
3. Leia as rules em `.claude/rules/seguranca.md`, `.claude/rules/convencoes-gerais.md` e a rule de domínio correspondente
4. Leia cada arquivo no escopo
5. Para cada problema encontrado, classifique:

**BLOQUEANTE** — viola constraint do SPEC, gate do PLAN ou regra de segurança:
- `senha_hash` exposta em response
- Alocação percentual sugerida em qualquer saída
- Teste crítico do PLAN.md ausente ou passando sem implementação real
- Isolamento de `usuario_id` ausente em query que deveria filtrar por usuário
- `is_admin` validado no body da requisição em vez do token

**IMPORTANTE** — não bloqueia agora, quebrará em fase posterior:
- Service importando `fastapi` (viola separação de camadas do CLAUDE.md)
- `os.getenv()` fora de `config.py`
- Componente React sem estado de `loading` ou `error`
- Chamada a BRAPI ou Ollama sem tratamento de fallback
- `ticker` não normalizado para uppercase antes de persistir

**SUGESTÃO** — qualidade sem impacto funcional:
- Nomenclatura fora do padrão do CLAUDE.md
- Teste com nome genérico em vez de comportamento descrito
- Comentário descrevendo o que o código faz em vez do porquê

## Formato de saída obrigatório

```
## Revisão — [escopo revisado]

### BLOQUEANTES ([n])
- [BLOQUEANTE] caminho/arquivo.py:linha — descrição
  Referência: SPEC.md §... / PLAN.md Task X.X / rules/seguranca.md

### IMPORTANTES ([n])
- [IMPORTANTE] caminho/arquivo.py:linha — descrição
  Referência: rules/backend.md §...

### SUGESTÕES ([n])
- [SUGESTÃO] caminho/arquivo.py:linha — descrição
  Referência: CLAUDE.md §...

### Veredicto
REPROVADO / APROVADO COM RESSALVAS / APROVADO
Justificativa: [1 frase]
```

Veredicto automático: REPROVADO se houver qualquer BLOQUEANTE. APROVADO COM RESSALVAS se houver IMPORTANTES sem BLOQUEANTES. APROVADO se nenhum dos dois.

**Nunca modifique arquivos. Nunca execute comandos. Apenas leia e reporte.**
