import gsap from 'gsap'
import useGsap from '../hooks/useGsap'
import styles from './Diferenciais.module.css'

const items = [
  {
    titulo: 'Implementação rápida',
    desc: 'Colocamos seu sistema no ar em semanas, não meses, com migração de dados assistida e treinamento incluído.',
  },
  {
    titulo: 'Personalização real',
    desc: 'Adaptamos o sistema à sua operação — não o contrário. Cada módulo é ajustado às necessidades do seu negócio.',
  },
  {
    titulo: 'Suporte humano',
    desc: 'Atendimento por pessoas reais que conhecem seu sistema. Sem filas de ticket infinitas ou bots sem solução.',
  },
  {
    titulo: 'Atualizações constantes',
    desc: 'Seu sistema evolui junto com a legislação e o mercado, sem custo adicional de licença para as atualizações inclusas.',
  },
]

export default function Diferenciais() {
  const escopo = useGsap(() => {
    gsap.from('[data-anim="header"] > *', {
      y: 32,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: escopo.current, start: 'top 75%' },
    })
    gsap.from('[data-anim="item"]', {
      y: 40,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: escopo.current, start: 'top 60%' },
    })
    gsap.from('[data-anim="cta"]', {
      y: 48,
      autoAlpha: 0,
      scale: 0.97,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: escopo.current.querySelector('[data-anim="cta"]'),
        start: 'top 85%',
      },
    })
  })

  return (
    <section id="diferenciais" className={styles.section} ref={escopo}>
      <div className={styles.container}>
        <div className={styles.header} data-anim="header">
          <span className={styles.tag}>Por que a Altis</span>
          <h2 className={styles.title}>
            O que nos diferencia
            <br />
            da concorrência
          </h2>
        </div>

        <div className={styles.grid}>
          {items.map(item => (
            <div key={item.titulo} className={styles.item} data-anim="item">
              <div className={styles.check}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <div className={styles.itemBody}>
                <h3 className={styles.itemTitle}>{item.titulo}</h3>
                <p className={styles.itemDesc}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cta} data-anim="cta">
          <div className={styles.ctaInner}>
            <div className={styles.ctaContent}>
              <h3 className={styles.ctaTitle}>
                Pronto para modernizar sua gestão?
              </h3>
              <p className={styles.ctaText}>
                Fale com nosso time comercial e receba uma proposta
                personalizada sem compromisso.
              </p>
              <a href="#contato" className={styles.ctaBtn}>
                Solicitar demonstração gratuita
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
