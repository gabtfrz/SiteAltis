import { useEffect } from 'react'
import gsap from 'gsap'
import useGsap from '../hooks/useGsap'
import styles from './Solucoes.module.css'

const solucoes = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    titulo: 'ERP Empresarial',
    descricao:
      'Sistema integrado de gestão que unifica financeiro, estoque, compras, vendas e RH em uma única plataforma — eliminando retrabalho e erros.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    titulo: 'Gestão de Estoque',
    descricao:
      'Controle total sobre entradas, saídas e movimentações. Alertas de estoque mínimo, rastreabilidade e relatórios em tempo real.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    titulo: 'CRM & Vendas',
    descricao:
      'Gerencie seu pipeline comercial, histórico de clientes e oportunidades em um ambiente centralizado e fácil de usar.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    titulo: 'Business Intelligence',
    descricao:
      'Dashboards e relatórios personalizados que transformam dados em decisões estratégicas. Visualize KPIs em tempo real.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    titulo: 'Nota Fiscal Eletrônica',
    descricao:
      'Emissão de NF-e, NFC-e e CT-e integrada ao sistema fiscal, com conformidade total à legislação e transmissão automática à SEFAZ.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    titulo: 'Suporte Especializado',
    descricao:
      'Time técnico dedicado com atendimento ágil, atualizações constantes e treinamento contínuo para sua equipe.',
  },
]

export default function Solucoes() {
  const escopo = useGsap(() => {
    gsap.from('[data-anim="header"] > *', {
      y: 32,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: escopo.current, start: 'top 75%' },
    })
    gsap.from('[data-anim="card"]', {
      y: 48,
      autoAlpha: 0,
      rotationX: -10,
      transformPerspective: 800,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: escopo.current, start: 'top 60%' },
    })
  })

  // tilt 3D nos cards seguindo o mouse — fora do gsap.context para
  // garantir remoção dos listeners no unmount
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cards = Array.from(escopo.current.querySelectorAll('[data-anim="card"]'))
    const limpezas = cards.map((card) => {
      const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.45, ease: 'power2.out' })
      const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.45, ease: 'power2.out' })
      const elevar = gsap.quickTo(card, 'y', { duration: 0.45, ease: 'power2.out' })

      const aoMover = (e) => {
        const r = card.getBoundingClientRect()
        gsap.set(card, { transformPerspective: 700 })
        rotX(-((e.clientY - r.top) / r.height - 0.5) * 8)
        rotY(((e.clientX - r.left) / r.width - 0.5) * 8)
        elevar(-4)
      }
      const aoSair = () => {
        rotX(0)
        rotY(0)
        elevar(0)
      }
      card.addEventListener('mousemove', aoMover)
      card.addEventListener('mouseleave', aoSair)
      return () => {
        card.removeEventListener('mousemove', aoMover)
        card.removeEventListener('mouseleave', aoSair)
      }
    })
    return () => limpezas.forEach((fn) => fn())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id="solucoes" className={styles.section} ref={escopo}>
      <div className={styles.container}>
        <div className={styles.header} data-anim="header">
          <span className={styles.tag}>Nossas Soluções</span>
          <h2 className={styles.title}>
            Tudo que sua empresa precisa
            <br />
            em <span className={styles.accent}>um só lugar</span>
          </h2>
          <p className={styles.subtitle}>
            Desenvolvemos sistemas sob medida para cada segmento, com foco em
            praticidade, integração e resultados reais para o seu negócio.
          </p>
        </div>

        <div className={styles.grid}>
          {solucoes.map((s) => (
            <div key={s.titulo} className={styles.card} data-anim="card">
              <div className={styles.iconWrap}>{s.icon}</div>
              <h3 className={styles.cardTitle}>{s.titulo}</h3>
              <p className={styles.cardDesc}>{s.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
