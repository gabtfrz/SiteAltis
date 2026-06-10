---
description: Padrões específicos para arquivos React do frontend — aplicado automaticamente ao editar Principal/Frontend/questionario-perfil/src/**.
globs: Principal/Frontend/questionario-perfil/src/**
alwaysApply: false
---

**Chamadas de API**
- Token JWT sempre lido via `getToken()` de `src/servicos/api.js` — nunca `localStorage.getItem('token')` inline em componente
- Resposta 401 sempre limpa o token e redireciona para `/login` — nunca silenciar 401
- Estados `loading` e `error` são obrigatórios em todo hook que faz fetch — nunca renderizar `null` silencioso

**Componentes**
- Skeleton loader deve ter estrutura visual idêntica ao componente real (mesmas dimensões) — evita layout shift
- `TemaContexto.jsx` não deve ser modificado por agents de integração — é infraestrutura de tema
- `useReducer` em `QuestionarioPerfil.jsx` deve ser mantido — não converter para `useState` múltiplos

**Dados mockados**
- Arquivos em `src/dados/` são substituídos gradualmente pela integração real — nunca deletar antes do endpoint correspondente estar funcionando
- `PerguntasQuestionario.js` nunca é substituído — contém lógica de peso usada também nos testes

**Animações**
- Duração padrão Framer Motion do projeto: `320ms` — não alterar transições existentes ao adicionar novas
- `AnimatePresence` obrigatório em componentes que montam/desmontam na mesma rota
