---
description: Recebe o relatório do /Analisar-Bug, delega a correção ao orchestrador seguindo TDD e boas práticas, e gera documentação em docs/bugs/. Uso: /Corrigir-Bug <relatório do /Analisar-Bug>
---

Você vai coordenar a correção de um bug no projeto NODAL com base no relatório de análise recebido.

Relatório recebido:
**$ARGUMENTS**

---

## Etapa 1 — Validar o relatório

Leia o relatório e confirme que ele contém:
- Causa-raiz com arquivo e linha identificados
- Proposta de correção com mudanças necessárias
- Teste que deve ser escrito

Se algum desses campos estiver ausente ou vago, **pare aqui** e informe:
```
RELATÓRIO INCOMPLETO: não é possível iniciar a correção.
Faltando: [campo ausente]
Execute /Analisar-Bug novamente com mais detalhes antes de continuar.
```

---

## Etapa 2 — Verificar pré-condições

Antes de qualquer modificação, confirme:
- Os arquivos listados em "Mudanças necessárias" existem (use Glob)
- O domínio afetado (frontend/backend) tem sua estrutura base criada

Se algum arquivo essencial não existir, sinalize antes de continuar.

---

## Etapa 3 — RED (escrever o teste que reproduz o bug)

Escreva o teste descrito no campo "Teste que deve ser escrito" do relatório **antes de qualquer correção**.

Para backend (`Principal/Backend/tests/`):
- Use `fastapi.testclient.TestClient`
- Mock serviços externos com `unittest.mock.patch`
- Nome do teste deve descrever o comportamento: `test_[comportamento_esperado]`
- Estrutura: Arrange / Act / Assert com comentários de seção

Para frontend (`Principal/Frontend/questionario-perfil/src/__tests__/`):
- Use Vitest + Testing Library
- Mock de fetch via `vi.fn()`

Execute o teste e confirme que **falha** com o erro relacionado ao bug:
```bash
# Backend:
cd Principal/Backend && python -m pytest tests/test_{módulo}.py::test_{nome} -v

# Frontend:
cd Principal/Frontend/questionario-perfil && npx vitest run src/__tests__/{Componente}.test.jsx
```

Se o teste passar sem correção, o teste está errado — reescreva antes de continuar.

---

## Etapa 4 — Delegar a correção ao orchestrador

Acione o agent **orchestrador** com o seguinte prompt, preenchido com os dados do relatório:

```
Você é o orchestrador do projeto NODAL.

Corrija o bug identificado no relatório abaixo. Siga as boas práticas do CLAUDE.md e as regras em .claude/rules/.

**Causa-raiz:** [extrair do relatório]
**Arquivos a modificar:** [extrair da tabela "Mudanças necessárias"]
**Abordagem:** [extrair do campo "Abordagem recomendada"]

Regras obrigatórias para a correção:
1. Modifique apenas os arquivos listados em "Mudanças necessárias" — não altere outros arquivos sem justificativa explícita
2. Siga as convenções de nomenclatura do CLAUDE.md (snake_case Python, camelCase JS)
3. Backend: schemas/ → services/ → routers/ — nunca pular camadas
4. Frontend: api.js → hook → componente — nunca fetch inline em componente
5. Nunca retornar senha_hash em nenhum response
6. Nunca hardcodar credentials — ler sempre de config.py
7. Nunca sugerir alocação percentual de ativos em nenhum texto ou campo
8. Sessão de banco via Depends(get_db) — nunca instanciar SessionLocal() diretamente
9. HTTPException apenas nos routers — nunca nos services
10. Todo campo usuario_id deve filtrar por usuário autenticado — nunca retornar dados de outro usuário

Ao finalizar, execute os testes e confirme que o teste escrito na Etapa 3 agora passa.
```

---

## Etapa 5 — GREEN (confirmar que os testes passam)

Após a correção do orchestrador, execute a suite completa do módulo afetado:

```bash
# Backend:
cd Principal/Backend && python -m pytest tests/ -v

# Frontend:
cd Principal/Frontend/questionario-perfil && npx vitest run
```

Se algum teste falhar:
- Verifique se é regressão causada pela correção
- Se sim, corrija antes de avançar — não deixe testes quebrando

---

## Etapa 6 — Gerar documentação do bug

Crie o arquivo de documentação em `docs/bugs/` com o seguinte formato:

**Nome do arquivo:** `docs/bugs/[YYYY-MM-DD]-[nome-curto-kebab-case].md`

```markdown
# Bug Report — [nome curto descritivo]

**Data de descoberta:** [data do relatório de análise]
**Data de correção:** [data atual]
**Domínio:** [frontend | backend | integração | banco | configuração]
**Severidade:** [CRÍTICO | ALTO | MÉDIO | BAIXO]
**Status:** CORRIGIDO

---

## Descrição do Problema

[Reprodução da descrição original do usuário]

## Causa-Raiz

**Arquivo:** [caminho exato]
**Linha(s):** [número(s)]
**Diagnóstico:** [explicação técnica precisa]
**Condição de disparo:** [quando o erro ocorria]

## Solução Implementada

### Arquivos modificados

| Arquivo | Tipo de mudança | Descrição |
|---------|----------------|-----------|
| [caminho] | [criado/editado/deletado] | [o que foi feito] |

### Decisão técnica

[Por que esta abordagem foi escolhida em vez de alternativas — registro para decisões não óbvias]

## Teste de Regressão

**Arquivo de teste:** [caminho]
**Nome do teste:** `test_[nome]`
**O que o teste verifica:** [comportamento coberto]

## Lições Aprendidas

[O que este bug revela sobre pontos de atenção no projeto — útil para evitar bugs similares]
```

Crie o diretório `docs/bugs/` se não existir.

---

## Etapa 7 — Revisão final

Execute `/review` para auditar os arquivos modificados contra o SPEC.md e o PLAN.md.

Se o veredicto for **REPROVADO**, liste os BLOQUEANTES e corrija antes de encerrar.
Se for **APROVADO COM RESSALVAS**, liste os IMPORTANTES para decisão do usuário.

---

## Restrições deste command

- Nunca modificar SPEC.md, CLAUDE.md ou PLAN.md como parte da correção
- Nunca pular a etapa RED — o teste que reproduz o bug deve ser escrito antes de qualquer correção
- Nunca aplicar correções que violem as regras de segurança (`seguranca.md`)
- Nunca fechar o processo sem o documento em `docs/bugs/` criado
- Se a correção envolver mudança de schema de banco de dados, avisar o usuário sobre necessidade de migração antes de prosseguir
