---
description: Padrões obrigatórios para escrita de testes — aplicado automaticamente ao editar arquivos em tests/ ou __tests__/.
globs: Principal/Backend/tests/**,Principal/Frontend/questionario-perfil/src/__tests__/**
alwaysApply: false
---

**Ordem obrigatória**
- Escrever o teste antes da implementação (RED) — confirmar que falha antes de escrever o código de produção
- Nunca escrever teste que passa sem a implementação existir — isso não é TDD, é documentação

**Mocks**
- Chamadas à BRAPI: sempre mockadas com `unittest.mock.patch` — nunca chamar a API real em teste
- Chamadas ao Ollama: sempre mockadas — nunca depender do serviço local estar rodando para o teste passar
- Banco de dados nos testes de backend: usar banco de teste isolado ou `TestClient` com override de `get_db`

**Nomenclatura e estrutura**
- Arquivo de teste espelha o arquivo de produção: `auth_service.py` → `test_auth.py`; `TelaLogin.jsx` → `TelaLogin.test.jsx`
- Nome do teste descreve comportamento: `test_login_com_senha_errada_retorna_401` — nunca `test_1`, `test_login`
- Estrutura Arrange / Act / Assert — um bloco por seção, sem misturar

**Cobertura**
- Mínimo 80% sobre lógica de negócio: cálculo de perfil, filtragem de recomendações, auth, isolamento de dados
- Componentes puramente visuais (sem lógica) ficam abaixo da linha — não testar CSS ou layout
- Todo caso de erro do PLAN.md tem teste correspondente — erros são cidadãos de primeira classe
