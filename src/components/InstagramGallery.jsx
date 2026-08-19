'use client';

import { InstagramIcon } from './icons/InstagramIcon';
import { useSettingsStore } from '../store/settingsStore';

const igPosts = [
  { id: 1, image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80', span: 'md:col-span-2 md:row-span-2', likes: '1.8k' },
  { id: 2, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1', likes: '940' },
  { id: 3, image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1', likes: '1.2k' },
  { id: 4, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1', likes: '820' },
  { id: 5, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=800&q=80', span: 'md:col-span-1 md:row-span-1', likes: '1.1k' },
];

export default function InstagramGallery() {
  const { settings } = useSettingsStore();

  return (
    <section id="instagram" className="py-24 px-4 sm:px-6 lg:px-12 bg-[var(--bg)] border-t border-[var(--border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div>
            <p className="text-[10px] tracking-[0.3em] text-[var(--accent-secondary)] uppercase mb-2 font-bold">
              @LettersGifting
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight tracking-tight">
              Moments from Our Atelier
            </h2>
          </div>
          <a
            href={settings.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--text)] hover:text-[var(--accent-hover)] transition-colors"
          >
            <InstagramIcon size={15} className="text-[var(--accent-secondary)]" />
            Follow On Instagram
          </a>
        </div>

        {/* Masonry / Grid - Square Flat Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[220px]">
          {igPosts.map((post) => (
            <div
              key={post.id}
              className={`group relative overflow-hidden bg-[var(--card)] border border-[var(--border)] ${post.span}`}
            >
              <img
                src={post.image}
                alt="LETTERS Atelier Creation"
                className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-104 transition-all duration-400"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                <InstagramIcon size={16} /> {post.likes}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
