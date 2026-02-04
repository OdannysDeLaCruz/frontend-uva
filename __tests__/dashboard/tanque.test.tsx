import '@testing-library/jest-dom'
import { render, screen, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import TanquePage from '../../src/app/dashboard/tanque/page'
import * as userService from '../../src/app/core/services/user-service'
import * as authContext from '../../src/app/core/contexts/auth-context'
import toast from 'react-hot-toast'

// Mock del Layout
jest.mock('../../src/app/dashboard/components/layout/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>
  }
})

// Mock de react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  Toaster: () => null,
}))

// Mock de los servicios
jest.mock('../../src/app/core/services/user-service', () => ({
  getTanqueAffiliates: jest.fn(),
  getUserByReferralCode: jest.fn(),
  assignParentToUser: jest.fn(),
}))

// Mock del contexto de auth
jest.mock('../../src/app/core/contexts/auth-context', () => ({
  ...jest.requireActual('../../src/app/core/contexts/auth-context'),
  useAuth: jest.fn(),
}))

const mockUser = {
  id: 1,
  name: 'Juan',
  lastname: 'Pérez',
  email: 'juan@test.com',
  referralCode: 'ABC123',
}

const mockAffiliates = [
  {
    id: 10,
    name: 'María',
    lastname: 'García',
    email: 'maria@test.com',
    referralCode: 'XYZ789',
  },
  {
    id: 11,
    name: 'Carlos',
    lastname: 'López',
    email: 'carlos@test.com',
    referralCode: 'DEF456',
  },
]

const mockParent = {
  id: 5,
  name: 'Pedro',
  lastname: 'Martínez',
  email: 'pedro@test.com',
  referralCode: 'PAR001',
}

describe('TanquePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Setup default mocks
    ;(authContext.useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      setUser: jest.fn(),
      logout: jest.fn(),
    })

    ;(userService.getTanqueAffiliates as jest.Mock).mockResolvedValue(mockAffiliates)
    ;(userService.assignParentToUser as jest.Mock).mockResolvedValue({})
    ;(userService.getUserByReferralCode as jest.Mock).mockResolvedValue(mockParent)
  })

  describe('Autoasignar afiliado', () => {
    it('debe mostrar diálogo de confirmación al hacer clic en Autoasignar', async () => {
      const user = userEvent.setup()
      render(<TanquePage />)

      // Esperar a que carguen los afiliados
      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
      })

      // Hacer clic en el botón "Colocación" del primer afiliado
      const colocacionButtons = screen.getAllByText('Colocación')
      await user.click(colocacionButtons[0])

      // Verificar que se abre el modal
      expect(screen.getByText('Colocación en estructura de referidos')).toBeInTheDocument()
      expect(screen.getByText(/Colocando a:/)).toBeInTheDocument()

      // Hacer clic en Autoasignar
      const autoassignButton = screen.getByRole('button', { name: 'Autoasignar' })
      await user.click(autoassignButton)

      // Verificar que aparece el diálogo de confirmación
      await waitFor(() => {
        expect(screen.getByText('Confirmar autoasignación')).toBeInTheDocument()
        expect(screen.getByText(/¿Estás seguro de que deseas colocar a María García directamente bajo tu estructura\?/)).toBeInTheDocument()
      })
    })

    it('debe ejecutar autoasignación y mostrar toast al confirmar', async () => {
      const user = userEvent.setup()
      render(<TanquePage />)

      // Esperar a que carguen los afiliados
      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
      })

      // Abrir modal y hacer clic en Autoasignar
      const colocacionButtons = screen.getAllByText('Colocación')
      await user.click(colocacionButtons[0])

      const autoassignButton = screen.getByRole('button', { name: 'Autoasignar' })
      await user.click(autoassignButton)

      // Confirmar en el diálogo
      await waitFor(() => {
        expect(screen.getByText('Confirmar autoasignación')).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: 'Sí, autoasignar' })
      await user.click(confirmButton)

      // Verificar que se llamó al servicio con los parámetros correctos
      await waitFor(() => {
        expect(userService.assignParentToUser).toHaveBeenCalledWith({
          affiliateId: 10,
          parentId: 1,
          tanqueOwnerId: 1,
        })
      })

      // Verificar que se mostró el toast de éxito
      expect(toast.success).toHaveBeenCalledWith('Autoasignación exitosa', {
        duration: 5000,
        position: 'bottom-right',
      })
    })

    it('debe cancelar autoasignación al hacer clic en Cancelar', async () => {
      const user = userEvent.setup()
      render(<TanquePage />)

      // Esperar a que carguen los afiliados
      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
      })

      // Abrir modal y hacer clic en Autoasignar
      const colocacionButtons = screen.getAllByText('Colocación')
      await user.click(colocacionButtons[0])

      const autoassignButton = screen.getByRole('button', { name: 'Autoasignar' })
      await user.click(autoassignButton)

      // Verificar diálogo de confirmación
      await waitFor(() => {
        expect(screen.getByText('Confirmar autoasignación')).toBeInTheDocument()
      })

      // Cancelar
      const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
      await user.click(cancelButton)

      // Verificar que NO se llamó al servicio
      expect(userService.assignParentToUser).not.toHaveBeenCalled()
    })
  })

  describe('Asignar a otro padre', () => {
    it('debe buscar padre por código de referido y mostrar resultado', async () => {
      const user = userEvent.setup()
      render(<TanquePage />)

      // Esperar a que carguen los afiliados
      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
      })

      // Abrir modal
      const colocacionButtons = screen.getAllByText('Colocación')
      await user.click(colocacionButtons[0])

      // Ingresar código de referido
      const input = screen.getByPlaceholderText(/Ingresa el codigo de referido/)
      await user.type(input, 'PAR001')

      // Buscar
      const searchButton = screen.getByRole('button', { name: 'Buscar' })
      await user.click(searchButton)

      // Verificar que se muestra el resultado
      await waitFor(() => {
        expect(screen.getByText(/Pedro/)).toBeInTheDocument()
        expect(screen.getByText(/Martínez/)).toBeInTheDocument()
        expect(screen.getByText(/PAR001/)).toBeInTheDocument()
      })

      // Verificar que se llamó al servicio de búsqueda
      expect(userService.getUserByReferralCode).toHaveBeenCalledWith('PAR001')
    })

    it('debe mostrar diálogo de confirmación al hacer clic en COLOCAR', async () => {
      const user = userEvent.setup()
      render(<TanquePage />)

      // Esperar a que carguen los afiliados
      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
      })

      // Abrir modal, buscar padre y hacer clic en COLOCAR
      const colocacionButtons = screen.getAllByText('Colocación')
      await user.click(colocacionButtons[0])

      const input = screen.getByPlaceholderText(/Ingresa el codigo de referido/)
      await user.type(input, 'PAR001')

      const searchButton = screen.getByRole('button', { name: 'Buscar' })
      await user.click(searchButton)

      // Esperar resultado y hacer clic en COLOCAR
      await waitFor(() => {
        expect(screen.getByText(/Pedro/)).toBeInTheDocument()
      })

      const placeButton = screen.getByRole('button', { name: 'COLOCAR' })
      await user.click(placeButton)

      // Verificar diálogo de confirmación
      await waitFor(() => {
        expect(screen.getByText('Confirmar colocación')).toBeInTheDocument()
        expect(screen.getByText(/¿Estás seguro de que deseas colocar a María García bajo Pedro Martínez\?/)).toBeInTheDocument()
      })
    })

    it('debe ejecutar asignación y mostrar toast al confirmar', async () => {
      const user = userEvent.setup()
      render(<TanquePage />)

      // Esperar a que carguen los afiliados
      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
      })

      // Flujo completo: abrir modal, buscar padre, COLOCAR, confirmar
      const colocacionButtons = screen.getAllByText('Colocación')
      await user.click(colocacionButtons[0])

      const input = screen.getByPlaceholderText(/Ingresa el codigo de referido/)
      await user.type(input, 'PAR001')

      const searchButton = screen.getByRole('button', { name: 'Buscar' })
      await user.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText(/Pedro/)).toBeInTheDocument()
      })

      const placeButton = screen.getByRole('button', { name: 'COLOCAR' })
      await user.click(placeButton)

      // Confirmar
      await waitFor(() => {
        expect(screen.getByText('Confirmar colocación')).toBeInTheDocument()
      })

      const confirmButton = screen.getByRole('button', { name: 'Sí, colocar' })
      await user.click(confirmButton)

      // Verificar que se llamó al servicio con los parámetros correctos
      await waitFor(() => {
        expect(userService.assignParentToUser).toHaveBeenCalledWith({
          affiliateId: 10,
          parentId: 5,
          tanqueOwnerId: 1,
        })
      })

      // Verificar que se mostró el toast de éxito
      expect(toast.success).toHaveBeenCalledWith('Padre asignado exitosamente', {
        duration: 5000,
        position: 'bottom-right',
      })
    })

    it('debe cancelar asignación al hacer clic en Cancelar', async () => {
      const user = userEvent.setup()
      render(<TanquePage />)

      // Esperar a que carguen los afiliados
      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
      })

      // Flujo hasta el diálogo de confirmación
      const colocacionButtons = screen.getAllByText('Colocación')
      await user.click(colocacionButtons[0])

      const input = screen.getByPlaceholderText(/Ingresa el codigo de referido/)
      await user.type(input, 'PAR001')

      const searchButton = screen.getByRole('button', { name: 'Buscar' })
      await user.click(searchButton)

      await waitFor(() => {
        expect(screen.getByText(/Pedro/)).toBeInTheDocument()
      })

      const placeButton = screen.getByRole('button', { name: 'COLOCAR' })
      await user.click(placeButton)

      // Cancelar
      await waitFor(() => {
        expect(screen.getByText('Confirmar colocación')).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: 'Cancelar' })
      await user.click(cancelButton)

      // Verificar que NO se llamó al servicio de asignación
      expect(userService.assignParentToUser).not.toHaveBeenCalled()
    })
  })

  describe('Estado inicial y carga', () => {
    it('debe mostrar mensaje cuando no hay afiliados en el tanque', async () => {
      ;(userService.getTanqueAffiliates as jest.Mock).mockResolvedValue([])

      render(<TanquePage />)

      await waitFor(() => {
        expect(screen.getByText('No hay usuarios en el tanque')).toBeInTheDocument()
      })
    })

    it('debe mostrar lista de afiliados cuando hay datos', async () => {
      render(<TanquePage />)

      await waitFor(() => {
        expect(screen.getByText('María García')).toBeInTheDocument()
        expect(screen.getByText('Carlos López')).toBeInTheDocument()
      })
    })
  })
})
