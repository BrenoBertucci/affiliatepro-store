import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, TrendingUp, Shield } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { ProductService } from '../services/supabaseClient';
import { Product } from '../types';

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const all = await ProductService.getAll();
      setFeaturedProducts(all.filter(p => p.is_featured).slice(0, 3));
      setLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Background" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl animate-slide-up">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30">
              Curadoria de Excelência
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Descubra Produtos Que <span className="text-blue-500">Elevam</span> Sua Vida
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
              Vasculhamos a internet para encontrar as melhores ofertas e produtos de alta qualidade em tecnologia, casa e estilo de vida. Verificados por nossos especialistas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/shop" 
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
              >
                Ver Loja
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a 
                href="#features" 
                className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-300 bg-slate-800/50 backdrop-blur rounded-lg hover:bg-slate-800 transition-all border border-slate-700"
              >
                Saiba Mais
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Benefits */}
      <div id="features" className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Qualidade Verificada</h3>
                <p className="text-sm text-slate-500">Cada produto é escolhido a dedo</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Melhores Preços</h3>
                <p className="text-sm text-slate-500">Rastreamos o histórico de preços para você</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Plataformas Confiáveis</h3>
                <p className="text-sm text-slate-500">Amazon, Hotmart e mais</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Produtos em Destaque</h2>
              <p className="text-slate-500">Principais escolhas da semana</p>
            </div>
            <Link to="/shop" className="hidden md:flex items-center text-blue-600 font-medium hover:text-blue-700">
              Ver todos <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                 <div key={i} className="bg-white rounded-2xl h-96 animate-pulse">
                   <div className="h-48 bg-gray-200 rounded-t-2xl"></div>
                   <div className="p-6 space-y-4">
                     <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                     <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                     <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/shop" className="inline-block px-6 py-3 border border-gray-300 rounded-lg text-slate-700 font-medium hover:bg-gray-50">
              Ver Todos os Produtos
            </Link>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-white py-20 border-t border-gray-100">
         <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fique por dentro</h2>
            <p className="text-slate-500 mb-8 max-w-xl mx-auto">Receba notificações sobre novos lançamentos, ofertas exclusivas e análises de tecnologia diretamente em seu e-mail.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Digite seu endereço de e-mail" 
                className="flex-1 px-5 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition shadow-lg shadow-slate-900/10">
                Inscrever-se
              </button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default Home;