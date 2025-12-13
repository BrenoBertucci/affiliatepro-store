import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ExternalLink, Tag } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-50">
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full z-10 shadow-sm flex items-center gap-1">
            <Star size={10} fill="currentColor" /> Destaque
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-xs font-semibold px-2 py-1 rounded-md z-10 shadow-sm border border-gray-100">
          {product.affiliate_platform}
        </span>
        <img
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      <div className="p-5">
        <div className="flex items-center space-x-2 mb-2">
          <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            {product.category || 'Geral'}
          </span>
          <div className="flex items-center text-yellow-400 text-xs">
            <Star size={12} fill="currentColor" />
            <span className="text-slate-400 ml-1">{product.rating || 0}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-end justify-between mt-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Preço</span>
            <span className="text-xl font-extrabold text-slate-900">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

          <Link
            to={`/product/${product.id}`}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
          >
            <ExternalLink size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;