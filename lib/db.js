import fs from 'fs';
import path from 'path';
import {
  defaultProducts,
  defaultCategories,
  defaultOrders,
  defaultSettings,
  defaultSaleBanner,
  defaultFestivalHampers,
  defaultFestivals,
} from '@/src/data/initialData';

export {
  defaultProducts,
  defaultCategories,
  defaultOrders,
  defaultSettings,
  defaultSaleBanner,
  defaultFestivalHampers,
  defaultFestivals,
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
      if (!memoryDb.festivals || memoryDb.festivals.length === 0) {
        memoryDb.festivals = defaultFestivals;
      }
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
    festivals: defaultFestivals,
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

// ---------------- Multi-Festival & Celebration Operations ----------------

/**
 * Calculates dynamic status: ACTIVE | PRE_BOOKING | UPCOMING | ENDED | DRAFT
 */
export function computeFestivalStatus(festival, currentDate = new Date()) {
  if (!festival) return 'INACTIVE';
  if (festival.status !== 'published' && festival.active === false) return 'DRAFT';

  const now = new Date(currentDate).getTime();
  const start = new Date(festival.startDate + 'T00:00:00').getTime();
  const end = new Date(festival.endDate + 'T23:59:59').getTime();

  let preStart;
  if (festival.preBookingStartDate) {
    preStart = new Date(festival.preBookingStartDate + 'T00:00:00').getTime();
  } else {
    const sDate = new Date(festival.startDate);
    sDate.setMonth(sDate.getMonth() - 1);
    preStart = sDate.getTime();
  }

  if (now > end) {
    return 'ENDED';
  }
  if (now >= start && now <= end) {
    return 'ACTIVE';
  }
  if (now < start) {
    if (festival.preBookingEnabled && now >= preStart) {
      return 'PRE_BOOKING';
    }
    return 'UPCOMING';
  }
  return 'UPCOMING';
}

/**
 * Resolves the showcase festival according to strict priority:
 * 1. Current active festival (startDate <= now <= endDate)
 * 2. Upcoming festival within 1-month pre-booking window (preBookingStartDate <= now < startDate & preBookingEnabled) - prioritized by nearest startDate
 * 3. Otherwise null (do not display festival section)
 */
export function resolveShowcaseFestival(festivals = [], currentDate = new Date()) {
  const published = (festivals || []).filter((f) => f.status === 'published' || (f.status !== 'draft' && f.active !== false));
  const evaluated = published.map((f) => ({
    ...f,
    computedStatus: computeFestivalStatus(f, currentDate),
  }));

  // Priority 1: Current active festival
  const activeFestivals = evaluated.filter((f) => f.computedStatus === 'ACTIVE');
  if (activeFestivals.length > 0) {
    activeFestivals.sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
    return activeFestivals[0];
  }

  // Priority 2: Upcoming festival in pre-booking window
  const preBookingFestivals = evaluated.filter((f) => f.computedStatus === 'PRE_BOOKING');
  if (preBookingFestivals.length > 0) {
    // Prioritize nearest upcoming festival
    preBookingFestivals.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    return preBookingFestivals[0];
  }

  // Priority 3: No eligible festival
  return null;
}

export function getFestivals() {
  const db = getDb();
  const list = db.festivals && db.festivals.length > 0 ? db.festivals : defaultFestivals;
  return list.map((f) => ({
    ...f,
    computedStatus: computeFestivalStatus(f),
  }));
}

export function getFestivalById(id) {
  const festivals = getFestivals();
  return festivals.find((f) => f.id === id);
}

export function createFestival(data) {
  const db = getDb();

  // Calculate preBookingStartDate default (1 month before startDate) if not supplied
  let preBookingStartDate = data.preBookingStartDate;
  if (!preBookingStartDate && data.startDate) {
    const sDate = new Date(data.startDate);
    sDate.setMonth(sDate.getMonth() - 1);
    preBookingStartDate = sDate.toISOString().split('T')[0];
  }

  const newFestival = {
    id: `fest-${Date.now()}`,
    name: data.name || 'New Celebration',
    title: data.title || data.name || 'Special Festive Atelier',
    subtitle: data.subtitle || 'Celebrations & Cultural Curations',
    tagline: data.tagline || '',
    description: data.description || '',
    calligraphy: data.calligraphy || 'Festive Warmth',
    badge: data.badge || 'FESTIVE DROP',
    banner: data.banner || 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=1200&q=85',
    startDate: data.startDate || new Date().toISOString().split('T')[0],
    endDate: data.endDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    preBookingEnabled: data.preBookingEnabled !== undefined ? !!data.preBookingEnabled : true,
    preBookingStartDate: preBookingStartDate || data.startDate,
    status: data.status || 'published',
    announcement: data.announcement || '✨ Express Delivery • Live Photo Approval Before Dispatch',
    highlightTag1: data.highlightTag1 || 'Artisanal Keepsake',
    highlightTag2: data.highlightTag2 || 'Handcrafted Confections',
    highlightTag3: data.highlightTag3 || 'Handwritten Calligraphy Card',
    products: Array.isArray(data.products) ? data.products : [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.festivals = [newFestival, ...(db.festivals || [])];
  saveDb(db);
  return { ...newFestival, computedStatus: computeFestivalStatus(newFestival) };
}

export function updateFestival(id, updateData) {
  const db = getDb();
  let updatedFestival = null;

  db.festivals = (db.festivals || defaultFestivals).map((f) => {
    if (f.id === id) {
      // Re-calculate preBookingStartDate default if startDate changed and preBookingStartDate not explicitly provided
      let preBookingStartDate = updateData.preBookingStartDate !== undefined ? updateData.preBookingStartDate : f.preBookingStartDate;
      if (updateData.startDate && !updateData.preBookingStartDate && (!f.preBookingStartDate || f.preBookingStartDate === f.startDate)) {
        const sDate = new Date(updateData.startDate);
        sDate.setMonth(sDate.getMonth() - 1);
        preBookingStartDate = sDate.toISOString().split('T')[0];
      }

      updatedFestival = {
        ...f,
        ...updateData,
        preBookingStartDate,
        products: updateData.products !== undefined ? updateData.products : f.products,
        updatedAt: new Date().toISOString(),
      };
      return updatedFestival;
    }
    return f;
  });

  saveDb(db);
  return updatedFestival ? { ...updatedFestival, computedStatus: computeFestivalStatus(updatedFestival) } : null;
}

export function deleteFestival(id) {
  const db = getDb();
  const initialLength = (db.festivals || []).length;
  db.festivals = (db.festivals || []).filter((f) => f.id !== id);
  saveDb(db);
  return db.festivals.length < initialLength;
}

// ---------------- Festival Product Operations ----------------

export function addProductToFestival(festivalId, productData) {
  const db = getDb();
  let updatedFestival = null;
  const newProduct = {
    id: `fp-${Date.now()}`,
    title: productData.title || productData.name || 'Artisanal Festive Hamper',
    price: Number(productData.price) || 0,
    originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
    badge: productData.badge || 'Festive Special',
    image: productData.image || (productData.images && productData.images[0]) || 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?auto=format&fit=crop&w=800&q=80',
    description: productData.description || '',
    highlights: Array.isArray(productData.highlights)
      ? productData.highlights
      : typeof productData.highlights === 'string'
        ? productData.highlights.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    origin: productData.origin || 'Kerala Craft Atelier',
    active: productData.active !== undefined ? !!productData.active : true,
    createdAt: new Date().toISOString(),
  };

  db.festivals = (db.festivals || defaultFestivals).map((f) => {
    if (f.id === festivalId) {
      updatedFestival = {
        ...f,
        products: [newProduct, ...(f.products || [])],
        updatedAt: new Date().toISOString(),
      };
      return updatedFestival;
    }
    return f;
  });

  saveDb(db);
  return { newProduct, festival: updatedFestival };
}

export function updateFestivalProduct(festivalId, productId, productData) {
  const db = getDb();
  let updatedFestival = null;

  db.festivals = (db.festivals || defaultFestivals).map((f) => {
    if (f.id === festivalId) {
      const updatedProducts = (f.products || []).map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            ...productData,
            price: productData.price !== undefined ? Number(productData.price) : p.price,
            originalPrice: productData.originalPrice !== undefined ? Number(productData.originalPrice) : p.originalPrice,
            highlights: Array.isArray(productData.highlights)
              ? productData.highlights
              : typeof productData.highlights === 'string'
                ? productData.highlights.split(',').map((s) => s.trim()).filter(Boolean)
                : p.highlights,
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      updatedFestival = { ...f, products: updatedProducts, updatedAt: new Date().toISOString() };
      return updatedFestival;
    }
    return f;
  });

  saveDb(db);
  return updatedFestival;
}

export function deleteFestivalProduct(festivalId, productId) {
  const db = getDb();
  let updatedFestival = null;

  db.festivals = (db.festivals || defaultFestivals).map((f) => {
    if (f.id === festivalId) {
      const updatedProducts = (f.products || []).filter((p) => p.id !== productId);
      updatedFestival = { ...f, products: updatedProducts, updatedAt: new Date().toISOString() };
      return updatedFestival;
    }
    return f;
  });

  saveDb(db);
  return updatedFestival;
}

export function toggleFestivalProduct(festivalId, productId) {
  const db = getDb();
  let updatedFestival = null;

  db.festivals = (db.festivals || defaultFestivals).map((f) => {
    if (f.id === festivalId) {
      const updatedProducts = (f.products || []).map((p) => {
        if (p.id === productId) {
          return { ...p, active: !p.active };
        }
        return p;
      });
      updatedFestival = { ...f, products: updatedProducts, updatedAt: new Date().toISOString() };
      return updatedFestival;
    }
    return f;
  });

  saveDb(db);
  return updatedFestival;
}

// ---------------- Backward-Compatibility Helpers ----------------

export function getFestivalHampers() {
  const festivals = getFestivals();
  const showcase = resolveShowcaseFestival(festivals);
  return {
    enabled: !!showcase,
    showcaseFestival: showcase,
    festivals,
    // Flatten items for legacy components if needed
    items: showcase ? (showcase.products || []).filter((p) => p.active !== false).map((p) => ({
      ...p,
      festivalName: showcase.name,
      festivalType: showcase.id,
      enabled: p.active !== false,
    })) : [],
    banner: showcase ? {
      enabled: true,
      festivalName: showcase.name,
      title: showcase.title,
      calligraphy: showcase.calligraphy,
      badge: showcase.badge,
      tagline: showcase.tagline,
      description: showcase.description,
      image: showcase.banner,
      announcement: showcase.announcement,
      highlightTag1: showcase.highlightTag1,
      highlightTag2: showcase.highlightTag2,
      highlightTag3: showcase.highlightTag3,
    } : null,
  };
}

export function updateFestivalHampersSection(sectionData) {
  if (sectionData.festivals) {
    const db = getDb();
    db.festivals = sectionData.festivals;
    saveDb(db);
  }
  return getFestivalHampers();
}


