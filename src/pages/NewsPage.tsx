import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { CONTENT_URL, parseResponse, type NewsItem } from "@/hooks/useSiteData";

function NewsModal({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const date = new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8" onClick={e => e.stopPropagation()}>
        {item.image_url && (
          <img src={item.image_url} alt={item.title} className="w-full h-64 object-cover rounded-t-2xl" />
        )}
        <div className="p-8">
          <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <Icon name="Calendar" size={14} /> {date}
          </div>
          <h2 className="font-montserrat font-black text-[#1a1f2e] text-2xl mb-5 leading-snug">{item.title}</h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{item.content}</div>
          <button onClick={onClose} className="mt-8 bg-[#0055b3] hover:bg-[#004499] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<NewsItem | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(CONTENT_URL + "/public/news/all")
      .then(r => r.json())
      .then(d => parseResponse(d))
      .then(d => {
        setNews(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = news.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6fa] font-opensans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#0055b3] rounded-lg flex items-center justify-center">
              <Icon name="Car" size={20} className="text-white" />
            </div>
            <div>
              <div className="font-montserrat font-bold text-[#1a1f2e] leading-tight">АвтоМеханики</div>
              <div className="text-xs text-gray-400 leading-tight">Профессиональный сервис</div>
            </div>
          </Link>
          <Link to="/" className="flex items-center gap-1.5 text-sm text-[#0055b3] hover:text-[#ff6600] transition-colors font-medium">
            <Icon name="ArrowLeft" size={16} /> На главную
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Title + search */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="section-divider mb-3" />
            <h1 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl">Автоновости</h1>
            <p className="text-gray-500 mt-2">Актуальные новости из мира автомобилей</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по новостям..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0055b3] shadow-sm"
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse bg-white">
                <div className="bg-gray-200 h-48" />
                <div className="p-5 space-y-3">
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                  <div className="bg-gray-200 h-3 rounded w-full" />
                  <div className="bg-gray-200 h-3 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Icon name="Newspaper" size={48} className="mx-auto mb-4 opacity-30" />
            <div className="text-lg">{search ? "Ничего не найдено" : "Новостей пока нет"}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(item => {
              const date = new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
              const preview = item.content.slice(0, 160) + (item.content.length > 160 ? "..." : "");
              return (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                  onClick={() => setActive(item)}
                >
                  <div className="relative overflow-hidden h-48">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-[#0055b3]/8 flex items-center justify-center">
                        <Icon name="Newspaper" size={48} className="text-[#0055b3]/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
                      <Icon name="Calendar" size={12} /> {date}
                    </div>
                    <h3 className="font-montserrat font-bold text-[#1a1f2e] text-base mb-2 leading-snug group-hover:text-[#0055b3] transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{preview}</p>
                    <div className="mt-4 flex items-center gap-1 text-[#0055b3] text-sm font-semibold">
                      Читать полностью <Icon name="ArrowRight" size={14} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Count */}
        {!loading && filtered.length > 0 && (
          <div className="text-center mt-10 text-gray-400 text-sm">
            Показано {filtered.length} {filtered.length === 1 ? "новость" : filtered.length < 5 ? "новости" : "новостей"}
          </div>
        )}
      </div>

      {active && <NewsModal item={active} onClose={() => setActive(null)} />}
    </div>
  );
}
