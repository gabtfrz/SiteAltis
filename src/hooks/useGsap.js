import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Encapsula gsap.context() com cleanup automático e respeito a
 * prefers-reduced-motion. Retorna o ref de escopo para anexar ao
 * elemento raiz da seção — seletores dentro do callback ficam
 * limitados a esse escopo.
 */
export default function useGsap(animacao) {
  const escopo = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(animacao, escopo)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return escopo
}

/**
 * Anima todos os elementos [data-contador] dentro de `raiz`,
 * contando de 0 até o valor de data-contador (+ data-sufixo opcional).
 * Deve ser chamado dentro do callback de useGsap para herdar o cleanup.
 */
export function animarContadores(raiz, config = {}) {
  raiz.querySelectorAll('[data-contador]').forEach((el) => {
    const alvo = Number(el.dataset.contador)
    const sufixo = el.dataset.sufixo || ''
    const progresso = { valor: 0 }
    gsap.to(progresso, {
      valor: alvo,
      duration: 1.6,
      ease: 'power2.out',
      ...config,
      onUpdate: () => {
        el.textContent = Math.round(progresso.valor) + sufixo
      },
    })
  })
}
