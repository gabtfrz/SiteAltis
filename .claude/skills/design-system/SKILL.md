---
name: design-system
description: Identidade visual do site institucional da Altis Sistemas — empresa de ERP e gestão empresarial baseada em Goiânia/GO. Use ao criar ou revisar componentes visuais do site para garantir consistência com a marca.
---

# Design System — Altis Sistemas

> Site institucional da Altis Sistemas (altissistemas.com.br) — empresa de ERP, automação e gestão empresarial.

---

## Paleta de Cores

```css
/* Fundo */
--navy:       #0a0e1a;   /* fundo principal de página */
--navy-light: #0f1628;   /* fundo de cards e seções alternadas */
--navy-card:  #0c1220;   /* fundo de cards mais escuros (ex: mockup ERP) */

/* Acento — usado com parcimônia */
--cyan:       #00d4c8;   /* cor da marca: ícones, links ativos, destaques pontuais */
--blue:       #0066cc;   /* azul complementar: gradientes de botões, links */
--blue-light: #0080ff;   /* variante mais clara do azul */

/* Texto */
--white:      #ffffff;   /* títulos principais */
--gray:       #8892a4;   /* corpo de texto, subtítulos */
--gray-light: #b0bac8;   /* texto secundário, labels */

/* Bordas */
--border:           rgba(0, 212, 200, 0.12);  /* borda padrão de cards */
--border-hover:     rgba(0, 212, 200, 0.30);  /* borda de cards no hover */
--border-subtle:    rgba(255, 255, 255, 0.06); /* divisores internos */
```

### Uso correto das cores

- **Cyan (#00d4c8)** → ícones, link active, tag de seção, badge de destaque. Nunca em blocos grandes de fundo.
- **Gradiente cyan→blue** → apenas em botões CTA primários e no título Hero. Não repetir em todos os h2.
- **Fundo navy** → a cor base; evitar sobrepor glow blobs radiais ou grades de pontos (parecem sites de IA).
- **Texto branco** → apenas títulos. Corpo de texto usa `--gray`.

---

## Tipografia

```css
--font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

/* Escala */
--text-xs:   0.72rem;   /* 11–12px — labels de tabela, badges */
--text-sm:   0.85rem;   /* 13–14px — legendas, metadata */
--text-base: 1rem;      /* 16px — corpo de texto padrão */
--text-lg:   1.1rem;    /* corpo destacado, parágrafos de seção */
--text-xl:   1.25rem;   /* subtítulos de card */

/* Títulos */
/* h1 hero:    clamp(2.8rem, 5vw, 4rem), weight 900, letter-spacing -0.02em */
/* h2 seção:   clamp(2rem, 4vw, 2.75rem), weight 800, letter-spacing -0.02em */
/* h3 card:    1.05rem–1.15rem, weight 700 */
```

---

## Botões

```css
/* Primário — único uso do gradiente */
.btn-primary {
  background: linear-gradient(135deg, #00d4c8, #0066cc);
  color: #fff;
  font-weight: 700;
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 212, 200, 0.22);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 212, 200, 0.32);
}

/* Secundário — outline simples */
.btn-secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.15);
  padding: 0.875rem 1.75rem;
  border-radius: 10px;
  transition: border-color 0.2s, background 0.2s;
}
.btn-secondary:hover {
  border-color: rgba(0, 212, 200, 0.35);
  background: rgba(0, 212, 200, 0.05);
}
```

---

## Cards

```css
.card {
  background: #0f1628;
  border: 1px solid rgba(0, 212, 200, 0.10);
  border-radius: 16px;
  padding: 2rem;
  transition: border-color 0.25s, transform 0.25s;
}
.card:hover {
  border-color: rgba(0, 212, 200, 0.30);
  transform: translateY(-3px);
}
/* NÃO usar box-shadow com glow colorido no hover — parece AI site */
```

---

## Seções

```css
/* Padding padrão entre seções */
section { padding: 6rem 0; }

/* Separador entre seções: linha sutil sólida, não gradiente colorido */
section::before {
  content: '';
  height: 1px;
  background: rgba(255, 255, 255, 0.06); /* sólido, não gradiente teal */
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
```

---

## Tags de seção

```css
/* Tag de identificação de seção */
.tag {
  color: #00d4c8;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-bottom: 2px solid #00d4c8;
  padding-bottom: 4px;
}
/* Uma tag por seção. Não transformar todo h2 em texto gradiente. */
```

---

## Regras anti-AI

Padrões a **evitar** para não parecer site gerado por IA:

- ❌ Blobs radiais de glow no fundo (`radial-gradient` decorativo)
- ❌ Grade de pontos ou linhas como overlay de fundo
- ❌ Animação `float` em elementos decorativos
- ❌ Texto gradiente em **todos** os títulos de seção — usar gradiente apenas no Hero
- ❌ Numeração "01/02/03/04" em listas de diferenciais
- ❌ Badges flutuando sobre cards com `position: absolute` para mostrar "certificações" genéricas
- ❌ SVG decorativo genérico (hex grids, partículas, ondas) sem relação com o produto
- ✅ Usar mockup visual do produto real (dashboard ERP) quando precisar de elemento visual
- ✅ Variar o layout entre seções (não todas seguir badge→h2→subtitle→grid)
- ✅ Gradiente apenas no botão CTA e no título Hero (dois lugares, não em tudo)
