import React, { useEffect, useMemo, useState } from 'react';
import { Home, Network, ChevronDown, ChevronUp, Trees as Tree, Settings, HelpCircle, Cylinder, User, Tally3 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/app/core/contexts/auth-context';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  isActive?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    views: false
  });


  const { user } = useAuth();

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
      children: []
    },
    {
      id: 'views',
      label: 'UVAmigos',
      icon: <Network size={20} />,
      isActive: false,
      children: [
        {
          id: 'tree-view',
          label: 'Directos',
          icon: <Tree size={18} />,
          href: '/dashboard/tree-view',
          isActive: false
        },
        {
          id: 'unilevel',
          label: 'Unilevel',
          icon: <Tally3 size={20} />,
          href: '/dashboard/unilevel',
          isActive: false
        },
        {
          id: 'tanque',
          label: 'Mi tanque',
          icon: <Cylinder size={20} />,
          href: '/dashboard/tanque',
          isActive: false,
        },
      ]
    },
    {
      id: 'account',
      label: 'Mi cuenta',
      icon: <User size={20} />,
      href: '/dashboard/account',
      isActive: false,
      children: []
    },
  ], []);

  const bottomMenuItems: MenuItem[] = useMemo(() => [
    {
      id: 'settings',
      label: 'Configuración',
      icon: <Settings size={20} />,
      href: '/dashboard/settings'
    },
    {
      id: 'help',
      label: 'Ayuda',
      icon: <HelpCircle size={20} />,
      href: '/dashboard/help'
    }
  ], []);

  
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
    
    return (
      <div key={item.id} className="mb-1">
        <button
          onClick={() => {
            if (hasChildren) {
              toggleSubmenu(item.id);
            } else if (item.href) {
              item.isActive = true;
              router.push(item.href);
            }
          }}
          className={`w-full flex items-center justify-between p-[8px] rounded-[5px] transition-all duration-200 ${activeClass}`}
          style={{ marginLeft: `${marginLeft}px` }}
        >
          <div className="flex items-center">
            <span className="mr-3">{item.icon}</span>
            {isOpen && <span className="transition-opacity duration-300 text-[15px]">{item.label}</span>}
          </div>
          {hasChildren && isOpen && (
            <span>{isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
          )}
        </button>
        
        {hasChildren && isExpanded && isOpen && (
          <div className="transition-all duration-300 ease-in-out mt-2">
            {item.children?.map(child => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={`${
        isOpen ? 'w-64' : 'w-[47px]'} 
        transition-all duration-300 ease-in-out flex flex-col 
        ${theme === 'dark' ? 'bg-purple-900' : 'bg-purple-500'}
        shadow-xl z-20 overflow-y-auto
        hover:w-64
      `}
    >
      {/* Profile */}
      <div className={`rounded-lg flex items-center gap-2 flex-col ${isOpen ? 'p-6' : 'p-2 pb-0'}`}>
        {/* Image */}
        <div className={`flex items-center justify-center border-gray-200 dark:border-gray-700 rounded overflow-hidden ${ isOpen ? 'border w-20 h-20' : 'border-none w-12 h-12' }`}>
          <Image
            className='rounded-full border border-gray-200 dark:border-gray-700 bg-white p-2'
            src='/images/default-profile.webp'
            alt="Profile"
            width={48}
            height={48}
          />
        </div>
        {/* Name */}
        {
          isOpen && (
            <>
              <div className='flex flex-col items-center'>
                <span>{user?.name} {user?.lastname}</span>
                <span className='text-xs text-gray-500'>{user?.email}</span>
              </div>

              {/* Ver perfil */}
              <button  
                className={`text-sm mt-2 w-full border border-gray-200 rounded px-2 py-2 cursor-pointer ${theme === 'dark' ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-800'}`}
                onClick={() => router.push('/dashboard/profile')}
              >
                Ver perfil
              </button>
            </>
          )
        }

      </div>
      {/* Divider */}
      {isOpen && <div className='mt-5 mb-2 border-b border-gray-700'></div>}

      <div className="flex-1 px-[8px] py-4">
        {menuItems.map(item => renderMenuItem(item))}
      </div>
      
      <div className={`px-2 py-6 border-gray-700 ${isOpen ? 'border-t' : 'border-none'}`}>
        {bottomMenuItems.map(item => renderMenuItem(item))}
      </div>
    </aside>
  );
};

export default Sidebar;