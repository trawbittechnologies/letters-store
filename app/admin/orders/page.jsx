'use client';

import { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faFilter,
  faEye,
  faTrashCan,
  faXmark,
  faLocationDot,
  faUser,
  faBagShopping,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useOrderStore } from '@/src/store/orderStore';
import { useSettingsStore } from '@/src/store/settingsStore';

const statusFilters = ['All', 'Pending', 'Confirmed', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useOrderStore();
  const { settings } = useSettingsStore();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrderModal, setActiveOrderModal] = useState(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (selectedStatus !== 'All' && order.status !== selectedStatus) {
        return false;
      }
      // Search filter (Order ID, customer name, phone)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesName = order.customerName.toLowerCase().includes(q);
        const matchesPhone = (order.phone || '').toLowerCase().includes(q);
        if (!matchesId && !matchesName && !matchesPhone) return false;
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300';
      case 'Preparing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300';
      case 'Ready':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300';
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const handleContactCustomer = (order) => {
    const rawNumber = (order.whatsappNumber || order.phone || '').replace(/[^\d]/g, '');
    const message = `Hello ${order.customerName}, this is ${settings.brandName} regarding your Order #${order.id}. Current Status: ${order.status}.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${rawNumber}?text=${encoded}`, '_blank');
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteOrder(orderId);
      if (activeOrderModal?.id === orderId) {
        setActiveOrderModal(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--text)]">Orders Management</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Track, update, and fulfill incoming WhatsApp gifting orders ({orders.length} total).
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          
          {/* Search */}
          <div className="w-full sm:flex-1 relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-xs" />
            <input
              type="text"
              placeholder="Search by Order ID (LET-2026-...), Customer Name, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-muted)] mr-1 flex items-center gap-1 flex-shrink-0">
            <FontAwesomeIcon icon={faFilter} className="text-[10px]" /> Status:
          </span>
          {statusFilters.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`text-xs uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all flex-shrink-0 font-semibold cursor-pointer ${
                selectedStatus === st
                  ? 'bg-[var(--accent)] text-[var(--text)] border-[var(--accent)] shadow-sm'
                  : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-[var(--bg)]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 shadow-sm overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  <th className="pb-3 font-bold">Order ID</th>
                  <th className="pb-3 font-bold">Customer</th>
                  <th className="pb-3 font-bold">Items & Qty</th>
                  <th className="pb-3 font-bold">Total</th>
                  <th className="pb-3 font-bold">Delivery Date</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/60">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--bg)]/50 transition-colors">
                    
                    {/* Order ID */}
                    <td className="py-3.5 font-mono font-bold text-[var(--accent-hover)]">
                      {order.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5">
                      <p className="font-bold text-[var(--text)]">{order.customerName}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{order.phone}</p>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 max-w-xs">
                      <p className="font-medium text-[var(--text)] truncate">
                        {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                      </p>
                      <p className="text-[10px] text-[var(--text-muted)]">{order.items.length} items</p>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 font-heading font-bold text-sm text-[var(--text)] whitespace-nowrap">
                      ₹{Number(order.total || 0).toLocaleString()}
                    </td>

                    {/* Delivery Date */}
                    <td className="py-3.5 whitespace-nowrap text-[11px] text-[var(--text-muted)]">
                      {order.deliveryDate || 'Earliest'}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3.5">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${getStatusBadgeClass(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready">Ready</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveOrderModal(order)}
                          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-[var(--accent)]/15 text-[var(--text)] transition-colors cursor-pointer"
                          title="View Complete Order"
                        >
                          <FontAwesomeIcon icon={faEye} className="text-xs" />
                        </button>

                        <button
                          onClick={() => handleContactCustomer(order)}
                          className="p-1.5 rounded-lg bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer"
                          title="Open WhatsApp Chat"
                        >
                          <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                        </button>

                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 rounded-lg border border-[var(--border)] hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <FontAwesomeIcon icon={faTrashCan} className="text-xs" />
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
            <FontAwesomeIcon icon={faBagShopping} className="mx-auto text-[var(--text-muted)] mb-3 text-3xl opacity-40 block" />
            <p className="text-sm font-semibold text-[var(--text)]">No orders found</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Try resetting the status filter or search query.</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {activeOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--accent-secondary)]">
                  Order Details
                </span>
                <h2 className="font-heading text-2xl font-bold text-[var(--text)]">
                  Order #{activeOrderModal.id}
                </h2>
              </div>
              <button
                onClick={() => setActiveOrderModal(null)}
                className="p-2 rounded-full hover:bg-[var(--bg)] text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} className="text-base" />
              </button>
            </div>

            {/* Status Control */}
            <div className="flex items-center justify-between bg-[var(--bg)] p-4 rounded-2xl border border-[var(--border)]">
              <div>
                <p className="text-xs font-bold text-[var(--text)]">Order Status</p>
                <p className="text-[11px] text-[var(--text-muted)]">Created: {new Date(activeOrderModal.createdAt).toLocaleString()}</p>
              </div>
              <select
                value={activeOrderModal.status}
                onChange={(e) => {
                  updateOrderStatus(activeOrderModal.id, e.target.value);
                  setActiveOrderModal({ ...activeOrderModal, status: e.target.value });
                }}
                className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer ${getStatusBadgeClass(
                  activeOrderModal.status
                )}`}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Customer & Shipping Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] space-y-2">
                <h4 className="font-bold text-[var(--text)] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faUser} className="text-[var(--accent)] text-xs" /> Customer Info
                </h4>
                <p><strong>Name:</strong> {activeOrderModal.customerName}</p>
                <p><strong>Mobile:</strong> {activeOrderModal.phone}</p>
                <p><strong>WhatsApp:</strong> {activeOrderModal.whatsappNumber || activeOrderModal.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)] space-y-2">
                <h4 className="font-bold text-[var(--text)] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faLocationDot} className="text-[var(--accent-secondary)] text-xs" /> Delivery & Occasion
                </h4>
                <p><strong>Address:</strong> {activeOrderModal.address}</p>
                <p><strong>Pincode:</strong> {activeOrderModal.pincode}</p>
                <p><strong>Preferred Date:</strong> {activeOrderModal.deliveryDate}</p>
                <p><strong>Occasion:</strong> {activeOrderModal.occasion}</p>
              </div>
            </div>

            {/* Items Ordered List */}
            <div className="space-y-3">
              <h4 className="font-heading font-bold text-base text-[var(--text)] border-b border-[var(--border)] pb-2">
                Items Ordered
              </h4>
              <div className="space-y-2.5">
                {activeOrderModal.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-bold text-[var(--text)]">{item.name}</p>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-[var(--text)]">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-center pt-2 font-bold text-sm text-[var(--text)]">
                <span>Total Amount:</span>
                <span className="font-heading text-xl text-[var(--accent-hover)]">
                  ₹{Number(activeOrderModal.total || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Customization Details & Special Instructions */}
            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
                <p className="font-bold text-[var(--text)] uppercase mb-1 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[var(--accent)] text-xs" /> Customization & Greeting Card
                </p>
                <p className="text-[var(--text-muted)] whitespace-pre-line leading-relaxed">
                  {activeOrderModal.customization || 'None requested'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]">
                <p className="font-bold text-[var(--text)] uppercase mb-1">Special Delivery Instructions</p>
                <p className="text-[var(--text-muted)]">
                  {activeOrderModal.specialInstructions || 'None'}
                </p>
              </div>
            </div>

            {/* Action Buttons in Modal */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
              <button
                onClick={() => handleContactCustomer(activeOrderModal)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider bg-[#25D366] text-white hover:bg-[#1EBE5D] shadow-md transition-all cursor-pointer"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="text-base" /> Contact on WhatsApp
              </button>

              <button
                onClick={() => setActiveOrderModal(null)}
                className="w-full sm:w-auto outline-btn py-3 px-6 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
