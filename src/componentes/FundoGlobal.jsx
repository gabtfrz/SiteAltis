import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './FundoGlobal.module.css'

const CORES = { cyan: 0x00d4c8, azul: 0x0080ff }

/**
 * Fundo 3D global do site: um campo de partículas e formas wireframe
 * distribuídas verticalmente por toda a extensão da página. A câmera
 * percorre o campo conforme o scroll (parallax mais lento que o
 * conteúdo) e acompanha sutilmente o mouse. Fica fixo atrás de todas
 * as seções — as que têm fundo próprio usam cor translúcida para
 * deixá-lo transparecer.
 */
export default function FundoGlobal() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.z = 10

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.appendChild(renderer.domElement)

    // altura do mundo 3D proporcional à rolagem total da página,
    // reduzida pelo fator de parallax (fundo anda mais devagar)
    const alturaVisivel = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
    let limiteRolagem = Math.max(document.body.scrollHeight - window.innerHeight, 1)
    const fatorParalaxe = 0.35
    const alturaMundo = (limiteRolagem / window.innerHeight) * alturaVisivel * fatorParalaxe

    // campo de partículas distribuído por toda a altura do mundo
    const qtdParticulas = window.innerWidth > 900 ? 140 : 60
    const posicoes = new Float32Array(qtdParticulas * 3)
    for (let i = 0; i < qtdParticulas; i++) {
      posicoes[i * 3] = (Math.random() - 0.5) * 24
      posicoes[i * 3 + 1] = 3 - Math.random() * (alturaMundo + 8)
      posicoes[i * 3 + 2] = -6 + Math.random() * 8
    }
    const geoParticulas = new THREE.BufferGeometry()
    geoParticulas.setAttribute('position', new THREE.BufferAttribute(posicoes, 3))
    const matParticulas = new THREE.PointsMaterial({
      color: CORES.cyan,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
    })
    const particulas = new THREE.Points(geoParticulas, matParticulas)
    cena.add(particulas)

    // formas wireframe espalhadas verticalmente — uma "passa" por cada
    // trecho da página durante o scroll
    const geosBase = [
      new THREE.IcosahedronGeometry(0.9, 0),
      new THREE.OctahedronGeometry(0.85, 0),
      new THREE.TetrahedronGeometry(0.9, 0),
    ]
    const numFormas = 6
    const formas = []
    const descartaveis = [...geosBase]
    for (let i = 0; i < numFormas; i++) {
      const geoArestas = new THREE.EdgesGeometry(geosBase[i % geosBase.length])
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? CORES.cyan : CORES.azul,
        transparent: true,
        opacity: 0.12,
      })
      const forma = new THREE.LineSegments(geoArestas, material)
      const lado = i % 2 === 0 ? 1 : -1
      forma.position.set(
        lado * (3.5 + Math.random() * 4),
        -((i + 0.5) * alturaMundo) / numFormas,
        -3.5 + Math.random() * 2.5
      )
      forma.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0)
      forma.scale.setScalar(0.6 + Math.random() * 0.7)
      forma.userData.giro = {
        x: 0.04 + Math.random() * 0.08,
        y: 0.05 + Math.random() * 0.1,
      }
      cena.add(forma)
      formas.push(forma)
      descartaveis.push(geoArestas, material)
    }
    descartaveis.push(geoParticulas, matParticulas)

    const redimensionar = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      limiteRolagem = Math.max(document.body.scrollHeight - window.innerHeight, 1)
    }
    window.addEventListener('resize', redimensionar)

    const mouse = { x: 0 }
    const aoMoverMouse = (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5
    }

    const alvoCameraY = () => -(window.scrollY / limiteRolagem) * alturaMundo

    const relogio = new THREE.Clock()
    const renderizar = () => {
      const t = relogio.getElapsedTime()
      formas.forEach((f) => {
        f.rotation.x = t * f.userData.giro.x
        f.rotation.y = t * f.userData.giro.y
      })
      particulas.rotation.y = Math.sin(t * 0.05) * 0.08
      camera.position.y += (alvoCameraY() - camera.position.y) * 0.06
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04
      renderer.render(cena, camera)
    }

    let quadro = null
    const loop = () => {
      renderizar()
      quadro = requestAnimationFrame(loop)
    }

    if (movimentoReduzido) {
      // quadro único e estático na posição atual de rolagem
      camera.position.y = alvoCameraY()
      renderizar()
    } else {
      window.addEventListener('mousemove', aoMoverMouse)
      quadro = requestAnimationFrame(loop)
    }

    return () => {
      if (quadro !== null) cancelAnimationFrame(quadro)
      window.removeEventListener('mousemove', aoMoverMouse)
      window.removeEventListener('resize', redimensionar)
      descartaveis.forEach((item) => item.dispose())
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className={styles.canvas} aria-hidden="true" />
}
