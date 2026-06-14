/**
 * VokabelSafe - GeoIP Pricing Logic
 * Manages country-specific pricing and caching.
 */

const pricing = {
  DE: { monthly: "3,99 €", yearly: "29,99 €", lifetime: "49,99 €" },
  AT: { monthly: "3,99 €", yearly: "29,99 €", lifetime: "49,99 €" },
  CH: { monthly: "3,99 CHF", yearly: "29,99 CHF", lifetime: "49,99 CHF" },
  LI: { monthly: "3,99 CHF", yearly: "29,99 CHF", lifetime: "49,99 CHF" },
  DEFAULT: { monthly: "3,99 €", yearly: "29,99 €", lifetime: "49,99 €" }
};

async function updatePricing() {
  const cacheKey = 'vokabelsafe_geo_country';
  const cacheTimeKey = 'vokabelsafe_geo_time';
  const now = new Date().getTime();

  let countryCode = localStorage.getItem(cacheKey);
  const cachedTime = localStorage.getItem(cacheTimeKey);

  // Cache for 24h
  if (!countryCode || !cachedTime || (now - cachedTime > 86400000)) {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      countryCode = data.country_code || 'DEFAULT';
      localStorage.setItem(cacheKey, countryCode);
      localStorage.setItem(cacheTimeKey, now.toString());
    } catch (error) {
      console.error('GeoIP lookup failed', error);
      countryCode = countryCode || 'DEFAULT';
    }
  }

  const group = pricing[countryCode] || pricing['DEFAULT'];

  // Fill prices if elements exist
  const elements = {
    'price-monthly-val': group.monthly,
    'price-yearly-val': group.yearly,
    'price-lifetime-val': group.lifetime,
    'price-lifetime-promo-val': group.lifetime
  };

  for (const [id, value] of Object.entries(elements)) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  }
}

// Initial call
updatePricing();
