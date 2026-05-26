import Icon from "@/components/ui/icon";

const services = [
  { icon: "Wrench", title: "Ремонт двигателя", desc: "Капитальный и текущий ремонт, замена масла, ГРМ, диагностика", price: "от 2 000 ₽" },
  { icon: "Settings", title: "Ходовая часть", desc: "Замена амортизаторов, рулевых тяг, шаровых опор, подшипников", price: "от 1 500 ₽" },
  { icon: "Zap", title: "Электрика", desc: "Диагностика и ремонт электрооборудования, замена проводки", price: "от 1 000 ₽" },
  { icon: "Wind", title: "Кондиционер", desc: "Заправка, ремонт, чистка системы кондиционирования", price: "от 1 500 ₽" },
  { icon: "Gauge", title: "Диагностика", desc: "Компьютерная диагностика всех систем автомобиля", price: "от 500 ₽" },
  { icon: "Shield", title: "ТО и обслуживание", desc: "Полное техническое обслуживание по регламенту", price: "от 3 000 ₽" },
  { icon: "Car", title: "Кузовные работы", desc: "Покраска, рихтовка, устранение вмятин без покраски", price: "от 2 500 ₽" },
  { icon: "Fuel", title: "Топливная система", desc: "Чистка форсунок, ремонт ТНВД, замена топливного насоса", price: "от 2 000 ₽" },
  { icon: "Truck", title: "Эвакуация", desc: "Эвакуация автомобиля в любую точку города и области, день и ночь", price: "от 1 500 ₽" },
  { icon: "AlertTriangle", title: "Машина прикрытия", desc: "Выезд автомобиля прикрытия на место ДТП или поломки на дороге", price: "от 800 ₽" },
];

const reasons = [
  { icon: "Clock", title: "Выезд за 30 минут", desc: "Мастер приедет к вам — работаем по всему городу и области" },
  { icon: "BadgeCheck", title: "Гарантия на работы", desc: "Даём письменную гарантию на все выполненные работы" },
  { icon: "Wallet", title: "Прозрачные цены", desc: "Стоимость обозначаем до начала работ, без скрытых доплат" },
  { icon: "Users", title: "Опыт 15+ лет", desc: "Сертифицированные мастера с многолетним практическим опытом" },
];

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
          {services.map((s) => (
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

export default function ServicesAbout() {
  return (
    <>
      <Services />
      <WhyUs />
      <Diagnostics />
    </>
  );
}