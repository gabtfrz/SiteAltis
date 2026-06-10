import styles from "./Contato.module.css";

const canais = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.107 1.51 5.833L.057 23.428a.75.75 0 0 0 .918.943l5.78-1.516A11.95 11.95 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.52-5.157-1.424l-.36-.215-3.733.979.997-3.645-.236-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
    titulo: "WhatsApp Comercial",
    descricao:
      "Fale direto com nosso time de vendas. Resposta rápida em horário comercial.",
    acao: "(62) 99639-3876",
    href: "https://wa.me/5562996393876",
    cor: "#25D366",
    label: "Abrir WhatsApp",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    titulo: "E-mail Comercial",
    descricao: "Envie sua dúvida ou solicitação de proposta por e-mail.",
    acao: "comercial@altissistemas.com.br",
    href: "mailto:comercial@altissistemas.com.br",
    cor: "#00d4c8",
    label: "Enviar e-mail",
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    titulo: "Localização",
    descricao: "Atendemos presencialmente e em todo o território nacional.",
    acao: "R. Niterói, Parque Amazônia\nGoiânia — GO, 74843-160",
    href: "https://maps.google.com/?q=R.+Niterói,+Parque+Amazônia,+Goiânia,+GO,+74843-160",
    cor: "#0080ff",
    label: "Ver no mapa",
    target: "_blank",
  },
];

export default function Contato() {
  return (
    <section id="contato" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Contato</span>
          <h2 className={styles.title}>
            Vamos conversar sobre
            <br />
            <span className={styles.accent}>o seu negócio</span>
          </h2>
          <p className={styles.subtitle}>
            Escolha o canal mais conveniente e fale diretamente com nosso time
            comercial. Estamos prontos para te atender.
          </p>
        </div>

        <div className={styles.grid}>
          {canais.map((c) => (
            <a
              key={c.titulo}
              href={c.href}
              target={c.target || "_self"}
              rel={c.target === "_blank" ? "noopener noreferrer" : undefined}
              className={styles.card}
              style={{ "--cor": c.cor }}
            >
              <div className={styles.iconWrap} style={{ color: c.cor }}>
                {c.icon}
              </div>
              <h3 className={styles.cardTitle}>{c.titulo}</h3>
              <p className={styles.cardDesc}>{c.descricao}</p>
              <span className={styles.cardAcao}>{c.acao}</span>
              <span className={styles.cardBtn}>
                {c.label}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>
          ))}
        </div>

        <div className={styles.horario}>
          <span className={styles.horarioDot} />
          Atendimento de segunda a sexta, das 9h às 19h, e aos sábados, das 8h
          às 12h (horário de Brasília)
        </div>
      </div>
    </section>
  );
}
