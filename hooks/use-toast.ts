// Simple toast hook for deployment
import { useCallback } from 'react'

export interface Toast {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
}

export function useToast() {
  const toast = useCallback(({ title, description, variant = 'default' }: Toast) => {
    // Simple console log for now - can be enhanced later
    console.log(`Toast (${variant}):`, title, description)
    
    // For now, just use native browser notifications or console
    if (typeof window !== 'undefined') {
      if (variant === 'destructive') {
        console.error(title, description)
      } else {
        console.info(title, description)
      }
    }
  }, [])

  return { toast }
}
