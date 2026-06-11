import { lazy, Suspense } from 'react'
import gsap from 'gsap'
import useGsap, { animarContadores } from '../hooks/useGsap'
import styles from './Hero.module.css'

// three.js fica em chunk separado — a cena é decorativa e não pode
// atrasar o carregamento do conteúdo
const Hero3D = lazy(() => import('./Hero3D'))

export default function Hero() {
  const escopo = useGsap(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.from('[data-anim="badge"]', { y: 24, autoAlpha: 0, duration: 0.6 })
      .from('[data-anim="titulo"]', { y: 44, autoAlpha: 0, duration: 0.8 }, '-=0.35')
      .from('[data-anim="subtitulo"]', { y: 28, autoAlpha: 0, duration: 0.7 }, '-=0.55')
      .from('[data-anim="acoes"]', { y: 20, autoAlpha: 0, duration: 0.6 }, '-=0.5')
      .from('[data-anim="stats"]', { y: 20, autoAlpha: 0, duration: 0.6 }, '-=0.45')
      .from('[data-anim="visual"]', { x: 48, autoAlpha: 0, duration: 0.9 }, '-=0.75')

    animarContadores(escopo.current, { delay: 0.9, duration: 1.8 })

    // parallax sutil do card de módulos enquanto o hero sai de cena
    gsap.to('[data-anim="visual"]', {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: escopo.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })
  })

  return (
    <section id="inicio" className={styles.hero} ref={escopo}>
      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.badge} data-anim="badge">
            <span className={styles.badgeDot} />
            Tecnologia para empresas que crescem
          </div>

          <h1 className={styles.title} data-anim="titulo">
            Sistemas que
            <br />
            <span className={styles.accent}>transformam</span>
            <br />
            seu negócio
          </h1>

          <p className={styles.subtitle} data-anim="subtitulo">
            A Altis Sistemas desenvolve soluções tecnológicas personalizadas — ERP,
            automação de processos e suporte especializado — para que sua empresa
            opere com mais eficiência e competitividade.
          </p>

          <div className={styles.actions} data-anim="acoes">
            <a href="#contato" className={styles.btnPrimary}>
              Falar com o Comercial
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#solucoes" className={styles.btnSecondary}>
              Conhecer Soluções
            </a>
          </div>

          <div className={styles.stats} data-anim="stats">
            <div className={styles.stat}>
              <span className={styles.statNum} data-contador="107">107</span>
              <span className={styles.statLabel}>Empresas atendidas</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum} data-contador="7" data-sufixo="+">7+</span>
              <span className={styles.statLabel}>Anos no mercado</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum} data-contador="400" data-sufixo="+">400+</span>
              <span className={styles.statLabel}>Usuários ativos</span>
            </div>
          </div>
        </div>

        <div className={styles.visual} data-anim="visual">
          <FeatureHighlights />
        </div>
      </div>

      <a href="#solucoes" className={styles.scrollDown} aria-label="Rolar para baixo">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </a>
    </section>
  )
}

const features = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    nome: 'ERP Empresarial',
    desc: 'Financeiro, estoque, RH e compras em uma única plataforma integrada.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    nome: 'Gestão de Estoque',
    desc: 'Controle de entradas, saídas e alertas de reposição em tempo real.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    nome: 'CRM & Vendas',
    desc: 'Pipeline comercial e histórico de clientes centralizados.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    nome: 'Nota Fiscal Eletrônica',
    desc: 'NF-e, NFC-e e CT-e com transmissão automática à SEFAZ.',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    nome: 'Business Intelligence',
    desc: 'Dashboards e KPIs estratégicos gerados a partir dos seus dados.',
  },
]

function FeatureHighlights() {
  return (
    <div className={styles.features}>
      <div className={styles.featuresHeader}>
        <span>Módulos inclusos</span>
        <a href="#solucoes" className={styles.featuresLink}>Ver todos →</a>
      </div>
      {features.map(f => (
        <div key={f.nome} className={styles.featureItem}>
          <div className={styles.featureIcon}>{f.icon}</div>
          <div>
            <strong className={styles.featureName}>{f.nome}</strong>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
