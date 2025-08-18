import { useEffect, useState, useRef } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)
  const elementRef = useRef<Element | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const intersectionEntry = entries[0]
        if (intersectionEntry) {
          setEntry(intersectionEntry)
          setIsIntersecting(intersectionEntry.isIntersecting)

          // If triggerOnce is true, disconnect after first intersection
          if (options.triggerOnce && intersectionEntry.isIntersecting) {
            observer.disconnect()
          }
        }
      },
      {
        threshold: options.threshold ?? 0,
        root: options.root ?? null,
        rootMargin: options.rootMargin ?? '0px'
      }
    )

    observerRef.current = observer
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [options.threshold, options.root, options.rootMargin, options.triggerOnce])

  const setElement = (element: Element | null) => {
    elementRef.current = element
  }

  return {
    ref: setElement,
    entry,
    isIntersecting
  }
}