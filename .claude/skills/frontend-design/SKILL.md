---
name: frontend-design
description: Guia de implementação de componentes React para o site da Altis Sistemas usando CSS Modules. Use junto com design-system ao criar ou modificar qualquer componente visual.
---

# Frontend Design — Altis Sistemas

> Como traduzir o design system da Altis em componentes React + CSS Modules.

Sempre use em conjunto com `.claude/skills/design-system/SKILL.md`.

---

## Tecnologia

- **React** (sem Tailwind, sem Framer Motion)
- **CSS Modules** — cada componente tem seu `.module.css`
- **Inter** carregada globalmente via `src/index.css`
- Variáveis CSS definidas em `src/index.css` no `:root`

---

## Estrutura de componentes

```
src/
  componentes/
    NomeComponente.jsx        ← JSX do componente
    NomeComponente.module.css ← estilos isolados
  index.css                   ← variáveis globais + reset
  App.jsx                     ← composição de seções
```

---

## Padrões de implementação

### Botão CTA primário

```jsx
<a href="#contato" className={styles.btnPrimary}>
  Falar com o Comercial
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
</a>
```

```css
.btnPrimary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #00d4c8, #0066cc);
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 700;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 24px rgba(0, 212, 200, 0.22);
}
.btnPrimary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 212, 200, 0.32);
}
```

### Card de solução/módulo

```jsx
<div className={styles.card}>
  <div className={styles.iconWrap}>{icon}</div>
  <h3 className={styles.cardTitle}>{titulo}</h3>
  <p className={styles.cardDesc}>{descricao}</p>
</div>
```

```css
.card {
  background: #0f1628;
  border: 1px solid rgba(0, 212, 200, 0.10);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: border-color 0.25s, transform 0.25s;
}
.card:hover {
  border-color: rgba(0, 212, 200, 0.30);
  transform: translateY(-3px);
}
/* Sem box-shadow colorido no hover */

.iconWrap {
  width: 48px;
  height: 48px;
  background: rgba(0, 212, 200, 0.08);
  border: 1px solid rgba(0, 212, 200, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00d4c8;
}
```

### Tag de seção

```jsx
<span className={styles.tag}>Nossas Soluções</span>
```

```css
.tag {
  display: inline-block;
  color: #00d4c8;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-bottom: 2px solid #00d4c8;
  padding-bottom: 4px;
}
```

### Título de seção (sem gradiente)

```jsx
<h2 className={styles.title}>
  O que nos diferencia
  <br />
  <span className={styles.accent}>da concorrência</span>
</h2>
```

```css
/* Gradiente apenas em 1–2 seções de destaque. No restante: solid */
.title { color: #fff; font-weight: 800; }
.accent { color: #00d4c8; } /* solid, sem gradiente */

/* Exceção — Hero e 1 seção de destaque podem usar gradiente */
.accentGradient {
  background: linear-gradient(135deg, #00d4c8, #0080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Regras de implementação

- **CSS Modules** — sempre `import styles from './Componente.module.css'`, nunca style inline ou classes globais
- **Variáveis CSS** — usar `var(--navy)`, `var(--cyan)`, etc. definidas em `index.css` sempre que possível
- **Imagens** — referenciar de `/public/` com path absoluto: `src="/logo.png"`
- **Responsividade** — breakpoints em cada `.module.css`; ponto de quebra principal: `@media (max-width: 900px)`
- **Ícones** — SVG inline, sempre com `stroke="currentColor"` para herdar cor do pai
- **Hover** — transição de `border-color` + `transform: translateY(-Npx)` nos cards. Nunca mudar `background-color` abruptamente.
- **Separadores de seção** — usar `::before` com `background: rgba(255,255,255,0.06)` (sólido) em vez de gradiente teal

---

## Anti-patterns (não usar)

```css
/* ❌ Blob de glow decorativo */
.glow {
  background: radial-gradient(circle, rgba(0,212,200,0.18) 0%, transparent 65%);
}

/* ❌ Grade de pontos como fundo */
.grid {
  background-image: linear-gradient(rgba(0,212,200,0.04) 1px, transparent 1px), ...;
}

/* ❌ Animação de flutuação */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* ❌ Gradiente em todos os títulos */
.accent {
  background: linear-gradient(135deg, #00d4c8, #0080ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
/* Usar apenas no Hero e em 1 outro destaque. */
```
