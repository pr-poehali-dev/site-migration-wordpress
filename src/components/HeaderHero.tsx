import { useState } from "react";
import Icon from "@/components/ui/icon";

const PHONE = "+7 (999) 123-45-67";
const EMAIL = "info@avtomexaniki.ru";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="hidden md:flex items-center justify-between py-2 border-b border-gray-100 text-sm text-gray-500">
          <span>Работаем 24/7 — выезжаем по всему городу</span>
          <div className="flex gap-6">
            <a href={`mailto:${EMAIL}`} className="hover:text-[#0055b3] transition-colors">{EMAIL}</a>
          </div>
        </div>
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#0055b3] rounded-lg flex items-center justify-center">
              <Icon name="Car" size={22} className="text-white" />
            </div>
            <div>
              <div className="font-montserrat font-800 text-lg text-[#1a1f2e] leading-tight">АвтоМеханики</div>
              <div className="text-xs text-gray-400 leading-tight">Профессиональный сервис</div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#services" className="text-gray-600 hover:text-[#0055b3] transition-colors">Услуги</a>
            <a href="#why-us" className="text-gray-600 hover:text-[#0055b3] transition-colors">О нас</a>
            <a href="#reviews" className="text-gray-600 hover:text-[#0055b3] transition-colors">Отзывы</a>
            <a href="#faq" className="text-gray-600 hover:text-[#0055b3] transition-colors">FAQ</a>
            <a href="#contacts" className="text-gray-600 hover:text-[#0055b3] transition-colors">Контакты</a>
          </nav>

          <div className="flex items-center gap-3">
            <a href={`tel:${PHONE}`} className="hidden md:flex items-center gap-2 font-montserrat font-bold text-[#0055b3] text-lg">
              <Icon name="Phone" size={18} className="text-[#ff6600]" />
              {PHONE}
            </a>
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 animate-fade-in">
            <nav className="flex flex-col gap-3 pt-4">
              {["#services", "#why-us", "#reviews", "#faq", "#contacts"].map((href, i) => {
                const labels = ["Услуги", "О нас", "Отзывы", "FAQ", "Контакты"];
                return (
                  <a key={href} href={href} className="text-gray-700 font-medium py-1 hover:text-[#0055b3] transition-colors" onClick={() => setMenuOpen(false)}>
                    {labels[i]}
                  </a>
                );
              })}
              <a href={`tel:${PHONE}`} className="flex items-center gap-2 font-bold text-[#0055b3] pt-2">
                <Icon name="Phone" size={16} className="text-[#ff6600]" />
                {PHONE}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(https://cdn.poehali.dev/projects/693a2df7-d4ac-4b17-8f97-90b7af1c414c/files/931f4e19-3d59-4172-b693-1a15eae71eab.jpg)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b3e]/90 via-[#0d1b3e]/75 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 w-full py-16">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#ff6600]/20 border border-[#ff6600]/40 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-[#ff6600]" />
            <span className="text-[#ff9944] text-sm font-medium">Работаем 24/7 — выезжаем за 30 минут</span>
          </div>

          <h1 className="font-montserrat font-black text-white text-4xl md:text-5xl lg:text-6xl leading-tight mb-5 animate-fade-up delay-100">
            Профессиональный<br />
            <span className="text-[#ff6600]">автосервис</span><br />
            на дороге или у вас дома
          </h1>

          <p className="text-gray-300 text-lg mb-8 leading-relaxed animate-fade-up delay-200">
            Ремонт и обслуживание любых автомобилей. Диагностика, ходовая, двигатель, электрика — мастер приедет к вам или примем в сервисе.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-300">
            <a
              href="#callback"
              className="relative inline-flex items-center justify-center gap-2 bg-[#ff6600] hover:bg-[#e55a00] text-white font-montserrat font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:shadow-lg hover:shadow-[#ff6600]/30 hover:-translate-y-0.5"
            >
              <Icon name="ClipboardList" size={20} />
              Записаться на ремонт
            </a>
            <a
              href={`tel:${PHONE}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/40 hover:border-white text-white font-montserrat font-bold px-8 py-4 rounded-lg text-lg transition-all duration-200 hover:bg-white/10"
            >
              <Icon name="Phone" size={20} />
              Позвонить
            </a>
          </div>

          <div className="flex flex-wrap gap-6 mt-10 animate-fade-up delay-400">
            {[
              { value: "15+", label: "лет опыта" },
              { value: "3 000+", label: "клиентов" },
              { value: "100%", label: "гарантия" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="font-montserrat font-black text-[#ff6600] text-3xl">{item.value}</div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

export default function HeaderHero() {
  return (
    <>
      <Header />
      <Hero />
    </>
  );
}