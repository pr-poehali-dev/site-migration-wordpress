import Icon from "@/components/ui/icon";

const PHONE = "+7 (977) 977-57-63";
const EMAIL = "info@avtomexaniki.ru";

const reviews = [
  { name: "Алексей К.", car: "Toyota Camry", text: "Отличный сервис! Быстро диагностировали проблему с двигателем, всё починили за день. Цена приятно удивила.", rating: 5 },
  { name: "Мария С.", car: "Volkswagen Polo", text: "Обратилась с проблемой по ходовой. Мастер всё объяснил понятно, сделал качественно. Рекомендую!", rating: 5 },
  { name: "Дмитрий В.", car: "Kia Rio", text: "Делали ТО и замену тормозных колодок. Работа сделана чётко, в срок. Буду обращаться ещё.", rating: 5 },
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

export default function CallbackReviews() {
  return (
    <>
      <CallbackSection />
      <Reviews />
    </>
  );
}