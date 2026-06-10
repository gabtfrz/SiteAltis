import styles from "./Sobre.module.css";

const metricas = [
  { num: "107", label: "Empresas atendidas" },
  { num: "7+", label: "Anos de mercado" },
  { num: "400+", label: "Usuários ativos" },
  { num: "Seg-Sab", label: "Suporte Humanizado" },
];

export default function Sobre() {
  return (
    <section id="sobre" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.visual}>
          <div className={styles.metricGrid}>
            {metricas.map((m) => (
              <div key={m.label} className={styles.metricCard}>
                <span className={styles.metricNum}>{m.num}</span>
                <span className={styles.metricLabel}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.content}>
          <span className={styles.tag}>Quem Somos</span>
          <h2 className={styles.title}>
            Tecnologia com
            <br />
            <span className={styles.accent}>propósito real</span>
          </h2>
          <p className={styles.text}>
            A Altis Sistemas nasceu com uma missão clara: tornar a tecnologia
            acessível e eficiente para empresas de todos os portes. Em mais de
            15 anos de atuação, construímos uma trajetória sólida desenvolvendo
            soluções de gestão que geram resultado de verdade.
          </p>
          <p className={styles.text}>
            Nossa equipe é formada por especialistas em tecnologia, finanças e
            operações — comprometidos em entender o seu negócio e entregar
            sistemas que realmente funcionam no dia a dia.
          </p>

          <div className={styles.pillars}>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00d4c8"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <strong>Confiabilidade</strong>
                <p>Sistemas estáveis com suporte contínuo</p>
              </div>
            </div>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00d4c8"
                  strokeWidth="2.5"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <strong>Qualidade</strong>
                <p>Desenvolvimento rigoroso e testado</p>
              </div>
            </div>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00d4c8"
                  strokeWidth="2.5"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <strong>Parceria</strong>
                <p>Relacionamento de longo prazo com clientes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
