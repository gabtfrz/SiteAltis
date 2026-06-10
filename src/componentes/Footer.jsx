import styles from './Footer.module.css'

export default function Footer() {
  const ano = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <img src="/logoHeaderFooter.png" alt="Altis Sistemas" className={styles.brandImg} />
          <p className={styles.tagline}>
            Tecnologia que transforma negócios.
          </p>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navGroup}>
            <span className={styles.navTitle}>Produto</span>
            <a href="#solucoes">ERP Empresarial</a>
            <a href="#solucoes">Gestão de Estoque</a>
            <a href="#solucoes">CRM & Vendas</a>
            <a href="#solucoes">Business Intelligence</a>
          </div>
          <div className={styles.navGroup}>
            <span className={styles.navTitle}>Empresa</span>
            <a href="#sobre">Quem somos</a>
            <a href="#diferenciais">Diferenciais</a>
            <a href="#contato">Contato</a>
          </div>
          <div className={styles.navGroup}>
            <span className={styles.navTitle}>Contato</span>
            <a href="mailto:comercial@altissistemas.com.br">
              comercial@altissistemas.com.br
            </a>
            <a href="https://wa.me/5562963938760">(62) 9639-3876</a>
            <a
              href="https://maps.google.com/?q=R.+Niterói,+Parque+Amazônia,+Goiânia,+GO"
              target="_blank"
              rel="noopener noreferrer"
            >
              Goiânia — GO
            </a>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <span>© {ano} Altis Sistemas. Todos os direitos reservados.</span>
        <div className={styles.legal}>
          <a href="#">Política de Privacidade</a>
          <a href="#">Termos de Uso</a>
        </div>
      </div>
    </footer>
  )
}
