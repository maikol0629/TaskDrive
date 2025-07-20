import React from 'react';

// Tipos para las props del componente
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  className?: string;
}

// Tipo para los elementos del menú
interface MenuItem {
  id: string;
  label: string;
  icon: string;
  description?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  className = '' 
}) => {
  // Configuración de los elementos del menú
  const menuItems: MenuItem[] = [
    {
      id: 'tasks',
      label: 'Tareas',
      icon: '📋',
      description: 'Gestiona tus tareas personales'
    },
    {
      id: 'projects',
      label: 'Proyectos',
      icon: '📁',
      description: 'Administra tus proyectos'
    },
    {
      id: 'team',
      label: 'Equipo',
      icon: '👥',
      description: 'Colabora con tu equipo'
    }
  ];

  // Función para manejar el click en un elemento del menú
  const handleMenuClick = (sectionId: string) => {
    onSectionChange(sectionId);
  };

  // Función para determinar si un elemento está activo
  const isActive = (sectionId: string) => {
    return activeSection === sectionId;
  };

  return (
    <div className={`bg-white shadow-lg border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header de la Sidebar */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Panel de control</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleMenuClick(item.id)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200
                  ${isActive(item.id) 
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}
              >
                <span className="text-xl mr-3">{item.icon}</span>
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 mt-1">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer de la Sidebar */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">U</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Usuario</p>
            <p className="text-xs text-gray-500">usuario@email.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;