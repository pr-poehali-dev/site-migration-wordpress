import { useState, useEffect } from "react";

const CONTENT_URL = "https://functions.poehali.dev/b305aa3e-2bad-4942-8d73-ddc275d86aa8";

export interface Service {
  id: number;
  icon: string;
  title: string;
  description: string;
  price: string;
  sort_order: number;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  hero_title: string;
  hero_subtitle: string;
  work_hours: string;
  [key: string]: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  phone: "+7 (977) 977-57-63",
  email: "info@avtomexaniki.ru",
  address: "Москва, Алексеевский район",
  hero_title: "Профессиональный автосервис на дороге или у вас дома",
  hero_subtitle: "Ремонт и обслуживание любых автомобилей. Диагностика, ходовая, двигатель, электрика — мастер приедет к вам или примем в сервисе.",
  work_hours: "Круглосуточно, 24/7",
};

let cache: { services: Service[]; faq: FaqItem[]; settings: SiteSettings } | null = null;

function parseResponse(data: unknown): unknown {
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return data; }
  }
  return data;
}

export function useSiteData() {
  const [services, setServices] = useState<Service[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cache) {
      setServices(cache.services);
      setFaq(cache.faq);
      setSettings(cache.settings);
      setLoading(false);
      return;
    }
    Promise.all([
      fetch(CONTENT_URL + "/public/services").then(r => r.json()).then(parseResponse).catch(() => []),
      fetch(CONTENT_URL + "/public/faq").then(r => r.json()).then(parseResponse).catch(() => []),
      fetch(CONTENT_URL + "/public/settings").then(r => r.json()).then(parseResponse).catch(() => ({})),
    ]).then(([s, f, st]) => {
      const safeServices = Array.isArray(s) ? s : [];
      const safeFaq = Array.isArray(f) ? f : [];
      const safeSettings = (st && typeof st === "object" && !Array.isArray(st)) ? st : {};
      const mergedSettings = { ...DEFAULT_SETTINGS, ...safeSettings };
      cache = { services: safeServices, faq: safeFaq, settings: mergedSettings };
      setServices(safeServices);
      setFaq(safeFaq);
      setSettings(mergedSettings);
      setLoading(false);
    });
  }, []);

  return { services, faq, settings, loading };
}