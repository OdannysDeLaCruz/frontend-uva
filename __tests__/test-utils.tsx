import { ReactNode } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '../src/app/core/contexts/auth-context'

// Wrapper que incluye todos los providers necesarios
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

// Render personalizado que usa los providers
function customRender(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: AllProviders, ...options })
}

// Re-exportar todo de testing-library
export * from '@testing-library/react'

// Sobrescribir render con el personalizado
export { customRender as render }
