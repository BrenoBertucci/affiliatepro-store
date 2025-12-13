import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/Admin_08080');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <ShoppingBag size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">Affiliate<span className="text-blue-600">Pro</span></span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Início</Link>
            <Link to="/shop" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Loja</Link>
            {user ? (
              <>
                <Link to="/admin" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Painel</Link>
                <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                  <span className="text-sm text-slate-500 flex items-center">
                    <UserIcon size={16} className="mr-2" />
                    {user.email.split('@')[0]}
                  </span>
                  <button onClick={handleSignOut} className="text-slate-500 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : null}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Início
            </Link>
            <Link
              to="/shop"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
            >
              Loja
            </Link>
            {user && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-blue-600 hover:bg-blue-50"
                >
                  Painel
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;