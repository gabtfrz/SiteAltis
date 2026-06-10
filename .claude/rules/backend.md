---
description: Padrões específicos para arquivos Python do backend FastAPI — aplicado automaticamente ao editar Principal/Backend/**/*.py.
globs: Principal/Backend/**/*.py
alwaysApply: false
---

**Sessão do banco**
- Nunca instanciar `SessionLocal()` diretamente em router ou service — sempre receber `db: Session` via `Depends(get_db)`
- Nunca usar `db.commit()` fora do router — services recebem a sessão mas não fazem commit (responsabilidade do router)

**Isolamento de dados**
- Todo query em tabela com `usuario_id` deve filtrar por `usuario_id` do token — nunca retornar dados de outro usuário
- DELETE retorna 404 (não 403) quando o recurso não pertence ao usuário autenticado — não confirmar existência

**Separação de camadas**
- Services nunca importam `fastapi` — sem `HTTPException`, sem `Request`, sem `Depends` em `services/`
- HTTPException é levantada apenas nos routers, nunca nos services
- `config.py` é a única fonte de variáveis de ambiente — nunca `os.getenv()` direto em outro arquivo

**Campos e tipos**
- `ticker` normalizado para uppercase antes de persistir — fazer no service, não no router
- Campos de data/hora: sempre `DateTime(timezone=False)` com `server_default=func.now()`
- `dividend_yield` e `preco_atual`: `Float`, nunca `String`
