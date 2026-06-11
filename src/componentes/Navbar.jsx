import { useState, useEffect } from 'react'
import gsap from 'gsap'
import useGsap from '../hooks/useGsap'
import styles from './Navbar.module.css'

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Soluções', href: '#solucoes' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Diferenciais', href: '#diferenciais' },
  { label: 'Contato', href: '#contato' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const escopo = useGsap(() => {
    // clearProps obrigatório: transform inline no nav viraria containing
    // block do menu mobile (position: fixed)
    gsap.from(escopo.current, {
      y: -24,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power3.out',
      clearProps: 'all',
    })
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`} ref={escopo}>
      <div className={styles.container}>
        <a href="#inicio" className={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}logoHeaderFooter.png`} alt="Altis Sistemas" className={styles.brandImg} />
        </a>

        <ul className={`${styles.links} ${menuOpen ? styles.open : ''}`}>
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className={styles.link} onClick={handleLinkClick}>
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a href="#contato" className={styles.ctaBtn} onClick={handleLinkClick}>
              Fale Conosco
            </a>
          </li>
        </ul>

        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menu"
        >
          <span className={`${styles.bar} ${menuOpen ? styles.barTop : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barMid : ''}`} />
          <span className={`${styles.bar} ${menuOpen ? styles.barBot : ''}`} />
        </button>
      </div>
    </nav>
  )
}
