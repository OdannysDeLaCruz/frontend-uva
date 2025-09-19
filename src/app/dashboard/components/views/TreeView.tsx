import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronDown, ChevronRight, User, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useVirtualizer } from '@tanstack/react-virtual';
import { PublicUserDto } from '@/app/core/types/user';
import { getDirectUsers } from '@/app/core/services/user-service';
import { useAuth } from '@/app/core/contexts/auth-context';

// Interfaz para el nodo en nuestro estado, incluyendo el nivel y si los hijos ya fueron cargados
export interface UserNode extends PublicUserDto {
  level: number;
  children?: UserNode[];
  _childrenLoaded?: boolean; // Para saber si ya intentamos cargar los hijos
}

// Interfaz para la fila aplanada que usará el virtualizador
interface FlatUserNode extends UserNode {
  isExpanded: boolean;
  isLoadingChildren: boolean;
}

// --- Funciones Auxiliares ---

// Función para añadir/actualizar hijos en el árbol de forma inmutable
const updateNodeInChildren = (
  nodes: UserNode[],
  parentId: number,
  newChildren: UserNode[] | null, // null si hubo error o no hay hijos
  childrenLoadedStatus: boolean
): UserNode[] => {
  return nodes.map(node => {
    if (node.id === parentId) {
      return {
        ...node,
        children: newChildren || undefined, // undefined si es null para no renderizar la sección
        _childrenLoaded: childrenLoadedStatus,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeInChildren(node.children, parentId, newChildren, childrenLoadedStatus),
      };
    }
    return node;
  });
};

// Función para aplanar el árbol en una lista de nodos visibles para el virtualizador
const flattenTree = (
  nodes: UserNode[],
  expandedNodes: Record<string, boolean>,
  loadingChildrenState: Record<string, boolean>
): FlatUserNode[] => {
  const flatList: FlatUserNode[] = [];
  const recurse = (currentNodes: UserNode[], currentLevel: number) => {
    currentNodes.forEach(node => {
      flatList.push({
        ...node,
        level: currentLevel, // Aseguramos el nivel aquí
        isExpanded: !!expandedNodes[node.id],
        isLoadingChildren: !!loadingChildrenState[node.id],
      });
      if (expandedNodes[node.id] && node.children) {
        recurse(node.children, currentLevel + 1);
      }
    });
  };
  recurse(nodes, 0); // Asumimos que los nodos raíz están en el nivel 0
  return flatList;
};


const TreeView: React.FC = () => {
  const { theme } = useTheme();
  const [treeData, setTreeData] = useState<UserNode[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const parentRef = useRef<HTMLDivElement>(null); // Ref para el contenedor scrollable

  // Cargar datos iniciales (nodos raíz)
  useEffect(() => {
    const fetchRootUsers = async () => {
      setLoadingInitial(true);
      setError(null);

      try {
        const apiRootNodes = await getDirectUsers(user?.id || 0);
        const rootNodes: UserNode[] = apiRootNodes.map(node => ({
          ...node,
          level: 0, // Nodos raíz están en el nivel 0
          _childrenLoaded: !node.hasChildren, // Si no tiene hijos, se marcan como cargados
        }));

        setTreeData(rootNodes);
      } catch (err) {
        console.error("Error fetching root users:", err);
        setError("No se pudieron cargar los usuarios raíz.");
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchRootUsers();
  }, [user]);

  const handleToggleNode = useCallback(async (node: FlatUserNode) => {
    const nodeId = node.id;
    // Si el nodo ya tiene hijos cargados (o no tiene hijos que cargar), solo alterna la expansión
    if (node._childrenLoaded || !node.hasChildren) {
      setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
      return;
    }

    // Lazy load: Si no tiene hijos cargados y tiene potencial de tenerlos
    if (!node.children && node.hasChildren && !node._childrenLoaded) {
      setLoadingChildren(prev => ({ ...prev, [nodeId]: true }));
      setError(null);

      try {
        const apiChildNodes = await getDirectUsers(nodeId);
        const childNodes: UserNode[] = apiChildNodes.map(child => ({
          ...child,
          level: node.level + 1,
          _childrenLoaded: !child.hasChildren,
        }));
        
        setTreeData(prevData => updateNodeInChildren(prevData, nodeId, childNodes, true));
        setExpandedNodes(prev => ({ ...prev, [nodeId]: true })); // Expandir después de cargar
      } catch (err) {
        console.error(`Error fetching children for ${nodeId}:`, err);
        setError(`Error al cargar hijos de ${node.name}.`);
        // Marcar como cargado incluso si hay error para no reintentar indefinidamente
        setTreeData(prevData => updateNodeInChildren(prevData, nodeId, null, true));
      } finally {
        setLoadingChildren(prev => ({ ...prev, [nodeId]: false }));
      }
    } else {
        // Si ya tiene hijos (cargados previamente) o no tiene `hasChildren`, solo alterna
        setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
    }
  }, []);

  // Lista aplanada de nodos visibles para el virtualizador
  const flatRows = React.useMemo(
    () => flattenTree(treeData, expandedNodes, loadingChildren),
    [treeData, expandedNodes, loadingChildren]
  );

  // Hook de virtualización
  const rowVirtualizer = useVirtualizer({
    count: flatRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48, // Altura estimada de cada fila (ajustar según tu CSS)
    overscan: 5, // Número de items extra a renderizar fuera del viewport
  });

  const levelColors = [
    'border-l-blue-500', 'border-l-green-500',
    'border-l-purple-500', 'border-l-orange-500',
    'border-l-pink-500', 'border-l-teal-500',
  ];

  // "Expandir Todo" y "Colapsar Todo" ahora operan sobre los nodos YA CARGADOS.
  // Expandir todos los nodos no cargados recursivamente podría ser muy costoso en API calls.
  const expandAllLoaded = () => {
    const newExpanded: Record<string, boolean> = {};

    const recurse = (nodes: UserNode[]) => {
      nodes.forEach(node => {
        if (node.hasChildren && node._childrenLoaded && node.children && node.children.length > 0) {
          newExpanded[node.id] = true;
          recurse(node.children);
        } else if (node.hasChildren && !node._childrenLoaded) {
            // Opcional: podrías iniciar la carga de nodos de primer nivel no cargados
            // handleToggleNode(node as FlatUserNode); // Cuidado con llamadas masivas
        }
      });
    };
    recurse(treeData);
    setExpandedNodes(newExpanded);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  if (loadingInitial) {
    return (
      <div className="p-4 flex items-center justify-center">
        <RefreshCw size={24} className="animate-spin mr-2" /> Cargando estructura...
      </div>
    );
  }

  if (error && treeData.length === 0) { // Error crítico si no hay datos raíz
    return (
      <div className="p-4 flex flex-col items-center justify-center text-red-500">
        <AlertCircle size={32} className="mb-2" />
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} // O una función de reintento más específica
          className="mt-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if ( treeData.length === 0 ) {
    return (
      <div>Sin referidos</div>
    )
  }

  return (
    <div className="space-y-6 p-1 md:p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Tus referidos</h2>
        <div className="flex space-x-2">
          <button
            onClick={expandAllLoaded}
            className={`px-3 py-1 text-sm rounded-md ${
              theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors duration-200`}
          >
            Expandir Cargados
          </button>
          <button
            onClick={collapseAll}
            className={`px-3 py-1 text-sm rounded-md ${
              theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
            } transition-colors duration-200`}
          >
            Colapsar Todo
          </button>
        </div>
      </div>

      {error && <div className="p-2 mb-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md">{error}</div>}
      
      <div
        ref={parentRef} // Asignar ref al contenedor scrollable
        className={`rounded-lg p-2 shadow-md overflow-auto relative ${
          theme === 'dark' ? 'bg-gray-700' : 'bg-white'
        }`}
        style={{ height: '600px' }} // Debes darle una altura fija al contenedor para la virtualización
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`, // Altura total del contenido virtual
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => {
            const node = flatRows[virtualRow.index]; // El nodo actual a renderizar
            if (!node) return null; // Seguridad por si acaso

            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`, // Posicionar el item
                  marginLeft: `${node.level * 24}px`, // Indentación basada en el nivel
                }}
                className={`
                  flex items-center border-b border-l-3
                  ${levelColors[node.level % levelColors.length]}
                  ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-200 hover:bg-gray-50'}
                  cursor-pointer transition-colors duration-150 select-none
                `}
                onClick={() => handleToggleNode(node)}
              >
                {/* Icono de expandir/collapsar */}
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-1">
                  {node.hasChildren ? (
                    node.isLoadingChildren ? (
                      <RefreshCw size={16} className="animate-spin text-gray-500" />
                    ) : node.isExpanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )
                  ) : (
                    <span className="w-[18px]" /> // Espaciador si no tiene hijos
                  )}
                </div>
                
                {/* Icono de usuario */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  } mr-2 flex-shrink-0`}
                >
                  <User size={15} />
                </div>
                
                {/* Información del usuario */}
                <div className="flex-1 overflow-hidden pr-2">
                  <p className="font-medium text-sm truncate">{node.name}</p>
                  <p className={`text-xs truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{node.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TreeView;