import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/702f1c91-73d4-425c-b71e-b2f5560c31b1";
const CONTENT_URL = "https://functions.poehali.dev/b305aa3e-2bad-4942-8d73-ddc275d86aa8";

type Tab = "services" | "faq" | "settings";

interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  price: string;
  sort_order: number;
  is_active: boolean;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

interface Setting {
  id: number;
  key: string;
  value: string;
  label: string;
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Auth-Token": localStorage.getItem("admin_token") || "",
  };
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("services");
  const [services, setServices] = useState<Service[]>([]);
  const [faq, setFaq] = useState<Faq[]>([]);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Модальные окна
  const [editService, setEditService] = useState<Service | null>(null);
  const [editFaq, setEditFaq] = useState<Faq | null>(null);
  const [editSettings, setEditSettings] = useState<Record<string, string>>({});

  const token = localStorage.getItem("admin_token");
  const username = localStorage.getItem("admin_username") || "admin";

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    verifyAndLoad();
  }, []);

  async function verifyAndLoad() {
    const res = await fetch(AUTH_URL + "/verify", { headers: { "X-Auth-Token": token! } });
    if (!res.ok) { navigate("/admin/login"); return; }
    loadAll();
  }

  async function loadAll() {
    setLoading(true);
    const [sRes, fRes, stRes] = await Promise.all([
      fetch(CONTENT_URL + "/services", { headers: authHeaders() }),
      fetch(CONTENT_URL + "/faq", { headers: authHeaders() }),
      fetch(CONTENT_URL + "/settings", { headers: authHeaders() }),
    ]);
    setServices(await sRes.json());
    setFaq(await fRes.json());
    const st: Setting[] = await stRes.json();
    setSettings(st);
    const map: Record<string, string> = {};
    st.forEach(s => { map[s.key] = s.value; });
    setEditSettings(map);
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_username");
    navigate("/admin/login");
  }

  function flash(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(""), 3000);
  }

  // --- SERVICES ---
  async function saveService(s: Service) {
    setSaving(true);
    if (s.id === 0) {
      await fetch(CONTENT_URL + "/services", { method: "POST", headers: authHeaders(), body: JSON.stringify(s) });
    } else {
      await fetch(CONTENT_URL + "/services/" + s.id, { method: "PUT", headers: authHeaders(), body: JSON.stringify(s) });
    }
    setSaving(false);
    setEditService(null);
    flash("Сохранено!");
    loadAll();
  }

  async function deleteService(id: number) {
    if (!confirm("Удалить услугу?")) return;
    await fetch(CONTENT_URL + "/services/" + id, { method: "DELETE", headers: authHeaders() });
    flash("Удалено");
    loadAll();
  }

  // --- FAQ ---
  async function saveFaq(f: Faq) {
    setSaving(true);
    if (f.id === 0) {
      await fetch(CONTENT_URL + "/faq", { method: "POST", headers: authHeaders(), body: JSON.stringify(f) });
    } else {
      await fetch(CONTENT_URL + "/faq/" + f.id, { method: "PUT", headers: authHeaders(), body: JSON.stringify(f) });
    }
    setSaving(false);
    setEditFaq(null);
    flash("Сохранено!");
    loadAll();
  }

  async function deleteFaq(id: number) {
    if (!confirm("Удалить вопрос?")) return;
    await fetch(CONTENT_URL + "/faq/" + id, { method: "DELETE", headers: authHeaders() });
    flash("Удалено");
    loadAll();
  }

  // --- SETTINGS ---
  async function saveSettings() {
    setSaving(true);
    await fetch(CONTENT_URL + "/settings", { method: "PUT", headers: authHeaders(), body: JSON.stringify(editSettings) });
    setSaving(false);
    flash("Настройки сохранены!");
    loadAll();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400">Загрузка...</div>
      </div>
    );
  }

  const emptyService: Service = { id: 0, icon: "Wrench", title: "", description: "", price: "", sort_order: 99, is_active: true };
  const emptyFaq: Faq = { id: 0, question: "", answer: "", sort_order: 99, is_active: true };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={16} />
          </div>
          <div>
            <div className="font-semibold text-sm">АвтоМеханики</div>
            <div className="text-xs text-gray-500">Панель управления</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{username}</span>
          <a href="/" target="_blank" className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
            <Icon name="ExternalLink" size={14} /> Сайт
          </a>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1">
            <Icon name="LogOut" size={14} /> Выйти
          </button>
        </div>
      </div>

      {/* Flash message */}
      {msg && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg text-sm z-50 shadow-lg">
          {msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6 w-fit">
          {([["services", "Услуги", "Wrench"], ["faq", "FAQ", "MessageCircle"], ["settings", "Настройки", "SlidersHorizontal"]] as [Tab, string, string][]).map(([key, label, icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              <Icon name={icon} size={15} /> {label}
            </button>
          ))}
        </div>

        {/* SERVICES TAB */}
        {tab === "services" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Услуги ({services.length})</h2>
              <button onClick={() => setEditService({ ...emptyService })} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Icon name="Plus" size={15} /> Добавить
              </button>
            </div>
            <div className="space-y-2">
              {services.map(s => (
                <div key={s.id} className={`bg-gray-900 rounded-xl px-4 py-3 flex items-center gap-4 border ${s.is_active ? "border-gray-800" : "border-gray-700 opacity-50"}`}>
                  <Icon name={s.icon} size={20} className="text-blue-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{s.title}</div>
                    <div className="text-gray-500 text-xs truncate">{s.description}</div>
                  </div>
                  <div className="text-blue-400 text-sm font-medium shrink-0">{s.price}</div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setEditService({ ...s })} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button onClick={() => deleteService(s.id)} className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ TAB */}
        {tab === "faq" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Вопросы и ответы ({faq.length})</h2>
              <button onClick={() => setEditFaq({ ...emptyFaq })} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <Icon name="Plus" size={15} /> Добавить
              </button>
            </div>
            <div className="space-y-2">
              {faq.map(f => (
                <div key={f.id} className="bg-gray-900 rounded-xl px-4 py-3 flex items-start gap-4 border border-gray-800">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{f.question}</div>
                    <div className="text-gray-500 text-xs mt-1 line-clamp-2">{f.answer}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 mt-0.5">
                    <button onClick={() => setEditFaq({ ...f })} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                      <Icon name="Pencil" size={15} />
                    </button>
                    <button onClick={() => deleteFaq(f.id)} className="text-gray-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                      <Icon name="Trash2" size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Настройки сайта</h2>
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
              {settings.map(s => (
                <div key={s.key}>
                  <label className="block text-sm text-gray-400 mb-1">{s.label || s.key}</label>
                  <input
                    type="text"
                    value={editSettings[s.key] || ""}
                    onChange={e => setEditSettings(prev => ({ ...prev, [s.key]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
              ))}
              <button onClick={saveSettings} disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
                {saving ? "Сохраняю..." : "Сохранить"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Edit Service */}
      {editService && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{editService.id === 0 ? "Новая услуга" : "Редактировать"}</h3>
              <button onClick={() => setEditService(null)} className="text-gray-500 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            {(["title", "icon", "description", "price"] as (keyof Service)[]).map(field => (
              <div key={field}>
                <label className="block text-xs text-gray-400 mb-1 capitalize">{field === "title" ? "Название" : field === "icon" ? "Иконка (lucide)" : field === "description" ? "Описание" : "Цена"}</label>
                <input
                  type="text"
                  value={String(editService[field])}
                  onChange={e => setEditService(prev => ({ ...prev!, [field]: e.target.value }))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={editService.is_active} onChange={e => setEditService(prev => ({ ...prev!, is_active: e.target.checked }))} className="rounded" />
              Активна
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={() => saveService(editService)} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                {saving ? "Сохраняю..." : "Сохранить"}
              </button>
              <button onClick={() => setEditService(null)} className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit FAQ */}
      {editFaq && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-lg border border-gray-700 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{editFaq.id === 0 ? "Новый вопрос" : "Редактировать вопрос"}</h3>
              <button onClick={() => setEditFaq(null)} className="text-gray-500 hover:text-white"><Icon name="X" size={20} /></button>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Вопрос</label>
              <input type="text" value={editFaq.question} onChange={e => setEditFaq(prev => ({ ...prev!, question: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Ответ</label>
              <textarea rows={4} value={editFaq.answer} onChange={e => setEditFaq(prev => ({ ...prev!, answer: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" checked={editFaq.is_active} onChange={e => setEditFaq(prev => ({ ...prev!, is_active: e.target.checked }))} className="rounded" />
              Активен
            </label>
            <div className="flex gap-2 pt-2">
              <button onClick={() => saveFaq(editFaq)} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">
                {saving ? "Сохраняю..." : "Сохранить"}
              </button>
              <button onClick={() => setEditFaq(null)} className="px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 hover:text-white text-sm transition-colors">Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
