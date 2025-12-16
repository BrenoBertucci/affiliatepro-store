import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/Product/ProductCard';
import { ProductService } from '../services/supabaseClient';
import { Product, FilterState } from '../types';
import { CATEGORIES } from '../constants';
import useDebounce from '../hooks/useDebounce';

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortOption, setSortOption] = useState<string>('newest');

  // Filter States
  const [filters, setFilters] = useState<FilterState>({
    category: 'Todos',
    minPrice: 0,
    maxPrice: 10000,
    search: '',
  });

  // Optimize search with debounce to prevent excessive re-renders during typing
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    setFilters(prev => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search
      const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(filters.search.toLowerCase());
      // Category
      const matchesCategory = filters.category === 'Todos' || product.category === filters.category;
      // Price
      const matchesPrice = product.price >= filters.minPrice && product.price <= filters.maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'price_asc': return a.price - b.price;
        case 'price_desc': return b.price - a.price;
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'newest': default: return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      }
    });
  }, [products, filters, sortOption]);

  const handleCategoryChange = (cat: string) => {
    setFilters(prev => ({ ...prev, category: cat }));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-slate-900">Loja</h1>

            <div className="flex items-center gap-4 flex-1 md:justify-end">
              <div className="relative flex-1 md:max-w-md group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 text-slate-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
                />
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="hidden md:block pl-3 pr-8 py-2 border border-gray-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm cursor-pointer"
              >
                <option value="newest">Mais Recentes</option>
                <option value="price_asc">Preço: Menor - Maior</option>
                <option value="price_desc">Preço: Maior - Menor</option>
                <option value="name_asc">Nome: A - Z</option>
                <option value="name_desc">Nome: Z - A</option>
              </select>

              <button
                className="md:hidden p-2 bg-white border border-gray-200 rounded-lg text-slate-600"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar Filters */}
          <div className={`
            md:w-64 flex-shrink-0 
            ${showMobileFilters ? 'fixed inset-0 z-40 bg-white p-6 overflow-y-auto' : 'hidden md:block'}
          `}>
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="text-xl font-bold">Filtros</h2>
              <button onClick={() => setShowMobileFilters(false)}><X /></button>
            </div>

            <div className="space-y-8 sticky top-24">
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter size={16} /> Categorias
                </h3>
                <div className="space-y-2">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className="flex items-center group cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => handleCategoryChange(cat)}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className={`ml-3 text-sm group-hover:text-blue-600 transition-colors ${filters.category === cat ? 'text-blue-600 font-medium' : 'text-slate-600'}`}>
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-4">Preço Máximo: R$ {filters.maxPrice}</h3>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                  <span>R$ 0</span>
                  <span>R$ 10000+</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setFilters({ category: 'Todos', minPrice: 0, maxPrice: 10000, search: '' });
                    setSearchTerm('');
                    setShowMobileFilters(false);
                  }}
                  className="text-sm text-slate-500 hover:text-red-500 transition-colors w-full text-left"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-slate-500">
              Mostrando <span className="font-semibold text-slate-900">{filteredProducts.length}</span> resultados
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">Nenhum produto encontrado</h3>
                <p className="text-slate-500 mt-1">Tente ajustar sua busca ou filtros.</p>
                <button
                  onClick={() => {
                    setFilters({ category: 'Todos', minPrice: 0, maxPrice: 10000, search: '' });
                    setSearchTerm('');
                  }}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;