import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Home, Network, ChevronDown, ChevronUp, Cylinder, User, X, CreditCard, Wallet, Bolt, ShieldCheck, GlobeLock, GraduationCap, Binary, ArrowBigRightDash, ListTree } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/app/core/contexts/auth-context';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  isActive?: boolean;
  show?: boolean
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    views: false
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  console.log("USER", user)

  // Usuario con acceso completo: activo o con earlyAccess (prelanzamiento)
  const hasFullAccess = user?.isActive || user?.earlyAccess;

  // Detectar dispositivos móviles
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Prevenir scroll del body cuando el sidebar está abierto en mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  // Cerrar sidebar al hacer clic en un enlace en mobile
  const handleItemClick = useCallback((item: MenuItem) => {
    if (item.href) {
      router.push(item.href);
      if (isMobile && onClose) {
        onClose();
      }
    }
  }, [router, isMobile, onClose]);

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const menuItems: MenuItem[] = useMemo(() => [
    {
      id: 'dashboard',
      label: 'Tablero',
      icon: <Home size={20} />,
      href: '/dashboard',
      isActive: false,
      children: [],
      show: true
    },
    {
      id: 'membership',
      label: 'Membresía',
      icon: <CreditCard size={20} />,
      href: '/dashboard/membership',
      isActive: false,
      children: [],
      show: true
    },
    {
      id: 'aprendizaje',
      label: 'Aprendizaje',
      icon: <GraduationCap size={20} />,
      href: '/dashboard/aprendizaje',
      isActive: false,
      children: [],
      show: hasFullAccess
    },
    // {
    //   id: 'ahorros',
    //   label: 'Ahorro',
    //   icon: <Wallet size={20} />,
    //   href: '/dashboard/ahorros',
    //   isActive: false,
    //   children: [],
    // show: hasFullAccess
    // },
    {
      id: 'perfil',
      label: 'Perfil',
      icon: <User size={20} />,
      isActive: false,
      show: hasFullAccess,
      children: [
        {
          id: 'kyc',
          label: 'KYC (verificación)',
          icon: <ShieldCheck size={18} />,
          href: '/dashboard/kyc',
          isActive: false,
          show: hasFullAccess
        },
        {
          id: 'ajustes',
          label: 'Ajustes',
          icon: <Bolt size={18} />,
          href: '/dashboard/settings',
          isActive: false,
          show: hasFullAccess
        },
        {
          id: 'seguridad',
          label: 'Seguridad',
          icon: <GlobeLock size={18} />,
          href: '/dashboard/seguridad',
          isActive: false,
          show: hasFullAccess
        },
        {
          id: 'sorteo',
          label: 'Sorteo',
          icon: <Binary size={18} />,
          href: '/dashboard/sorteo',
          isActive: false,
          show: hasFullAccess
        },

      ]
    },
    {
      id: 'uvamigos',
      label: 'UVAmigos',
      icon: <Network size={20} />,
      isActive: false,
      show: hasFullAccess,
      children: [
        {
          id: 'directos',
          label: 'Directos',
          icon: <ArrowBigRightDash size={20} />,
          href: '/dashboard/directos',
          isActive: false,
          show: hasFullAccess
        },
        {
          id: 'unilevel',
          label: 'Unilevel',
          icon: <ListTree size={18} />,
          href: '/dashboard/unilevel',
          isActive: false,
          show: hasFullAccess
        },
        {
          id: 'tanque',
          label: 'Mi tanque',
          icon: <Cylinder size={20} />,
          href: '/dashboard/tanque',
          isActive: false,
          show: hasFullAccess
        },
      ]
    },
    {
      id: 'uvaliados',
      label: 'UVAliados',
      icon: <Wallet size={20} />,
      href: '/dashboard/aliados',
      isActive: false,
      children: [],
      show: hasFullAccess
    },
    {
      id: 'recompensas',
      label: 'Recompensas',
      icon: <Wallet size={20} />,
      href: '/dashboard/recompensas',
      isActive: false,
      children: [],
      show: hasFullAccess
    },
    {
      id: 'uvasuenos',
      label: 'UVA Sueño',
      icon: <User size={20} />,
      href: '/dashboard/uvasuenos',
      isActive: false,
      children: [],
      show: hasFullAccess
    },
    {
      id: 'soporte',
      label: 'Soporte',
      icon: <User size={20} />,
      href: '/dashboard/soporte',
      isActive: false,
      children: [],
      show: hasFullAccess
    }
  ], [hasFullAccess]);
  
  useEffect(() => {
    // poner en activo un item si la ruta es la misma del path
    const activeMenuItem = menuItems.find(item => item.href === pathname || item.children?.some(child => child.href === pathname));

    if (activeMenuItem) {
      activeMenuItem.isActive = true;
    }

    // Si la ruta activa es hija, entonces el padre debe estar expandido
    if (activeMenuItem && activeMenuItem.children) {
      setExpandedMenus(prev => ({
        ...prev,
        [activeMenuItem.id]: true
      }));
    }
  }, [pathname, menuItems]);

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isActive = item.href
      ? pathname === item.href
      : item.children?.some(child => pathname === child.href);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedMenus[item.id];
    const isParentActive = item.children?.some(child => child.isActive);

    if (isParentActive) {
      toggleSubmenu(item.id);
    }

    const activeClass = isActive
      ? `${theme === 'dark' ? 'bg-purple-950 text-white' : 'bg-purple-200 text-purple-700'}`
      : `${theme === 'dark' ? 'text-gray-300 hover:bg-purple-950' : 'text-white hover:bg-purple-700'}`;

    const marginLeft = !item.children ? depth * 18 + 8 : 0;

    // En mobile siempre mostrar texto, en desktop usar hover/open logic
    const showText = isMobile ? true : (isOpen || isHovered);

    return (
      <React.Fragment key={item.id}>
       {item.show && (
          <ul className="mb-1">
            <button
              onClick={() => {
                if (hasChildren) {
                  toggleSubmenu(item.id);
                } else {
                  handleItemClick(item);
                }
              }}
              className={`w-full flex items-center justify-between p-3 md:p-[8px] rounded-lg md:rounded-[5px] transition-all duration-200 ${activeClass} touch-manipulation`}
              style={{ marginLeft: isMobile ? 0 : `${marginLeft}px` }}
            >
              <div className="flex items-center">
                <span className="mr-3 text-lg md:text-base">{item.icon}</span>
                {showText && <span className="transition-opacity duration-300 text-base md:text-[15px] font-medium leading-none">{item.label}</span>}
              </div>
              {hasChildren && showText && (
                <span>{isExpanded ? <ChevronUp size={isMobile ? 20 : 16} /> : <ChevronDown size={isMobile ? 20 : 16} />}</span>
              )}
            </button>

            {hasChildren && isExpanded && showText && (
              <div className="transition-all duration-300 ease-in-out mt-2 ml-4 md:ml-0">
                {item.children?.map(child => renderMenuItem(child, depth + 1))}
              </div>
            )}
          </ul>
       )}
      </React.Fragment>
    );
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${isMobile
            ? `fixed top-0 left-0 h-full w-80 transform transition-transform duration-300 ease-in-out z-50 ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : `${isOpen ? 'w-64' : 'w-[52px]'} transition-all duration-300 ease-in-out hover:w-64`
          }
          flex flex-col
          ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-500'}
          shadow-xl overflow-y-auto
        `}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Header del sidebar para mobile */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mr-3">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">{user?.name}</h3>
                <p className="text-purple-200 text-xs">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        )}

        {/* Navegación principal */}
        <div className="flex-1 px-3 md:px-[8px] py-4 md:py-4">
          <nav>
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;