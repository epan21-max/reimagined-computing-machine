import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, removeFavorite, type FavoriteItem } from '../lib/favorites';
import { Heart, Trash2, Tv, Film, ArrowLeft } from 'lucide-react';

export default function FavoritePage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'anime' | 'donghua'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleRemove = (id: string) => {
    removeFavorite(id);
    setFavorites(getFavorites());
  };

  const filtered = filter === 'all' ? favorites : favorites.filter(f => f.type === filter);

  return (
    <div className="max-w-6xl mx-auto px-3 pb-20 md:pb-4">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-text-secondary hover:text-primary font-mono text-xs mb-4 transition-colors">
        <ArrowLeft size={14} /> Home
      </button>

      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Heart size={22} className="text-danger" />
        <span className="text-danger">Favorit</span> Saya
      </h1>

      {/* Filter */}
      <div className="flex gap-2 mb-5 border-2 border-black">
        {[
          { key: 'all', label: 'Semua', icon: Heart },
          { key: 'anime', label: 'Anime', icon: Tv },
          { key: 'donghua', label: 'Donghua', icon: Film },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as any)}
            className={`flex-1 py-2.5 font-mono text-xs font-bold uppercase flex items-center justify-center gap-1 border-r-2 border-black last:border-r-0 transition-colors ${
              filter === f.key ? 'bg-danger text-white' : 'bg-surface text-text-secondary hover:bg-surface-light'
            }`}
          >
            <f.icon size={12} /> {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="neo-card p-12 text-center">
          <Heart size={48} className="mx-auto mb-4 text-text-secondary" />
          <h3 className="font-bold text-lg mb-2">Belum ada favorit</h3>
          <p className="font-mono text-xs text-text-secondary max-w-sm mx-auto">
            Tambahkan anime atau donghua ke daftar favorit kamu dengan menekan tombol hati di halaman detail.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="group neo-card overflow-hidden animate-fadeIn relative">
              <div
                onClick={() => {
                  if (item.type === 'anime') navigate(`/s/anime/detail/${item.slug}`);
                  else navigate(`/s/donghua/detail/${item.slug}`);
                }}
                className="cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 neo-tag bg-secondary text-white uppercase">
                    {item.type === 'anime' ? <><Tv size={8} className="inline mr-1" />Anime</> : <><Film size={8} className="inline mr-1" />Donghua</>}
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="font-bold text-xs leading-tight line-clamp-2 group-hover:text-danger transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-danger border-2 border-black shadow-[2px_2px_0px_#000] text-white hover:shadow-[3px_3px_0px_#000] transition-all"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
