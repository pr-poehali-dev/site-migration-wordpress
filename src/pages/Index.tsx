import { useState } from "react";
import Icon from "@/components/ui/icon";

const PHONE = "+7 (999) 123-45-67";
const EMAIL = "info@avtomexaniki.ru";

const services = [
  { icon: "Wrench", title: "Ремонт двигателя", desc: "Капитальный и текущий ремонт, замена масла, ГРМ, диагностика", price: "от 2 000 ₽" },
  { icon: "Settings", title: "Ходовая часть", desc: "Замена амортизаторов, рулевых тяг, шаровых опор, подшипников", price: "от 1 500 ₽" },
  { icon: "Zap", title: "Электрика", desc: "Диагностика и ремонт электрооборудования, замена проводки", price: "от 1 000 ₽" },
  { icon: "Wind", title: "Кондиционер", desc: "Заправка, ремонт, чистка системы кондиционирования", price: "от 1 500 ₽" },
  { icon: "Gauge", title: "Диагностика", desc: "Компьютерная диагностика всех систем автомобиля", price: "от 500 ₽" },
  { icon: "Shield", title: "ТО и обслуживание", desc: "Полное техническое обслуживание по регламенту", price: "от 3 000 ₽" },
  { icon: "Car", title: "Кузовные работы", desc: "Покраска, рихтовка, устранение вмятин без покраски", price: "от 2 500 ₽" },
  { icon: "Fuel", title: "Топливная система", desc: "Чистка форсунок, ремонт ТНВД, замена топливного насоса", price: "от 2 000 ₽" },
];

const reasons = [
  { icon: "Clock", title: "Выезд за 30 минут", desc: "Мастер приедет к вам — работаем по всему городу и области" },
  { icon: "BadgeCheck", title: "Гарантия на работы", desc: "Даём письменную гарантию на все выполненные работы" },
  { icon: "Wallet", title: "Прозрачные цены", desc: "Стоимость обозначаем до начала работ, без скрытых доплат" },
  { icon: "Users", title: "Опыт 15+ лет", desc: "Сертифицированные мастера с многолетним практическим опытом" },
];

const reviews = [
  { name: "Алексей К.", car: "Toyota Camry", text: "Отличный сервис! Быстро диагностировали проблему с двигателем, всё починили за день. Цена приятно удивила.", rating: 5 },
  { name: "Мария С.", car: "Volkswagen Polo", text: "Обратилась с проблемой по ходовой. Мастер всё объяснил понятно, сделал качественно. Рекомендую!", rating: 5 },
  { name: "Дмитрий В.", car: "Kia Rio", text: "Делали ТО и замену тормозных колодок. Работа сделана чётко, в срок. Буду обращаться ещё.", rating: 5 },
];

const faq = [
  { q: "Как записаться на ремонт?", a: "Позвоните нам или оставьте заявку на сайте. Мы свяжемся с вами в течение 15 минут для согласования времени." },
  { q: "Выезжаете ли на место поломки?", a: "Да, наши мастера выезжают на место поломки в черте города и ближайшем пригороде. Стоимость выезда — от 500 ₽." },
  { q: "Есть ли гарантия на ремонт?", a: "На все виды работ мы предоставляем письменную гарантию. Срок гарантии зависит от вида работ — от 3 месяцев до 1 года." },
  { q: "Работаете ли с иномарками?", a: "Да, работаем со всеми марками и моделями автомобилей — отечественными и иностранными." },
  { q: "Сколько времени занимает диагностика?", a: "Компьютерная диагностика занимает от 30 до 60 минут. По итогам вы получите полный отчёт о состоянии автомобиля." },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[#ff6600] text-lg">★</span>
      ))}
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top bar */}
        <div className="hidden md:flex items-center justify-between py-2 border-b border-gray-100 text-sm text-gray-500">
          <span>Работаем 24/7 — выезжаем по всему городу</span>
          <div className="flex gap-6">
            <a href={`mailto:${EMAIL}`} className="hover:text-[#0055b3] transition-colors">{EMAIL}</a>
          </div>
        </div>
        {/* Main nav */}
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

          {/* Desktop nav */}
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

        {/* Mobile menu */}
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
      {/* Background image */}
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
            у вас дома
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

          {/* Trust indicators */}
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

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <h2 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl mb-3">Наши услуги</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Выполняем весь спектр работ по ремонту и обслуживанию автомобилей</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              className="group bg-[#f4f6fa] hover:bg-[#0055b3] rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-12 h-12 bg-[#0055b3] group-hover:bg-white/20 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300">
                <Icon name={s.icon} size={24} className="text-white" fallback="Wrench" />
              </div>
              <h3 className="font-montserrat font-bold text-[#1a1f2e] group-hover:text-white text-lg mb-2 transition-colors duration-300">{s.title}</h3>
              <p className="text-gray-500 group-hover:text-blue-100 text-sm mb-4 transition-colors duration-300 leading-relaxed">{s.desc}</p>
              <div className="font-montserrat font-bold text-[#ff6600] group-hover:text-[#ffaa66] transition-colors duration-300">{s.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section id="why-us" className="py-20 bg-[#0d1b3e]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="section-divider mb-4" />
            <h2 className="font-montserrat font-black text-white text-3xl md:text-4xl mb-5">Почему выбирают нас?</h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              Мы не просто ремонтируем машины — мы обеспечиваем полный сервис с гарантией качества и прозрачными ценами. Никаких сюрпризов.
            </p>
            <div className="grid sm:grid-cols-2 gap-6">
              {reasons.map((r) => (
                <div key={r.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-[#ff6600]/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={r.icon} size={22} className="text-[#ff6600]" fallback="Check" />
                  </div>
                  <div>
                    <h4 className="font-montserrat font-bold text-white mb-1">{r.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://cdn.poehali.dev/projects/693a2df7-d4ac-4b17-8f97-90b7af1c414c/files/74aa3461-444f-4d16-a27a-5963cd73fd04.jpg"
              alt="Наша команда"
              className="rounded-2xl w-full object-cover h-[420px]"
            />
            <div className="absolute -bottom-6 -left-6 bg-[#ff6600] rounded-xl p-5 shadow-xl">
              <div className="font-montserrat font-black text-white text-4xl">15+</div>
              <div className="text-white/80 text-sm">лет в авторемонте</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CallbackSection() {
  return (
    <section id="callback" className="py-20 bg-[#f4f6fa]">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-[#0055b3] p-10 text-white">
              <h2 className="font-montserrat font-black text-3xl mb-4">Записаться<br />на ремонт</h2>
              <p className="text-blue-200 mb-8 leading-relaxed">Оставьте заявку — мастер перезвонит в течение 15 минут и согласует удобное время.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Icon name="Phone" size={18} className="text-[#ff6600]" />
                  <a href={`tel:${PHONE}`} className="font-bold text-lg">{PHONE}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Mail" size={18} className="text-[#ff6600]" />
                  <a href={`mailto:${EMAIL}`} className="text-blue-200">{EMAIL}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Clock" size={18} className="text-[#ff6600]" />
                  <span className="text-blue-200">Работаем 24/7</span>
                </div>
              </div>
            </div>
            <div className="p-10">
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ваше имя</label>
                  <input
                    type="text"
                    placeholder="Иван Иванов"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055b3]/30 focus:border-[#0055b3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055b3]/30 focus:border-[#0055b3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Марка и модель авто</label>
                  <input
                    type="text"
                    placeholder="Toyota Camry 2018"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055b3]/30 focus:border-[#0055b3] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание проблемы</label>
                  <textarea
                    placeholder="Опишите неисправность или нужную услугу..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0055b3]/30 focus:border-[#0055b3] transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#ff6600] hover:bg-[#e55a00] text-white font-montserrat font-bold py-4 rounded-lg text-base transition-all duration-200 hover:shadow-lg hover:shadow-[#ff6600]/30"
                >
                  Отправить заявку
                </button>
                <p className="text-xs text-gray-400 text-center">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="section-divider mx-auto mb-4" />
          <h2 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl mb-3">Отзывы клиентов</h2>
          <p className="text-gray-500 text-lg">Нам доверяют тысячи автовладельцев</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div key={r.name} className="bg-[#f4f6fa] rounded-xl p-7 hover:shadow-lg transition-shadow duration-300">
              <StarRating count={r.rating} />
              <p className="text-gray-700 my-4 leading-relaxed text-sm">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                <div className="w-10 h-10 bg-[#0055b3] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-montserrat font-bold text-[#1a1f2e] text-sm">{r.name}</div>
                  <div className="text-gray-400 text-xs">{r.car}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Diagnostics() {
  return (
    <section className="py-20 bg-[#f4f6fa]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <img
              src="https://cdn.poehali.dev/projects/693a2df7-d4ac-4b17-8f97-90b7af1c414c/files/6c6b2079-b3a7-4b43-a9a5-2ad51dbbef57.jpg"
              alt="Диагностика автомобиля"
              className="rounded-2xl w-full object-cover h-[380px]"
            />
          </div>
          <div>
            <div className="section-divider mb-4" />
            <h2 className="font-montserrat font-black text-[#1a1f2e] text-3xl md:text-4xl mb-5">Компьютерная<br />диагностика</h2>
            <p className="text-gray-500 text-lg mb-6 leading-relaxed">
              Профессиональное оборудование позволяет считать ошибки со всех систем автомобиля за 30–60 минут. По результатам вы получите подробный отчёт.
            </p>
            <ul className="space-y-3 mb-8">
              {["Двигатель и коробка передач", "Тормозная система", "Системы безопасности (ABS, ESP, подушки)", "Электрооборудование и датчики", "Подвеска и рулевое управление"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <div className="w-5 h-5 bg-[#0055b3] rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <div className="bg-[#ff6600] text-white font-montserrat font-black text-2xl px-5 py-3 rounded-lg">от 500 ₽</div>
              <a href="#callback" className="text-[#0055b3] font-semibold hover:underline">Записаться →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
        {/* Map placeholder */}
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

export default function Index() {
  return (
    <div className="font-opensans">
      <Header />
      <Hero />
      <Services />
      <WhyUs />
      <CallbackSection />
      <Diagnostics />
      <Reviews />
      <FAQ />
      <Contacts />
      <Footer />
    </div>
  );
}