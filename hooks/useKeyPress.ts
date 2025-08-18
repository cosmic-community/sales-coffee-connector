import { useState, useEffect } from 'react'

export function useKeyPress(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState<boolean>(false)

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true)
      }
    }

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false)
      }
    }

    // Add event listeners with proper typing
    const downListener = (event: Event) => downHandler(event as KeyboardEvent)
    const upListener = (event: Event) => upHandler(event as KeyboardEvent)

    window.addEventListener('keydown', downListener)
    window.addEventListener('keyup', upListener)

    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', downListener)
      window.removeEventListener('keyup', upListener)
    }
  }, [targetKey])

  return keyPressed
}

export function useKeyPressCallback(
  targetKey: string,
  callback: () => void,
  options: {
    preventDefault?: boolean
    stopPropagation?: boolean
  } = {}
) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        if (options.preventDefault) {
          event.preventDefault()
        }
        if (options.stopPropagation) {
          event.stopPropagation()
        }
        callback()
      }
    }

    const listener = (event: Event) => handler(event as KeyboardEvent)

    window.addEventListener('keydown', listener)

    return () => {
      window.removeEventListener('keydown', listener)
    }
  }, [targetKey, callback, options.preventDefault, options.stopPropagation])
}