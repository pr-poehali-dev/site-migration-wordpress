import { useState, useEffect } from "react";

export const CONTENT_URL = "https://functions.poehali.dev/b305aa3e-2bad-4942-8d73-ddc275d86aa8";

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

export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
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

let cache: { services: Service[]; faq: FaqItem[]; settings: SiteSettings; news: NewsItem[] } | null = null;

export function parseResponse(data: unknown): unknown {
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return data; }
  }
  return data;
}

export function useSiteData() {
  const [services, setServices] = useState<Service[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cache) {
      setServices(cache.services);
      setFaq(cache.faq);
      setSettings(cache.settings);
      setNews(cache.news);
      setLoading(false);
      return;
    }
    Promise.all([
      fetch(CONTENT_URL + "?action=public_services").then(r => r.json()).then(parseResponse).catch(() => []),
      fetch(CONTENT_URL + "?action=public_faq").then(r => r.json()).then(parseResponse).catch(() => []),
      fetch(CONTENT_URL + "?action=public_settings").then(r => r.json()).then(parseResponse).catch(() => ({})),
      fetch(CONTENT_URL + "?action=public_news").then(r => r.json()).then(parseResponse).catch(() => []),
    ]).then(([s, f, st, n]) => {
      const safeServices = Array.isArray(s) ? s : [];
      const safeFaq = Array.isArray(f) ? f : [];
      const safeNews = Array.isArray(n) ? n : [];
      const safeSettings = (st && typeof st === "object" && !Array.isArray(st)) ? st : {};
      const mergedSettings = { ...DEFAULT_SETTINGS, ...safeSettings };
      cache = { services: safeServices, faq: safeFaq, settings: mergedSettings, news: safeNews };
      setServices(safeServices);
      setFaq(safeFaq);
      setSettings(mergedSettings);
      setNews(safeNews);
      setLoading(false);
    });
  }, []);

  return { services, faq, settings, news, loading };
}
