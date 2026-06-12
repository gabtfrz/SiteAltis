import { lazy, Suspense } from 'react'
import Navbar from './componentes/Navbar'
import Hero from './componentes/Hero'
import Solucoes from './componentes/Solucoes'
import Sobre from './componentes/Sobre'
import Diferenciais from './componentes/Diferenciais'
import Contato from './componentes/Contato'
import Footer from './componentes/Footer'

// fundo 3D global carregado de forma assíncrona — compartilha o chunk
// do three.js com o Hero3D
const FundoGlobal = lazy(() => import('./componentes/FundoGlobal'))

export default function App() {
  return (
    <>
      <Suspense fallback={null}>
        <FundoGlobal />
      </Suspense>
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
