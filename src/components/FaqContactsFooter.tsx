import { useState } from "react";
import Icon from "@/components/ui/icon";

const PHONE = "+7 (999) 123-45-67";
const EMAIL = "info@avtomexaniki.ru";

const faq = [
  { q: "Как записаться на ремонт?", a: "Позвоните нам или оставьте заявку на сайте. Мы свяжемся с вами в течение 15 минут для согласования времени." },
  { q: "Выезжаете ли на место поломки?", a: "Да, наши мастера выезжают на место поломки в черте города и ближайшем пригороде. Стоимость выезда — от 500 ₽." },
  { q: "Есть ли гарантия на ремонт?", a: "На все виды работ мы предоставляем письменную гарантию. Срок гарантии зависит от вида работ — от 3 месяцев до 1 года." },
  { q: "Работаете ли с иномарками?", a: "Да, работаем со всеми марками и моделями автомобилей — отечественными и иностранными." },
  { q: "Сколько времени занимает диагностика?", a: "Компьютерная диагностика занимает от 30 до 60 минут. По итогам вы получите полный отчёт о состоянии автомобиля." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <h2 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl mb-3">Частые вопросы</h2>
        </div>
        <div className="space-y-3">
          {faq.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left font-montserrat font-semibold text-[#1a1f2e] hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span>{item.q}</span>
                <Icon name={open === i ? "ChevronUp" : "ChevronDown"} size={20} className="text-gray-400 flex-shrink-0 ml-4" />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 animate-fade-in">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contacts() {
  return (
    <section id="contacts" className="py-20 bg-[#0d1b3e]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-3">Контакты</h2>
          <p className="text-gray-400 text-lg">Свяжитесь с нами удобным способом</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "Phone", title: "Телефон", val: PHONE, sub: "Звонки и WhatsApp", href: `tel:${PHONE}` },
            { icon: "Mail", title: "Email", val: EMAIL, sub: "Отвечаем в течение часа", href: `mailto:${EMAIL}` },
            { icon: "Clock", title: "Режим работы", val: "24/7", sub: "Без выходных и праздников", href: undefined },
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
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden h-64 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <Icon name="MapPin" size={40} className="mx-auto mb-3 text-[#ff6600]" />
            <p className="text-lg font-medium text-gray-400">Карта и адрес</p>
            <p className="text-sm">Добавьте ваш адрес, и мы встроим Яндекс.Карту</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a1122] py-8 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#0055b3] rounded flex items-center justify-center">
            <Icon name="Car" size={14} className="text-white" />
          </div>
          <span className="font-montserrat font-bold text-white">АвтоМеханики</span>
        </div>
        <div>© 2024 avtomexaniki.ru — Все права защищены</div>
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
      <Footer />
    </>
  );
}
