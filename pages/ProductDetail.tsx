import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ExternalLink, Share2, ArrowLeft, ShieldCheck, Clock } from 'lucide-react';
import { ProductService, AnalyticsService } from '../services/supabaseClient';
import { Product } from '../types';
import Button from '../components/ui/Button';
import ProductCard from '../components/Product/ProductCard';
import { useToast } from '../context/ToastContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const data = await ProductService.getById(id);
      setProduct(data || null);

      if (data) {
        AnalyticsService.trackView(id);
        // Fetch related products
        // Optimization: Use server-side filtering to avoid fetching all products
        const related = await ProductService.getRelated(data.category, data.id);
        setRelatedProducts(related);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast('Link copiado para a área de transferência!', 'success');
    } catch (err) {
      addToast('Falha ao copiar link.', 'error');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h2 className="text-2xl font-bold text-slate-800">Produto não encontrado</h2>
      <Link to="/shop" className="text-blue-600 mt-4 hover:underline">Voltar para Loja</Link>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-10 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/shop" className="inline-flex items-center text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Voltar para Loja
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
            {/* Image Section */}
            <div className="bg-gray-100 p-8 flex items-center justify-center relative group">
              <img
                src={product.image_url}
                alt={product.name}
                className="max-h-[500px] w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm text-slate-700">
                {product.affiliate_platform}
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-blue-600 font-bold tracking-wider text-xs uppercase bg-blue-50 px-2 py-1 rounded mb-3 inline-block">
                    {product.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {product.name}
                  </h1>
                </div>
                <button
                  onClick={handleShare}
                  className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-gray-50 transition-colors"
                  title="Compartilhar"
                >
                  <Share2 size={24} />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="text-slate-500 text-sm">{product.review_count || 0} avaliações</span>
              </div>

              <div className="text-4xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
                R$ {product.price.toFixed(2)}
                <span className="text-base font-normal text-slate-400 line-through mt-2">R$ {(product.price * 1.2).toFixed(2)}</span>
              </div>

              <div className="prose prose-slate mb-8 text-slate-600 leading-relaxed">
                <p>{product.description}</p>
                <ul className="list-disc pl-5 mt-4 space-y-1">
                  <li>Qualidade premium verificada</li>
                  <li>Checkout seguro via {product.affiliate_platform}</li>
                  <li>Bem avaliado pelos usuários</li>
                </ul>
              </div>

              <div className="mt-auto space-y-4">
                <a
                  href={product.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => AnalyticsService.trackClick(product.id)}
                  className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center text-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Comprar na {product.affiliate_platform} <ExternalLink className="ml-2" size={20} />
                </a>

                <div className="flex items-center justify-center space-x-6 text-sm text-slate-500 pt-4 border-t border-gray-100">
                  <div className="flex items-center"><ShieldCheck size={16} className="mr-1 text-green-500" /> Vendedor Verificado</div>
                  <div className="flex items-center"><Clock size={16} className="mr-1 text-blue-500" /> Preço Verificado</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;