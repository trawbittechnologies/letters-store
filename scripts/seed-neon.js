import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import process from 'node:process';

// Parse .env.local and .env
function loadEnv() {
  const envFiles = ['.env.local', '.env'];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          let val = trimmed.substring(idx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.substring(1, val.length - 1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    }
  }
}

loadEnv();

const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is missing. Please set DATABASE_URL in .env.local');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function initAndSeed() {
  try {
    console.log('1. Creating database tables if not exist...');

    // 1. Admins table (Only 1 admin)
    await sql`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Store Owner',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Products table
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        category_slug VARCHAR(100),
        price NUMERIC(10, 2) NOT NULL,
        original_price NUMERIC(10, 2),
        description TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        stock INTEGER DEFAULT 10,
        featured BOOLEAN DEFAULT false,
        customizable BOOLEAN DEFAULT true,
        show_price BOOLEAN DEFAULT true,
        tag VARCHAR(100),
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Categories table
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL,
        group_name VARCHAR(100) DEFAULT 'Hampers',
        description TEXT,
        image TEXT,
        item_count INTEGER DEFAULT 0,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        whatsapp_number VARCHAR(50),
        address TEXT,
        pincode VARCHAR(20),
        delivery_date VARCHAR(50),
        occasion VARCHAR(100),
        items JSONB DEFAULT '[]'::jsonb,
        subtotal NUMERIC(10, 2) DEFAULT 0,
        total NUMERIC(10, 2) DEFAULT 0,
        customization TEXT,
        special_instructions TEXT,
        status VARCHAR(50) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Festivals table
    await sql`
      CREATE TABLE IF NOT EXISTS festivals (
        id VARCHAR(100) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        tagline TEXT,
        description TEXT,
        calligraphy VARCHAR(255),
        badge VARCHAR(100),
        banner TEXT,
        start_date VARCHAR(50),
        end_date VARCHAR(50),
        pre_booking_enabled BOOLEAN DEFAULT false,
        pre_booking_start_date VARCHAR(50),
        status VARCHAR(50) DEFAULT 'draft',
        announcement TEXT,
        highlight_tag1 VARCHAR(100),
        highlight_tag2 VARCHAR(100),
        highlight_tag3 VARCHAR(100),
        products JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 6. Sale Banner table
    await sql`
      CREATE TABLE IF NOT EXISTS sale_banner (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
        enabled BOOLEAN DEFAULT false,
        show_top_bar BOOLEAN DEFAULT false,
        top_bar_text TEXT,
        title VARCHAR(255),
        calligraphy VARCHAR(255),
        tag VARCHAR(100),
        description TEXT,
        discount_offer VARCHAR(100),
        price_note VARCHAR(100),
        image TEXT,
        end_date VARCHAR(100),
        cta_text VARCHAR(100) DEFAULT 'Explore Deals',
        cta_link VARCHAR(255) DEFAULT '/deals',
        selected_product_ids JSONB DEFAULT '[]'::jsonb,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 7. Store Settings table
    await sql`
      CREATE TABLE IF NOT EXISTS store_settings (
        id VARCHAR(50) PRIMARY KEY DEFAULT 'main',
        brand_name VARCHAR(255) DEFAULT 'LETTERS',
        established_year VARCHAR(10) DEFAULT '2020',
        tagline TEXT DEFAULT 'Making your special moments a lot more memorable',
        hero_heading TEXT DEFAULT 'Make Every Moment More Memorable.',
        hero_description TEXT DEFAULT 'Thoughtfully curated hampers, bouquets and personalized gifts for the moments that matter most.',
        whatsapp_number VARCHAR(50) DEFAULT '919497219574',
        phone_number VARCHAR(50) DEFAULT '+91 94972 19574',
        email VARCHAR(255) DEFAULT 'hello@lettersgifting.com',
        address TEXT DEFAULT 'LETTERS Gifting Studio, Kerala, India',
        instagram VARCHAR(255) DEFAULT 'https://instagram.com/lettersgifting',
        facebook VARCHAR(255) DEFAULT 'https://facebook.com/lettersgifting',
        announcement_text TEXT DEFAULT '✨ Handcrafted with love • Express delivery available for special occasions • WhatsApp ordering enabled',
        order_message_prefix VARCHAR(100) DEFAULT 'New Order — LETTERS',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('2. Tables created successfully in Neon PostgreSQL!');

    console.log('3. Seeding SINGLE Admin Account & default store configuration...');

    // Clear any extra users, seed ONLY one admin
    await sql`DELETE FROM admins;`;
    await sql`
      INSERT INTO admins (username, email, password, role)
      VALUES ('admin', 'admin@letters.com', 'letters@2020', 'Store Owner')
      ON CONFLICT (username) DO UPDATE
      SET email = 'admin@letters.com', password = 'letters@2020', role = 'Store Owner';
    `;

    // Seed default settings row if not exists
    await sql`
      INSERT INTO store_settings (id, brand_name, whatsapp_number, email)
      VALUES ('main', 'LETTERS', '919497219574', 'hello@lettersgifting.com')
      ON CONFLICT (id) DO NOTHING;
    `;

    // Seed default sale banner row if not exists
    await sql`
      INSERT INTO sale_banner (id, enabled, title)
      VALUES ('current', false, '')
      ON CONFLICT (id) DO NOTHING;
    `;

    console.log('4. Successfully pushed and seeded Neon Database!');
    console.log('----------------------------------------------------');
    console.log('SINGLE ADMIN CREDENTIALS:');
    console.log('Username: admin');
    console.log('Email:    admin@letters.com');
    console.log('Password: letters@2020');
    console.log('----------------------------------------------------');

    const adminCheck = await sql`SELECT id, username, email, role FROM admins;`;
    console.log('Verified Admin in Neon DB:', adminCheck);

  } catch (error) {
    console.error('Error initializing and seeding Neon DB:', error);
    process.exit(1);
  }
}

initAndSeed();
