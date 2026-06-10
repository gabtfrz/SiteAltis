---
description: Recebe a descrição de um erro, faz análise profunda no código para identificar a causa-raiz e produz um relatório estruturado com diagnóstico e proposta de correção. Uso: /Analisar-Bug <descrição do erro>
---

Você vai realizar uma análise profunda de um bug reportado no projeto NODAL.

Bug reportado: **$ARGUMENTS**

---

## Etapa 1 — Leitura de contexto

Leia silenciosamente os arquivos de convenção antes de qualquer investigação:
- `CLAUDE.md` — convenções de código, estrutura de pastas e restrições do projeto
- `.claude/rules/backend.md` — regras de backend
- `.claude/rules/frontend.md` — regras de frontend
- `.claude/rules/seguranca.md` — restrições de segurança
- `.claude/rules/convencoes-gerais.md` — nomenclatura e padrões gerais

---

## Etapa 2 — Mapeamento do erro

Com base na descrição do bug, identifique:

1. **Domínio afetado:** frontend, backend, integração, banco de dados ou configuração
2. **Área de código provável:** qual módulo, arquivo ou função é o ponto de entrada mais próximo do erro
3. **Tipo de erro:** lógico, de integração, de estado, de segurança, de dados ou de configuração

Use Glob e Grep para localizar todos os arquivos relacionados ao domínio afetado. Leia o conteúdo dos arquivos candidatos antes de concluir o mapeamento.

---

## Etapa 3 — Investigação da causa-raiz

Realize uma análise em profundidade seguindo esta ordem:

### 3.1 — Rastrear o fluxo de execução

Siga o caminho completo que o código percorre desde o ponto de entrada (ação do usuário, chamada de API, job agendado) até o ponto de falha. Para cada salto entre arquivos ou camadas, documente:
- Arquivo e linha
- O que é passado entre camadas
- O que poderia estar errado neste ponto

### 3.2 — Verificar contratos entre camadas

Cheque se os contratos entre componentes estão sendo respeitados:
- **Backend:** schemas Pydantic batem com o que o service retorna? O router está levantando HTTPException onde devia? A sessão de banco está sendo gerenciada corretamente?
- **Frontend:** o hook está tratando `loading` e `error`? A resposta da API está no formato esperado pelo componente? O token JWT está sendo enviado corretamente?
- **Integração:** os campos enviados pelo frontend batem com os campos esperados pelo backend?

### 3.3 — Verificar testes existentes

Busque em `Principal/Backend/tests/` e `Principal/Frontend/questionario-perfil/src/__tests__/` por testes que deveriam ter coberto este cenário. Se existirem, leia-os para entender se o teste estava incompleto ou se o bug surgiu depois.

### 3.4 — Identificar a causa-raiz

Com base na investigação, determine:
- **O que exatamente está errado** (linha específica, lógica incorreta, dado ausente, contrato violado)
- **Por que o erro ocorre** (condição que dispara o problema)
- **Por que não foi detectado antes** (ausência de teste, cobertura insuficiente, edge case)

---

## Etapa 4 — Produzir o relatório

Gere o relatório no seguinte formato:

```markdown
# Relatório de Bug — [nome curto descritivo]

**Data:** [data atual]
**Domínio:** [frontend | backend | integração | banco | configuração]
**Severidade:** [CRÍTICO | ALTO | MÉDIO | BAIXO]

---

## Descrição do Erro

[Reprodução exata da descrição fornecida pelo usuário]

## Arquivos Investigados

| Arquivo | Linhas analisadas | Relevância |
|---------|-------------------|------------|
| [caminho] | [ex: 12-45] | [alta/média/baixa] |

## Fluxo de Execução

[Diagrama textual do caminho percorrido pelo código até a falha]
ex: TelaLogin.jsx → api.js:login() → POST /api/auth/login → auth_router.py → auth_service.py:autenticar_usuario()

## Causa-Raiz

**Arquivo:** [caminho exato]
**Linha(s):** [número(s)]
**Diagnóstico:** [explicação técnica precisa do que está errado]
**Condição de disparo:** [quando exatamente o erro ocorre]

## Impacto

[O que mais pode ser afetado por este bug — outros módulos, dados, usuários]

## Cobertura de Testes

- **Teste existente:** [sim — `test_arquivo.py:linha` | não]
- **Lacuna identificada:** [qual cenário não estava coberto]

## Proposta de Correção

### Mudanças necessárias

| Arquivo | Tipo de mudança | Descrição |
|---------|----------------|-----------|
| [caminho] | [criar/editar/deletar] | [o que mudar e por quê] |

### Abordagem recomendada

[Explicação da estratégia de correção — o que mudar, em que ordem, e por que essa abordagem resolve o problema sem introduzir regressão]

### Teste que deve ser escrito

[Nome e comportamento do teste que deve ser criado para cobrir este bug — siga a convenção `test_comportamento_esperado`]

## Riscos da Correção

[O que pode quebrar ao aplicar a correção — listar por área]

## Próximo passo

Para aplicar a correção, execute:
/Corrigir-Bug [cole este relatório completo]
```

**Critérios de severidade:**
- **CRÍTICO:** segurança comprometida, dados corrompidos, sistema inacessível
- **ALTO:** funcionalidade principal quebrada, sem workaround
- **MÉDIO:** funcionalidade degradada, workaround existe
- **BAIXO:** cosmético, edge case improvável, impacto mínimo

---

## Restrições desta análise

- Nunca propor correções que violem `seguranca.md` (sem expor senhas, sem hardcode de credentials, sem alocação percentual de ativos)
- Nunca concluir causa-raiz sem ter lido o código-fonte do arquivo suspeito — hipóteses sem evidência não são diagnóstico
- Se a investigação revelar múltiplos bugs independentes, liste todos no relatório mas foque a proposta de correção no que foi reportado
- Se o arquivo suspeito não existir (bug de funcionalidade não implementada), sinalize isso explicitamente como causa-raiz
