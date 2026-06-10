import Navbar from './componentes/Navbar'
import Hero from './componentes/Hero'
import Solucoes from './componentes/Solucoes'
import Sobre from './componentes/Sobre'
import Diferenciais from './componentes/Diferenciais'
import Contato from './componentes/Contato'
import Footer from './componentes/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Solucoes />
        <Sobre />
        <Diferenciais />
        <Contato />
      </main>
      <Footer />
    </>
  )
}
