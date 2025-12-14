import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, BarChart2, DollarSign, Package, X } from 'lucide-react';
import { ProductService } from '../services/supabaseClient';
import { Product } from '../types';
import Button from '../components/ui/Button';
import { CATEGORIES, PLATFORMS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../context/ToastContext';

const Admin: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [activeTab, setActiveTab] = useState<'products' | 'analytics'>('products');

    const { addToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '', price: 0, description: '', category: 'Eletrônicos', affiliate_platform: 'Amazon', image_url: '', affiliate_link: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (error) {
            console.error('Falha ao carregar produtos:', error);
            addToast('Falha ao carregar produtos. Recarregue a página.', 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            try {
                await ProductService.delete(id);
                addToast('Produto excluído com sucesso!', 'success');
                loadProducts();
            } catch (error) {
                console.error('Erro ao excluir:', error);
                addToast('Erro ao excluir produto.', 'error');
            }
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (editingProduct) {
                await ProductService.update(editingProduct.id, formData);
                addToast('Produto atualizado com sucesso!', 'success');
            } else {
                await ProductService.create(formData as any);
                addToast('Produto criado com sucesso!', 'success');
            }

            setIsModalOpen(false);
            setEditingProduct(null);
            setFormData({ name: '', price: 0, description: '', category: 'Eletrônicos', affiliate_platform: 'Amazon', image_url: '', affiliate_link: '' });
            loadProducts();
        } catch (error: any) {
            console.error('Erro ao salvar produto:', error);
            addToast(`Erro ao salvar: ${error.message || 'Verifique sua conexão ou permissões'}`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Mock analytics data
    const data = [
        { name: 'Seg', clicks: 400 },
        { name: 'Ter', clicks: 300 },
        { name: 'Qua', clicks: 550 },
        { name: 'Qui', clicks: 450 },
        { name: 'Sex', clicks: 700 },
        { name: 'Sab', clicks: 600 },
        { name: 'Dom', clicks: 800 },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
                    <div className="flex space-x-2">
                        <Button
                            variant={activeTab === 'products' ? 'primary' : 'outline'}
                            onClick={() => setActiveTab('products')}
                            size="sm"
                        >
                            <Package size={16} className="mr-2" /> Produtos
                        </Button>
                        <Button
                            variant={activeTab === 'analytics' ? 'primary' : 'outline'}
                            onClick={() => setActiveTab('analytics')}
                            size="sm"
                        >
                            <BarChart2 size={16} className="mr-2" /> Estatísticas
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4"><Package size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Total de Produtos</p>
                            <p className="text-2xl font-bold text-slate-900">{products.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4"><DollarSign size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Receita Est.</p>
                            <p className="text-2xl font-bold text-slate-900">R$ 6.250,00</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4"><BarChart2 size={24} /></div>
                        <div>
                            <p className="text-sm text-gray-500">Total de Cliques</p>
                            <p className="text-2xl font-bold text-slate-900">12.450</p>
                        </div>
                    </div>
                </div>

                {activeTab === 'analytics' ? (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 animate-fade-in">
                        <h3 className="text-lg font-bold mb-6">Cliques da Semana</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="clicks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-800">Lista de Produtos</h3>
                            <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
                                <Plus size={16} className="mr-2" /> Novo Produto
                            </Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Produto</th>
                                        <th className="px-6 py-4">Preço</th>
                                        <th className="px-6 py-4">Categoria</th>
                                        <th className="px-6 py-4">Plataforma</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 flex items-center">
                                                <img src={product.image_url} alt="" className="w-10 h-10 rounded-md object-cover mr-3" />
                                                <span className="font-medium text-slate-900 truncate max-w-xs">{product.name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">R$ {product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">{product.category}</span></td>
                                            <td className="px-6 py-4 text-slate-600">{product.affiliate_platform}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button onClick={() => handleEdit(product)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold text-slate-900">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                                    <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                                    <input required type="url" value={formData.image_url} onChange={e => setFormData({ ...formData, image_url: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link de Afiliado</label>
                                    <input required type="url" value={formData.affiliate_link} onChange={e => setFormData({ ...formData, affiliate_link: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                    <textarea rows={4} required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                                    <select value={formData.affiliate_platform} onChange={e => setFormData({ ...formData, affiliate_platform: e.target.value as any })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>Cancelar</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Salvando...' : 'Salvar Produto'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;