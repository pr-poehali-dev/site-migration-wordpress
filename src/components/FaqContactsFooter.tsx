import { useState } from "react";
import Icon from "@/components/ui/icon";
import { useSiteData } from "@/hooks/useSiteData";

function FAQ() {
  const { faq, loading } = useSiteData();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <h2 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl mb-3">Частые вопросы</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-xl h-16 animate-pulse bg-gray-50" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {faq.map((item, i) => (
              <div key={item.id} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-montserrat font-semibold text-[#1a1f2e] hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span>{item.question}</span>
                  <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={20} className="text-gray-400 flex-shrink-0 ml-4" />
                </button>
                {open === i && (
                  <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 animate-fade-in">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Contacts() {
  const { settings } = useSiteData();
  const phone = settings.phone;
  const email = settings.email;
  const workHours = settings.work_hours;

  return (
    <section id="contacts" className="py-20 bg-[#0d1b3e]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-3">Контакты</h2>
          <p className="text-gray-400 text-lg">Свяжитесь с нами удобным способом</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: "Phone", title: "Телефон", val: phone, sub: "Звонки и WhatsApp", href: `tel:${phone}` },
            { icon: "Mail", title: "Email", val: email, sub: "Отвечаем в течение часа", href: `mailto:${email}` },
            { icon: "Clock", title: "Режим работы", val: workHours, sub: "Без выходных и праздников", href: undefined },
          ].map((c) => (
            <div key={c.title} className="bg-white/5 border border-white/10 rounded-xl p-7 text-center hover:bg-white/10 transition-colors">
              <div className="w-14 h-14 bg-[#ff6600]/15 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Icon name={c.icon} size={26} className="text-[#ff6600]" fallback="Phone" />
              </div>
              <div className="text-gray-400 text-sm mb-1">{c.title}</div>
              {c.href ? (
                <a href={c.href} className="font-montserrat font-bold text-white text-lg block hover:text-[#ff6600] transition-colors">{c.val}</a>
              ) : (
                <div className="font-montserrat font-bold text-white text-lg">{c.val}</div>
              )}
              <div className="text-gray-500 text-sm mt-1">{c.sub}</div>
            </div>
          ))}
        </div>

        <a
          href="https://max.ru/join/hfjBb2d29SObftaCFmZNeNfNQdtYWbQM-S1LUS3Y8_w"
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-12 bg-white/5 border border-white/10 rounded-xl p-7 hover:bg-white/10 transition-colors"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0 bg-white rounded-2xl p-3">
              <img
                src="https://cdn.poehali.dev/projects/693a2df7-d4ac-4b17-8f97-90b7af1c414c/files/6ce8f91b-9eb4-47b3-9a79-09b3359e9ed9.jpg"
                alt="QR-код для входа в чат MAX"
                className="w-40 h-40 object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#ff6600]/15 rounded-xl flex items-center justify-center">
                  <Icon name="MessageCircle" size={22} className="text-[#ff6600]" />
                </div>
                <span className="font-montserrat font-bold text-white text-xl">Чат в MAX</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Отсканируйте QR-код камерой телефона, чтобы сразу написать нам в MAX — отвечаем быстро!
              </p>
              <span className="inline-flex items-center gap-2 bg-[#ff6600] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#e55a00] transition-colors">
                <Icon name="ExternalLink" size={16} />
                Открыть чат
              </span>
            </div>
          </div>
        </a>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-80">
          <iframe
            src="https://yandex.ru/map-widget/v1/?ll=37.652829%2C55.806606&z=16&pt=37.652829%2C55.806606%2Cpm2rdm"
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            title="Карта АвтоМеханики"
            style={{ border: 0 }}
          />
        </div>
        <div className="flex items-center gap-3 mt-4 text-gray-400 text-sm">
          <Icon name="MapPin" size={16} className="text-[#ff6600] flex-shrink-0" />
          <span>{settings.address}</span>
        </div>
      </div>
    </section>
  );
}

const partners = [
  { name: "Emex.ru", description: "Подбор и заказ автозапчастей с доставкой по всей России", url: "https://emex.ru", logo: "https://www.google.com/s2/favicons?sz=128&domain=emex.ru" },
  { name: "Exist.ru", description: "Крупнейший онлайн-магазин оригинальных и аналоговых запчастей", url: "https://exist.ru", logo: "https://www.google.com/s2/favicons?sz=128&domain=exist.ru" },
  { name: "Яндекс Маркет", description: "Покупка автотоваров и запчастей с быстрой доставкой", url: "https://market.yandex.ru", logo: "https://www.google.com/s2/favicons?sz=128&domain=market.yandex.ru" },
  { name: "БалтСервис", description: "Надёжный партнёр по техническому обслуживанию и ремонту", url: "#", logo: "https://www.google.com/s2/favicons?sz=128&domain=baltservice.pro" },
];

function Partners() {
  return (
    <section id="partners" className="py-20 bg-[#f4f6fa]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <h2 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl mb-3">Наши партнёры</h2>
          <p className="text-gray-500 text-lg">Работаем только с проверенными поставщиками и сервисами</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target={partner.url !== "#" ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-lg transition-shadow duration-300 no-underline"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden mb-4 border border-gray-100 flex items-center justify-center bg-white shadow-sm">
                <img src={partner.logo} alt={partner.name} className="w-12 h-12 object-contain" />
              </div>
              <h3 className="font-montserrat font-bold text-[#1a1f2e] text-lg mb-2">{partner.name}</h3>
              <p className="text-gray-500 text-sm">{partner.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { settings } = useSiteData();
  return (
    <footer className="bg-[#0a1122] py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0055b3] rounded flex items-center justify-center">
            <Icon name="Car" size={14} className="text-white" />
          </div>
          <span className="font-montserrat font-bold text-white">АвтоМеханики</span>
        </div>
        <div>© 2024 {settings.email} — Все права защищены</div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}

export default function FaqContactsFooter() {
  return (
    <>
      <FAQ />
      <Contacts />
      <Partners />
      <Footer />
    </>
  );
}
