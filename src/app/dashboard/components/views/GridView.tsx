import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

const GridView: React.FC = () => {
  const { theme } = useTheme();
  
  const projects = [
    {
      id: 1,
      title: 'Rediseño de Sitio Web',
      status: 'En progreso',
      progress: 65,
      owner: 'María García',
      image: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: 'blue'
    },
    {
      id: 2,
      title: 'Aplicación Móvil',
      status: 'Completado',
      progress: 100,
      owner: 'Carlos López',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: 'green'
    },
    {
      id: 3,
      title: 'Campaña de Marketing',
      status: 'Por iniciar',
      progress: 0,
      owner: 'Ana Torres',
      image: 'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: 'purple'
    },
    {
      id: 4,
      title: 'Análisis de Datos',
      status: 'En progreso',
      progress: 45,
      owner: 'David Ruiz',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: 'yellow'
    },
    {
      id: 5,
      title: 'Rediseño de Logo',
      status: 'En revisión',
      progress: 80,
      owner: 'Laura Sánchez',
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: 'red'
    },
    {
      id: 6,
      title: 'Desarrollo de API',
      status: 'En progreso',
      progress: 30,
      owner: 'Javier Morales',
      image: 'https://images.pexels.com/photos/7439132/pexels-photo-7439132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      color: 'indigo'
    }
  ];

  const getStatusColorClass = (status: string) => {
    const statusMap: Record<string, string> = {
      'En progreso': 'bg-blue-500',
      'Completado': 'bg-green-500',
      'Por iniciar': 'bg-purple-500',
      'En revisión': 'bg-yellow-500'
    };
    return statusMap[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Vista de Cuadrícula</h2>
        <div className="flex space-x-2">
          <button className={`p-2 rounded-md ${
            theme === 'dark' 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-200 hover:bg-gray-300'
          } transition-colors duration-200`}>
            <SlidersHorizontal size={20} />
          </button>
          <div className={`relative ${
            theme === 'dark' 
              ? 'bg-gray-700' 
              : 'bg-gray-200'
          } rounded-md`}>
            <input 
              type="text" 
              placeholder="Buscar..." 
              className={`pl-9 pr-4 py-2 rounded-md outline-none ${
                theme === 'dark' 
                  ? 'bg-gray-700 text-white placeholder:text-gray-400' 
                  : 'bg-gray-200 text-gray-800 placeholder:text-gray-500'
              }`} 
            />
            <Search size={18} className={`absolute left-2.5 top-2.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id}
            className={`rounded-lg shadow-md overflow-hidden ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            } hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="h-40 overflow-hidden relative">
              <Image 
                src={project.image} 
                alt={project.title} 
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                <h3 className="text-white font-medium">{project.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs text-white ${getStatusColorClass(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                    {project.owner.split(' ').map(name => name[0]).join('')}
                  </div>
                  <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {project.owner}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  project.progress === 100 
                    ? 'text-green-500' 
                    : theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {project.progress}%
                </span>
              </div>
              
              <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    project.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className={`px-3 py-1 text-sm rounded-md ${
                  theme === 'dark' 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-gray-200 hover:bg-gray-300'
                } transition-colors duration-200`}>
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridView;