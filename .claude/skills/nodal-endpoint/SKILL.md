---
name: nodal-endpoint
description: Gera o conjunto completo de um endpoint FastAPI para o projeto NODAL — schema Pydantic, router, service e teste pytest — seguindo as convenções do CLAUDE.md. Use sempre que precisar criar um novo módulo de rota.
---

# Skill: nodal-endpoint

## O que esta skill faz

Dado um endpoint a ser criado (método HTTP + rota + domínio), gera automaticamente os 4 arquivos obrigatórios na estrutura correta do backend, com testes escritos antes da implementação (RED → GREEN).

## Quando usar

- Sempre que um agent precisar criar um novo endpoint FastAPI
- Ao iniciar qualquer task de backend das Fases 2 a 8 do PLAN.md
- Quando o output da task descrever `routers/`, `schemas/` ou `services/`

## Quando NÃO usar

- Para modificar endpoints já existentes (edite os arquivos diretamente)
- Para endpoints de saúde ou utilitários sem lógica de negócio
- Para tasks exclusivamente de frontend

---

## Instruções

Ao receber um pedido de criação de endpoint, siga esta sequência obrigatória:

### 1. Identificar os 4 componentes

A partir do método + rota fornecidos, determine:
- **Domínio**: o segmento após `/api/` (ex: `auth`, `perfil`, `acoes`)
- **Schema de entrada** (se POST ou PUT): nome em PascalCase + sufixo `Request` ou `Criar`
- **Schema de saída**: nome em PascalCase + sufixo `Response`
- **Função de serviço**: nome em snake_case descrevendo a ação

### 2. Escrever o teste PRIMEIRO (RED)

Crie `Principal/Backend/tests/test_{domínio}.py` com o teste que vai **falhar** antes da implementação:

```python
# tests/test_{domínio}.py
from fastapi.testclient import TestClient
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from main import app

client = TestClient(app)

def test_{nome_do_comportamento}():
    # Arrange: monte o body e headers necessários
    # Act: faça a chamada HTTP
    # Assert: verifique status_code e estrutura do response
    ...
```

Confirme que o teste **falha** antes de escrever qualquer implementação.

### 3. Criar o schema (`schemas/{domínio}.py`)

```python
# schemas/{domínio}.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class {Nome}Request(BaseModel):
    # campos de entrada com tipos explícitos
    ...

class {Nome}Response(BaseModel):
    # campos de saída — nunca inclua senha_hash
    ...

    class Config:
        from_attributes = True
```

### 4. Criar o service (`services/{domínio}_service.py`)

```python
# services/{domínio}_service.py
from sqlalchemy.orm import Session
from models.models import {Model}
from schemas.{domínio} import {Nome}Request

def {nome_da_funcao}(dados: {Nome}Request, db: Session) -> {Model}:
    # lógica de negócio aqui
    # sem lógica HTTP — sem HTTPException neste arquivo
    ...
```

> Regra: services nunca importam FastAPI. Só SQLAlchemy, models e schemas.

### 5. Criar o router (`routers/{domínio}.py`)

```python
# routers/{domínio}.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from schemas.{domínio} import {Nome}Request, {Nome}Response
from services.{domínio}_service import {nome_da_funcao}

router = APIRouter(prefix="/api/{domínio}", tags=["{domínio}"])

@router.{método}("/")
def {nome_do_endpoint}(
    dados: {Nome}Request,
    db: Session = Depends(get_db)
) -> {Nome}Response:
    ...
```

### 6. Registrar o router em `main.py`

```python
# main.py — adicionar:
from routers.{domínio} import router as {domínio}_router
app.include_router({domínio}_router)
```

### 7. Confirmar GREEN

Execute os testes e confirme que passam:
```bash
cd Principal/Backend
pytest tests/test_{domínio}.py -v
```

### 8. Marcar o checkbox no PLAN.md

Encontre a task correspondente no PLAN.md e marque:
```
- [x] teste 1 — descrição
- [x] teste 2 — descrição
```

---

## Exemplo completo

**Input:** "criar endpoint POST /api/auth/cadastro"

**Domínio:** `auth`
**Schema entrada:** `CadastroRequest` (email: str, senha: str)
**Schema saída:** `UsuarioResponse` (id: int, email: str)
**Service:** `cadastrar_usuario(dados, db)`

**Arquivos gerados:**
```
Principal/Backend/
├── tests/test_auth.py          ← escrito primeiro, falha antes da impl
├── schemas/auth.py             ← CadastroRequest, UsuarioResponse
├── services/auth_service.py    ← cadastrar_usuario(), hash_senha()
└── routers/auth.py             ← POST /api/auth/cadastro
```

**Ordem garantida:** teste RED → schema → service → router → teste GREEN → checkbox PLAN.md

---

## Convenções obrigatórias (do CLAUDE.md)

- Arquivos Python: `snake_case` (ex: `auth_service.py`, `perfil.py`)
- Funções e variáveis Python: `snake_case`
- Classes Pydantic: `PascalCase`
- Prefixo de rota: sempre `/api/{domínio}/`
- Pydantic obrigatório em todos os schemas — nunca retornar model ORM diretamente
- Nunca expor `senha_hash` em nenhum response
- Nunca sugerir alocação percentual de ativos em nenhum endpoint
