'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faPenToSquare,
  faTrashCan,
  faEye,
  faEyeSlash,
  faXmark,
  faRotate,
} from '@fortawesome/free-solid-svg-icons';
import { useCategoryStore } from '@/src/store/categoryStore';

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, toggleCategoryStatus, resetCategories } = useCategoryStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    group: 'Hampers',
    description: '',
    image: '',
    enabled: true,
  });

  const openAddModal = () => {
    setFormData({
      name: '',
      slug: '',
      group: 'Hampers',
      description: '',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      enabled: true,
    });
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      group: cat.group,
      description: cat.description,
      image: cat.image,
      enabled: cat.enabled,
    });
    setEditingCategory(cat);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      slug: formData.slug.trim() || formData.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
      group: formData.group,
      description: formData.description.trim(),
      image: formData.image.trim(),
      enabled: formData.enabled,
    };

    if (editingCategory) {
      await updateCategory(editingCategory.id, payload);
    } else {
      await addCategory(payload);
    }

    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      await deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--text)]">Category Management</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Organize gifting categories across Hampers and Gifts & Bouquets ({categories.length} categories).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={resetCategories}
            className="outline-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer"
            title="Reset to 12 Default Categories"
          >
            <FontAwesomeIcon icon={faRotate} className="text-xs" /> Reset Defaults
          </button>
          <button
            onClick={openAddModal}
            className="gold-btn inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" /> Add Category
          </button>
        </div>
      </div>

      {/* Categories Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-[var(--bg-subtle)]">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-full">
                {cat.group}
              </span>
              <span
                className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  cat.enabled
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-500 text-white'
                }`}
              >
                {cat.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>

            <div className="p-5 flex flex-col flex-grow justify-between gap-4">
              <div>
                <h3 className="font-heading text-xl font-bold text-[var(--text)] mb-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] font-mono text-[var(--accent-secondary)] mb-2">
                  /category/{cat.slug}
                </p>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
                <button
                  onClick={() => toggleCategoryStatus(cat.id)}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <FontAwesomeIcon icon={cat.enabled ? faEye : faEyeSlash} className="text-xs" />
                  {cat.enabled ? 'Visible' : 'Hidden'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)]/15 text-[var(--text)] transition-colors cursor-pointer"
                    title="Edit Category"
                  >
                    <FontAwesomeIcon icon={faPenToSquare} className="text-xs" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Delete Category"
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 my-8">
            
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <h2 className="font-heading text-2xl font-bold text-[var(--text)]">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-base" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-[var(--text)] uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Islamic Hamper"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text)] uppercase mb-1">
                    Group *
                  </label>
                  <select
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer"
                  >
                    <option value="Hampers">Hampers</option>
                    <option value="Gifts & Bouquets">Gifts & Bouquets</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[var(--text)] uppercase mb-1">
                    Slug (URL Key)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. islamic-hamper"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] uppercase mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--text)] uppercase mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Short description of this gifting category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="accent-[var(--accent)]"
                  />
                  <span className="font-semibold text-[var(--text)]">Enable / Display on Storefront</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="outline-btn px-5 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-md cursor-pointer"
                >
                  Save Category
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
