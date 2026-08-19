'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  X,
  Package,
} from 'lucide-react';
import { useProductStore } from '@/src/store/productStore';
import { useCategoryStore } from '@/src/store/categoryStore';

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, toggleProductActive, toggleProductFeatured } = useProductStore();
  const { categories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProductModal, setIsNewProductModal] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0]?.name || 'Chocolate Hamper',
    price: '',
    originalPrice: '',
    description: '',
    imageUrl: '',
    stock: 10,
    tag: '',
    featured: false,
    customizable: true,
    active: true,
  });

  const categoryNames = useMemo(() => {
    return ['All', ...categories.map((c) => c.name)];
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const openAddModal = () => {
    setFormData({
      name: '',
      category: categories[0]?.name || 'Chocolate Hamper',
      price: '',
      originalPrice: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      stock: 15,
      tag: 'New',
      featured: false,
      customizable: true,
      active: true,
    });
    setEditingProduct(null);
    setIsNewProductModal(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice || '',
      description: product.description,
      imageUrl: product.images?.[0] || product.image || '',
      stock: product.stock,
      tag: product.tag || '',
      featured: product.featured,
      customizable: product.customizable,
      active: product.active,
    });
    setEditingProduct(product);
    setIsNewProductModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const productPayload = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      description: formData.description.trim(),
      images: [formData.imageUrl.trim()],
      image: formData.imageUrl.trim(),
      stock: Number(formData.stock),
      tag: formData.tag.trim(),
      featured: formData.featured,
      customizable: formData.customizable,
      active: formData.active,
    };

    if (editingProduct) {
      await updateProduct(editingProduct.id, productPayload);
    } else {
      await addProduct(productPayload);
    }

    setIsNewProductModal(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--text)]">Product Management</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Manage your store's luxury hampers, bouquets, prices, and customization settings ({products.length} products).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="gold-btn inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
          >
            <Plus size={15} /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search product by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] font-medium focus:outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              {categoryNames.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table Container */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm overflow-hidden">
        {filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Product</th>
                  <th className="pb-3 font-bold">Category</th>
                  <th className="pb-3 font-bold">Price</th>
                  <th className="pb-3 font-bold">Stock</th>
                  <th className="pb-3 font-bold">Flags</th>
                  <th className="pb-3 font-bold">Active</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--bg)]/50 transition-colors">
                    
                    {/* Thumbnail & Title */}
                    <td className="py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[var(--border)] flex-shrink-0"
                        />
                        <div className="overflow-hidden">
                          <p className="font-bold text-[var(--text)] line-clamp-1">{p.name}</p>
                          <p className="text-[10px] text-[var(--text-muted)] truncate max-w-xs">{p.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5">
                      <span className="text-[11px] font-semibold text-[var(--accent-secondary)]">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 font-heading font-bold text-sm text-[var(--text)] whitespace-nowrap">
                      ₹{p.price.toLocaleString()}
                    </td>

                    {/* Stock */}
                    <td className="py-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.stock > 5
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {p.stock} in stock
                      </span>
                    </td>

                    {/* Flags (Featured / Customizable) */}
                    <td className="py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toggleProductFeatured(p.id)}
                          className={`p-1 rounded-md text-[10px] flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                            p.featured
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'text-[var(--text-muted)] hover:bg-[var(--bg)]'
                          }`}
                          title="Toggle Featured"
                        >
                          <Star size={12} className={p.featured ? 'fill-current text-amber-500' : ''} />
                          {p.featured ? 'Featured' : 'Standard'}
                        </button>

                        {p.customizable && (
                          <span className="text-[9px] uppercase font-bold bg-[var(--accent)]/15 text-[var(--accent-hover)] px-2 py-0.5 rounded-md">
                            Custom
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Active Switch */}
                    <td className="py-3.5 whitespace-nowrap">
                      <button
                        onClick={() => toggleProductActive(p.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                          p.active
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                        }`}
                      >
                        {p.active ? <Eye size={12} /> : <EyeOff size={12} />}
                        {p.active ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)]/15 text-[var(--text)] transition-colors cursor-pointer"
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Package size={36} className="mx-auto text-[var(--text-muted)] mb-3 opacity-40" />
            <p className="text-sm font-semibold text-[var(--text)]">No products match your search</p>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isNewProductModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <h2 className="font-heading text-2xl font-bold text-[var(--text)]">
                {editingProduct ? 'Edit Product' : 'Add New Gifting Product'}
              </h2>
              <button
                onClick={() => setIsNewProductModal(false)}
                className="p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-[var(--text)] uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artisanal Royal Chocolate Hamper"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] uppercase mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text)] uppercase mb-1">
                    Badge Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bestseller / Luxury Pick"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] uppercase mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1499"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text)] uppercase mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="1799"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--text)] uppercase mb-1">
                    Available Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] uppercase mb-1">
                  Product Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] uppercase mb-1">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of the luxury contents, wrapping, and occasion suitability..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[var(--border)]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  <span className="font-semibold text-[var(--text)]">Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.customizable}
                    onChange={(e) => setFormData({ ...formData, customizable: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  <span className="font-semibold text-[var(--text)]">Customizable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  <span className="font-semibold text-[var(--text)]">Active / Published</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsNewProductModal(false)}
                  className="outline-btn px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
