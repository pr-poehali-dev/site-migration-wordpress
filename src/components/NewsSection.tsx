import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useSiteData, type NewsItem } from "@/hooks/useSiteData";

function NewsModal({ item, onClose }: { item: NewsItem; onClose: () => void }) {
  const date = new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {item.image_url && (
          <img src={item.image_url} alt={item.title} className="w-full h-56 object-cover rounded-t-2xl" />
        )}
        <div className="p-8">
          <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
            <Icon name="Calendar" size={14} />
            {date}
          </div>
          <h2 className="font-montserrat font-black text-[#1a1f2e] text-2xl mb-5 leading-snug">{item.title}</h2>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{item.content}</div>
          <button
            onClick={onClose}
            className="mt-6 bg-[#0055b3] hover:bg-[#004499] text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const { news, loading } = useSiteData();
  const [active, setActive] = useState<NewsItem | null>(null);

  if (!loading && news.length === 0) return null;

  return (
    <>
      <section id="news" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-divider mx-auto mb-4" />
            <h2 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl mb-3">Автоновости</h2>
            <p className="text-gray-500 text-lg">Актуальные новости из мира автомобилей</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden animate-pulse">
                  <div className="bg-gray-200 h-44" />
                  <div className="p-4 space-y-2">
                    <div className="bg-gray-200 h-4 rounded w-3/4" />
                    <div className="bg-gray-200 h-3 rounded w-full" />
                    <div className="bg-gray-200 h-3 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {news.slice(0, 4).map(item => {
                const date = new Date(item.created_at).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
                const preview = item.content.slice(0, 120) + (item.content.length > 120 ? "..." : "");
                return (
                  <div
                    key={item.id}
                    className="group bg-[#f4f6fa] rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
                    onClick={() => setActive(item)}
                  >
                    <div className="relative overflow-hidden h-44">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#0055b3]/10 flex items-center justify-center">
                          <Icon name="Newspaper" size={40} className="text-[#0055b3]/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 bg-[#0055b3] text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                        {date}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-montserrat font-bold text-[#1a1f2e] text-sm mb-2 leading-snug line-clamp-2 group-hover:text-[#0055b3] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-xs leading-relaxed flex-1">{preview}</p>
                      <div className="mt-4 flex items-center gap-1 text-[#0055b3] text-xs font-semibold">
                        Читать далее <Icon name="ArrowRight" size={13} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {active && <NewsModal item={active} onClose={() => setActive(null)} />}
    </>
  );
}
