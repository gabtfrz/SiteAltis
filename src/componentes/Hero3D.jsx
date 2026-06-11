import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styles from './Hero3D.module.css'

/**
 * Cena 3D de fundo do Hero: malha de arestas com vértices em destaque
 * e núcleo interno — representação dos módulos integrados do ERP.
 * Roda atrás do conteúdo, com parallax sutil de mouse. Pausa quando
 * o Hero sai da viewport e renderiza um único quadro estático quando
 * o usuário prefere movimento reduzido.
 */
export default function Hero3D() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cena = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const grupo = new THREE.Group()
    cena.add(grupo)

    const geoExterna = new THREE.IcosahedronGeometry(2.6, 1)
    const geoArestas = new THREE.EdgesGeometry(geoExterna)
    const matArestas = new THREE.LineBasicMaterial({
      color: 0x00d4c8,
      transparent: true,
      opacity: 0.14,
    })
    const arestas = new THREE.LineSegments(geoArestas, matArestas)

    const matVertices = new THREE.PointsMaterial({
      color: 0x00d4c8,
      size: 0.06,
      transparent: true,
      opacity: 0.55,
    })
    const vertices = new THREE.Points(geoExterna, matVertices)

    const geoNucleoBase = new THREE.IcosahedronGeometry(1.15, 0)
    const geoNucleo = new THREE.EdgesGeometry(geoNucleoBase)
    const matNucleo = new THREE.LineBasicMaterial({
      color: 0x0080ff,
      transparent: true,
      opacity: 0.22,
    })
    const nucleo = new THREE.LineSegments(geoNucleo, matNucleo)

    grupo.add(arestas, vertices, nucleo)

    const redimensionar = () => {
      const { clientWidth: w, clientHeight: h } = container
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      // em telas largas a forma fica atrás da coluna direita; no mobile, centralizada
      grupo.position.x = w > 900 ? 2.4 : 0
    }
    redimensionar()
    window.addEventListener('resize', redimensionar)

    const mouse = { x: 0, y: 0 }
    const aoMoverMouse = (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5
      mouse.y = e.clientY / window.innerHeight - 0.5
    }

    const relogio = new THREE.Clock()

    const renderizar = () => {
      const t = relogio.getElapsedTime()
      grupo.rotation.y = t * 0.12
      grupo.rotation.x = Math.sin(t * 0.18) * 0.12
      nucleo.rotation.y = -t * 0.3
      nucleo.rotation.z = t * 0.18
      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04
      camera.position.y += (-mouse.y * 0.5 - camera.position.y) * 0.04
      camera.lookAt(0, 0, 0)
      renderer.render(cena, camera)
    }

    let quadro = null
    const loop = () => {
      renderizar()
      quadro = requestAnimationFrame(loop)
    }
    const iniciar = () => {
      if (quadro === null) quadro = requestAnimationFrame(loop)
    }
    const parar = () => {
      if (quadro !== null) {
        cancelAnimationFrame(quadro)
        quadro = null
      }
    }

    let observador = null
    if (movimentoReduzido) {
      renderizar()
    } else {
      window.addEventListener('mousemove', aoMoverMouse)
      observador = new IntersectionObserver(([entrada]) => {
        if (entrada.isIntersecting) iniciar()
        else parar()
      })
      observador.observe(container)
    }

    return () => {
      parar()
      if (observador) observador.disconnect()
      window.removeEventListener('mousemove', aoMoverMouse)
      window.removeEventListener('resize', redimensionar)
      geoExterna.dispose()
      geoArestas.dispose()
      geoNucleoBase.dispose()
      geoNucleo.dispose()
      matArestas.dispose()
      matVertices.dispose()
      matNucleo.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={containerRef} className={styles.canvas} aria-hidden="true" />
}
