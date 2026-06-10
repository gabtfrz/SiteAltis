---
name: nodal-api-connect
description: Conecta uma tela React do NODAL a um endpoint real do backend — cria a função em src/servicos/api.js, o hook com loading/error e atualiza o componente substituindo dados mockados. Use sempre que precisar integrar frontend ao backend.
---

# Skill: nodal-api-connect

## O que esta skill faz

Dado um componente React e um endpoint backend já funcionando, gera:
1. A função de chamada HTTP em `src/servicos/api.js`
2. O hook React com estados `loading`, `error` e `data`
3. O componente atualizado substituindo mock por dados reais
4. Tratamento automático de 401 (token expirado → redirect para `/login`)

## Quando usar

- Sempre que um agent precisar substituir dados mockados por chamada real
- Ao iniciar qualquer task de frontend das Fases 6 a 8 do PLAN.md
- Quando o output da task descrever adição em `src/servicos/api.js`

## Quando NÃO usar

- Para criar componentes novos do zero sem integração de API
- Para endpoints que ainda não existem no backend (backend deve estar funcionando primeiro)
- Para chamadas que não envolvem autenticação nem dados do servidor

---

## Instruções

Ao receber um pedido de integração, siga esta sequência obrigatória:

### 1. Verificar o endpoint

Confirme que o endpoint backend já responde antes de tocar no frontend:
```bash
# Endpoint autenticado:
curl -X GET http://localhost:8000/api/{rota} \
  -H "Authorization: Bearer {token_de_teste}"

# Endpoint público:
curl -X GET http://localhost:8000/api/{rota}
```

Se o endpoint não responder, **não prossiga** — sinalize ao orquestrador.

### 2. Adicionar a função em `src/servicos/api.js`

Se o arquivo não existir, crie-o com o bloco base primeiro:

```js
// src/servicos/api.js
const BASE_URL = 'http://localhost:8000'

const getToken = () => localStorage.getItem('token')

const headers = (autenticado = true) => ({
  'Content-Type': 'application/json',
  ...(autenticado && { Authorization: `Bearer ${getToken()}` }),
})

const tratar401 = (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }
  return response
}
```

Adicione a função específica do endpoint:

```js
// Para GET autenticado:
export const {nomeDaFuncao} = async () => {
  const response = await fetch(`${BASE_URL}/api/{rota}`, {
    headers: headers(),
  })
  tratar401(response)
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

// Para POST autenticado:
export const {nomeDaFuncao} = async (dados) => {
  const response = await fetch(`${BASE_URL}/api/{rota}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(dados),
  })
  tratar401(response)
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}

// Para POST público (login, cadastro):
export const {nomeDaFuncao} = async (dados) => {
  const response = await fetch(`${BASE_URL}/api/{rota}`, {
    method: 'POST',
    headers: headers(false),
    body: JSON.stringify(dados),
  })
  if (!response.ok) throw new Error(await response.text())
  return response.json()
}
```

> Nomenclatura obrigatória: camelCase, verbo + substantivo (ex: `calcularPerfil`, `obterRecomendacoes`, `adicionarInvestimento`)

### 3. Criar o hook em `src/hooks/use{Nome}.js`

```js
// src/hooks/use{Nome}.js
import { useState, useEffect } from 'react'
import { {nomeDaFuncao} } from '../servicos/api'

export function use{Nome}() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    {nomeDaFuncao}()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error }
}
```

Para hooks com ação (POST/DELETE), use este padrão:

```js
export function use{Nome}() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const executar = async (dados) => {
    setLoading(true)
    setError(null)
    try {
      const resultado = await {nomeDaFuncao}(dados)
      return resultado
    } catch (e) {
      setError(e.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { executar, loading, error }
}
```

### 4. Atualizar o componente

Substitua o import de dados mockados pelo hook:

```jsx
// ANTES (mock):
import { dadosMockados } from '../dados/DadosMockados'

// DEPOIS (real):
import { use{Nome} } from '../hooks/use{Nome}'

// No componente:
const { data, loading, error } = use{Nome}()

if (loading) return <SkeletonLoader />
if (error) return <MensagemErro mensagem={error} />
```

> Regra: nunca renderize `null` silencioso em loading ou erro — sempre mostre feedback visual ao usuário.

### 5. Verificar o fluxo de 401

Confirme que `tratar401` está sendo chamado na função de `api.js` e que o redirect para `/login` ocorre ao expirar o token. Teste manualmente removendo o token do `localStorage` e recarregando a página.

### 6. Remover o import de mock se não for mais usado

Verifique se o arquivo de dados mockados ainda é importado por outros componentes antes de remover o import. Se for o único consumidor, comente a linha com `// TODO: remover após integração completa`.

### 7. Marcar o checkbox no PLAN.md

Encontre a task correspondente no PLAN.md e marque:
```
- [x] teste 1 — descrição
- [x] teste 2 — descrição
```

---

## Exemplo completo

**Input:** "conectar QuestionarioPerfil ao POST /api/perfil/calcular"

**Arquivos modificados/criados:**
```
src/
├── servicos/api.js           ← export const calcularPerfil = async (respostas) => ...
├── hooks/usePerfil.js        ← executar(respostas), loading, error
└── componentes/
    └── QuestionarioPerfil.jsx ← substitui calcularPerfil() local por hook
```

**Fluxo garantido:**
1. Verificar `POST /api/perfil/calcular` respondendo → 200
2. Adicionar `calcularPerfil` em `api.js` com `tratar401`
3. Criar `usePerfil` com `executar`, `loading`, `error`
4. Atualizar `QuestionarioPerfil.jsx`: ao finalizar o questionário, chama `executar(respostas)` → navega para `/painel` em caso de sucesso → exibe erro inline em caso de falha
5. Marcar checkboxes no PLAN.md

---

## Convenções obrigatórias (do CLAUDE.md)

- Funções em `api.js`: camelCase, sempre exportadas com `export const`
- Hooks: prefixo `use` + PascalCase, arquivo em `src/hooks/`
- Estados de loading e error: obrigatórios em toda chamada assíncrona
- Token JWT: sempre lido de `localStorage` via `getToken()`
- 401: sempre limpar token e redirecionar para `/login` — nunca silenciar
- Nunca chamar BRAPI ou Ollama diretamente do frontend
- Nunca expor o token em logs ou console.log em produção
