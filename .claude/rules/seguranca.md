---
description: Restrições de segurança que valem para qualquer agent em qualquer arquivo do projeto NODAL.
alwaysApply: true
---

- Nunca retornar o campo `senha_hash` em nenhum response — nem em debug, nem em logs
- Nunca logar tokens JWT, senhas ou valores de variáveis de ambiente
- Nunca hardcodar `SECRET_KEY`, `BRAPI_TOKEN` ou qualquer credencial no código — sempre ler de `config.py`
- Nunca chamar `https://brapi.dev` ou `http://localhost:11434` diretamente do frontend — toda chamada a serviços externos passa pelo backend FastAPI
- Nunca sugerir alocação percentual de ativos em nenhum campo, resposta de API, texto de IA ou componente de UI — isso caracteriza consultoria de investimentos (vedada pela CVM sem habilitação)
- Nunca implementar endpoints de compra, venda ou execução de ordens — o sistema é exclusivamente de recomendação informativa
- Nunca modificar SPEC.md, CLAUDE.md ou PLAN.md durante implementação
- `is_admin` deve ser verificado no token JWT do backend — nunca confiar em flag enviada pelo cliente no body da requisição
