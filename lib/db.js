import fs from 'fs';
import path from 'path';
import {
  defaultProducts,
  defaultCategories,
  defaultOrders,
  defaultSettings,
  defaultSaleBanner,
  defaultFestivalHampers,
} from '@/src/data/initialData';

export {
  defaultProducts,
  defaultCategories,
  defaultOrders,
  defaultSettings,
  defaultSaleBanner,
  defaultFestivalHampers,
};

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', '.data')
  : path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Internal DB state cache
let memoryDb = null;

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    console.warn('Could not create directory, running in-memory', e.message);
  }
}

export function getDb() {
  if (memoryDb) return memoryDb;

  ensureDataDir();

  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      memoryDb = JSON.parse(data);
      if (!memoryDb.saleBanner) memoryDb.saleBanner = defaultSaleBanner;
      if (!memoryDb.festivalHampers) memoryDb.festivalHampers = defaultFestivalHampers;
      return memoryDb;
    }
  } catch (err) {
    console.error('Error reading db.json, re-initializing defaults', err);
  }

  // Initialize with defaults
  memoryDb = {
    products: defaultProducts,
    categories: defaultCategories,
    orders: defaultOrders,
    settings: defaultSettings,
    saleBanner: defaultSaleBanner,
    festivalHampers: defaultFestivalHampers,
  };

  saveDb(memoryDb);
  return memoryDb;
}

export function saveDb(data) {
  memoryDb = data;
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not save to db.json file:', err.message);
  }
}

// ---------------- Product Operations ----------------
export function getProducts() {
  const db = getDb();
  return db.products || [];
}

export function getProductBySlug(slug) {
  const products = getProducts();
  return products.find((p) => p.slug === slug || p.id === slug);
}

export function createProduct(productData) {
  const db = getDb();
  const slug =
    productData.slug ||
    productData.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

  const newProduct = {
    ...productData,
    id: `prod-${Date.now()}`,
    slug,
    categorySlug: (productData.category || '').toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
    price: Number(productData.price) || 0,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    images: productData.images && productData.images.length > 0 ? productData.images : ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'],
    stock: Number(productData.stock) || 10,
    featured: !!productData.featured,
    customizable: productData.customizable !== undefined ? !!productData.customizable : true,
    active: productData.active !== undefined ? !!productData.active : true,
    rating: 5.0,
    reviewsCount: 0,
    tag: productData.tag || 'New',
    createdAt: new Date().toISOString(),
  };

  db.products = [newProduct, ...(db.products || [])];
  saveDb(db);
  return newProduct;
}

export function updateProduct(id, updateData) {
  const db = getDb();
  let updatedItem = null;

  db.products = (db.products || []).map((p) => {
    if (p.id === id || p.slug === id) {
      const cat = updateData.category || p.category;
      updatedItem = {
        ...p,
        ...updateData,
        price: updateData.price !== undefined ? Number(updateData.price) : p.price,
        originalPrice: updateData.originalPrice !== undefined ? Number(updateData.originalPrice) : p.originalPrice,
        stock: updateData.stock !== undefined ? Number(updateData.stock) : p.stock,
        categorySlug: cat.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
        updatedAt: new Date().toISOString(),
      };
      return updatedItem;
    }
    return p;
  });

  saveDb(db);
  return updatedItem;
}

export function deleteProduct(id) {
  const db = getDb();
  const initialLength = (db.products || []).length;
  db.products = (db.products || []).filter((p) => p.id !== id && p.slug !== id);
  saveDb(db);
  return db.products.length < initialLength;
}

// ---------------- Category Operations ----------------
export function getCategories() {
  const db = getDb();
  return db.categories || [];
}

export function createCategory(catData) {
  const db = getDb();
  const slug =
    catData.slug ||
    catData.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

  const newCat = {
    ...catData,
    id: `cat-${Date.now()}`,
    slug,
    enabled: catData.enabled ?? true,
    itemCount: 0,
  };

  db.categories = [...(db.categories || []), newCat];
  saveDb(db);
  return newCat;
}

export function updateCategory(id, updateData) {
  const db = getDb();
  let updatedItem = null;

  db.categories = (db.categories || []).map((c) => {
    if (c.id === id || c.slug === id) {
      updatedItem = { ...c, ...updateData };
      return updatedItem;
    }
    return c;
  });

  saveDb(db);
  return updatedItem;
}

export function deleteCategory(id) {
  const db = getDb();
  const initialLength = (db.categories || []).length;
  db.categories = (db.categories || []).filter((c) => c.id !== id && c.slug !== id);
  saveDb(db);
  return db.categories.length < initialLength;
}

// ---------------- Order Operations ----------------
export function getOrders() {
  const db = getDb();
  return db.orders || [];
}

export function getOrderById(id) {
  const orders = getOrders();
  return orders.find((o) => o.id === id);
}

export function createOrder(orderData) {
  const db = getDb();
  const count = (db.orders || []).length + 1;
  const year = new Date().getFullYear();
  const orderId = `LET-${year}-${String(count).padStart(4, '0')}`;

  const newOrder = {
    id: orderId,
    customerName: orderData.customerName || orderData.name || 'Anonymous Customer',
    phone: orderData.phone || '',
    whatsappNumber: orderData.whatsappNumber || orderData.phone || '',
    address: orderData.address || '',
    pincode: orderData.pincode || '',
    deliveryDate: orderData.deliveryDate || '',
    occasion: orderData.occasion || 'Special Occasion',
    items: orderData.items || [],
    subtotal: Number(orderData.subtotal) || 0,
    total: Number(orderData.total) || Number(orderData.subtotal) || 0,
    customization: orderData.customization || '',
    specialInstructions: orderData.specialInstructions || orderData.notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders = [newOrder, ...(db.orders || [])];
  saveDb(db);
  return newOrder;
}

export function updateOrderStatus(orderId, newStatus) {
  const db = getDb();
  let updatedOrder = null;

  db.orders = (db.orders || []).map((order) => {
    if (order.id === orderId) {
      updatedOrder = {
        ...order,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      return updatedOrder;
    }
    return order;
  });

  saveDb(db);
  return updatedOrder;
}

export function deleteOrder(orderId) {
  const db = getDb();
  const initialLength = (db.orders || []).length;
  db.orders = (db.orders || []).filter((o) => o.id !== orderId);
  saveDb(db);
  return db.orders.length < initialLength;
}

// ---------------- Settings Operations ----------------
export function getSettings() {
  const db = getDb();
  return db.settings || defaultSettings;
}

export function updateSettings(newSettings) {
  const db = getDb();
  db.settings = { ...(db.settings || defaultSettings), ...newSettings };
  saveDb(db);
  return db.settings;
}

// ---------------- Sale Banner Operations ----------------
export function getSaleBanner() {
  const db = getDb();
  return db.saleBanner || defaultSaleBanner;
}

export function updateSaleBanner(newBanner) {
  const db = getDb();
  db.saleBanner = { ...(db.saleBanner || defaultSaleBanner), ...newBanner };
  saveDb(db);
  return db.saleBanner;
}

// ---------------- Festival Hampers Operations ----------------
export function getFestivalHampers() {
  const db = getDb();
  return db.festivalHampers || defaultFestivalHampers;
}

export function updateFestivalHampersSection(sectionData) {
  const db = getDb();
  const current = db.festivalHampers || defaultFestivalHampers;
  db.festivalHampers = {
    ...current,
    ...sectionData,
    items: sectionData.items || current.items,
  };
  saveDb(db);
  return db.festivalHampers;
}

export function addFestivalHamper(itemData) {
  const db = getDb();
  const current = db.festivalHampers || defaultFestivalHampers;
  const newItem = {
    ...itemData,
    id: `fest-${Date.now()}`,
    price: Number(itemData.price) || 0,
    originalPrice: itemData.originalPrice ? Number(itemData.originalPrice) : undefined,
    enabled: itemData.enabled !== false,
    createdAt: new Date().toISOString(),
  };
  db.festivalHampers = {
    ...current,
    items: [newItem, ...(current.items || [])],
  };
  saveDb(db);
  return { newItem, festivalHampers: db.festivalHampers };
}

export function updateFestivalHamper(id, itemData) {
  const db = getDb();
  const current = db.festivalHampers || defaultFestivalHampers;
  const updatedItems = (current.items || []).map((it) => {
    if (it.id === id) {
      return {
        ...it,
        ...itemData,
        price: itemData.price !== undefined ? Number(itemData.price) : it.price,
        originalPrice: itemData.originalPrice !== undefined ? Number(itemData.originalPrice) : it.originalPrice,
        updatedAt: new Date().toISOString(),
      };
    }
    return it;
  });
  db.festivalHampers = {
    ...current,
    items: updatedItems,
  };
  saveDb(db);
  return db.festivalHampers;
}

export function deleteFestivalHamper(id) {
  const db = getDb();
  const current = db.festivalHampers || defaultFestivalHampers;
  const updatedItems = (current.items || []).filter((it) => it.id !== id);
  db.festivalHampers = {
    ...current,
    items: updatedItems,
  };
  saveDb(db);
  return db.festivalHampers;
}

export function toggleFestivalHamper(id) {
  const db = getDb();
  const current = db.festivalHampers || defaultFestivalHampers;
  const updatedItems = (current.items || []).map((it) => {
    if (it.id === id) {
      return { ...it, enabled: !it.enabled };
    }
    return it;
  });
  db.festivalHampers = {
    ...current,
    items: updatedItems,
  };
  saveDb(db);
  return db.festivalHampers;
}

