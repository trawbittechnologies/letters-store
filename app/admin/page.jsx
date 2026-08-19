'use client';

import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  IndianRupee,
  ArrowRight,
  MessageCircle,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useOrderStore } from '@/src/store/orderStore';
import { useProductStore } from '@/src/store/productStore';
import { useSettingsStore } from '@/src/store/settingsStore';

export default function AdminDashboardPage() {
  const { orders, updateOrderStatus } = useOrderStore();
  const { products } = useProductStore();
  const { settings } = useSettingsStore();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const confirmedOrders = orders.filter((o) => o.status === 'Confirmed').length;
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const recentOrders = orders.slice(0, 5);

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
    const message = `Hello ${order.customerName}, this is regarding your ${settings.brandName} Order #${order.id}.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${rawNumber}?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--text)]">Dashboard Overview</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Real-time status of orders, inventory, and WhatsApp fulfillment for {settings.brandName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="gold-btn inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
          >
            <Plus size={14} /> Add Product
          </Link>
          <Link
            href="/admin/orders"
            className="outline-btn inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            All Orders
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Total Orders */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag size={18} className="text-[var(--accent)]" />
          </div>
          <span className="font-heading text-3xl font-bold text-[var(--text)]">{totalOrders}</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Orders</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <span className="font-heading text-3xl font-bold text-amber-600 dark:text-amber-400">{pendingOrders}</span>
        </div>

        {/* Confirmed Orders */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Confirmed</span>
            <CheckCircle2 size={18} className="text-blue-500" />
          </div>
          <span className="font-heading text-3xl font-bold text-blue-600 dark:text-blue-400">{confirmedOrders}</span>
        </div>

        {/* Delivered Orders */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Delivered</span>
            <Truck size={18} className="text-emerald-500" />
          </div>
          <span className="font-heading text-3xl font-bold text-emerald-600 dark:text-emerald-400">{deliveredOrders}</span>
        </div>

        {/* Total Products */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Products</span>
            <Package size={18} className="text-[var(--accent-secondary)]" />
          </div>
          <span className="font-heading text-3xl font-bold text-[var(--text)]">{products.length}</span>
        </div>

        {/* Total Revenue */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-[var(--text-muted)] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Revenue</span>
            <IndianRupee size={18} className="text-[var(--accent)]" />
          </div>
          <span className="font-heading text-2xl font-bold text-[var(--accent-hover)]">
            ₹{totalRevenue.toLocaleString()}
          </span>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-[var(--text)]">Recent Orders</h2>
            <p className="text-xs text-[var(--text-muted)]">Latest gift inquiries received from customers</p>
          </div>

          <Link
            href="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-[var(--accent-secondary)] hover:underline flex items-center gap-1"
          >
            View All ({orders.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-bold">Order ID</th>
                <th className="pb-3 font-bold">Customer</th>
                <th className="pb-3 font-bold">Items</th>
                <th className="pb-3 font-bold">Total</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/60">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[var(--bg)]/50 transition-colors">
                  
                  {/* Order ID */}
                  <td className="py-3.5 font-mono font-bold text-[var(--accent-hover)]">
                    {order.id}
                  </td>

                  {/* Customer */}
                  <td className="py-3.5">
                    <p className="font-semibold text-[var(--text)]">{order.customerName}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{order.phone}</p>
                  </td>

                  {/* Items */}
                  <td className="py-3.5 max-w-xs truncate">
                    <span className="font-medium text-[var(--text)]">
                      {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                    </span>
                  </td>

                  {/* Total */}
                  <td className="py-3.5 font-heading font-bold text-sm text-[var(--text)]">
                    ₹{Number(order.total || 0).toLocaleString()}
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
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleContactCustomer(order)}
                        className="p-1.5 rounded-lg bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors cursor-pointer"
                        title="Contact Customer on WhatsApp"
                      >
                        <MessageCircle size={15} />
                      </button>
                      <Link
                        href="/admin/orders"
                        className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)] transition-colors"
                        title="View Full Details"
                      >
                        <ExternalLink size={15} />
                      </Link>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
