---
description: Padrões de nomenclatura e estrutura universais do projeto NODAL — valem para todos os agents e arquivos.
alwaysApply: true
---

**Nomenclatura**
- Arquivos Python: `snake_case.py` — ex: `auth_service.py`, `perfil.py`
- Arquivos React: `PascalCase.jsx` para componentes, `camelCase.js` para utilitários e dados
- Variáveis e funções Python: `snake_case`
- Variáveis e funções JS/JSX: `camelCase`
- Classes Pydantic e React: `PascalCase`

**Backend**
- Prefixo de rota obrigatório: `/api/{domínio}/` — nunca `/v1/`, nunca sem prefixo
- Pydantic obrigatório em todos os schemas de entrada e saída — nunca retornar model ORM diretamente
- Valores válidos para `perfil_compativel` e perfil calculado: `"Conservador"`, `"Moderado"`, `"Agressivo"`, `"Sofisticado"` — exatamente assim, com acento e maiúscula

**Frontend**
- Todo fetch ao backend passa por `src/servicos/api.js` — nunca `fetch()` inline em componente
- Hooks customizados ficam em `src/hooks/` com prefixo `use`
- Componentes reutilizáveis em `src/componentes/`, wrappers de rota em `src/paginas/`

**Geral**
- Faixas de pontuação do perfil: 7–11 Conservador, 12–16 Moderado, 17–22 Agressivo, 23–28 Sofisticado
- `ticker` sempre armazenado e comparado em uppercase
