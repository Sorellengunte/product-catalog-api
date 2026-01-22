import { Link } from 'react-router';
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../auth/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed lg:sticky lg:top-0 lg:self-start
          inset-y-0 left-0
          w-64 bg-blue-800 text-white p-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          z-50 lg:z-auto
          flex flex-col
          h-screen lg:h-screen lg:overflow-y-auto
        `}
      >
        {/* Close button mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 text-white hover:text-blue-200"
        >
          ✕
        </button>

        {/* Logo/Brand */}
        <div className="mb-8">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <p className="text-blue-200 text-sm mt-1">Gestion des produits</p>
        </div>

        {/* Navigation principale */}
        <nav className="space-y-2 mb-8 flex-grow">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 p-3 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <ChartBarIcon className="h-5 w-5" />
            <span>Tableau de bord</span>
          </Link>
          
          <Link
            to="/admin/products"
            className="flex items-center gap-3 p-3 bg-blue-700 rounded-lg"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span>Produits</span>
          </Link>
          
          <Link
            to="/admin/products/add"
            className="flex items-center gap-3 p-3 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Ajouter produit</span>
          </Link>
          
          
          
          <Link
            to="/home"
            className="flex items-center gap-3 p-3 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Retour au site</span>
          </Link>
        </nav>

        {/* User section - en bas */}
        <div className="mt-auto pt-6 border-t border-blue-700">
          <div className="flex items-center gap-3 mb-4">
            <UserCircleIcon className="h-10 w-10 flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate">{user?.username || 'Admin'}</p>
              <p className="text-sm text-blue-200 truncate">Administrateur</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 text-red-200 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </>
  );
}