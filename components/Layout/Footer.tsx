import React, { useEffect } from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white font-bold text-lg mb-4">AffiliatePro</h3>
            <p className="text-sm text-slate-400 mb-6">
              Curadoria dos melhores produtos para seu estilo de vida digital. Encontramos as ofertas para que você não precise procurar.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Eletrônicos</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Moda</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Casa e Decoração</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Software</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Contato</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Termos de Uso</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Inscreva-se para receber as últimas ofertas.</p>
            <form className="flex flex-col space-y-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Digite seu e-mail" 
                className="bg-slate-800 border-none rounded-md px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                Inscrever-se
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; 2024 AffiliatePro Store. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <span>Desenvolvido com React & Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;