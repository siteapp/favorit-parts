export function extractManufacturers(goods) {
  const unique = new Map();
  goods.forEach((item) => {
    if (item.brand && !unique.has(item.brand)) {
      unique.set(item.brand, {
        brand: item.brand,
        number: item.number || '',
        name: item.name || '',
      });
    }
  });
  return [...unique.values()];
}

function toOffer(item, index) {
  const warehouses = Array.isArray(item.warehouses) ? item.warehouses : [];
  // Цена берётся со склада: сначала с наличием, иначе — с любого склада
  const withStock = warehouses.filter((w) => Number(w.stock) > 0 && w.price != null);
  const pool = withStock.length ? withStock : warehouses.filter((w) => w.price != null);
  const prices = pool.map((w) => Number(w.price));
  const stockSum = warehouses.reduce((sum, w) => sum + (Number(w.stock) || 0), 0);

  return {
    key: `${index}-${item.goodsID || item.number}`,
    brand: item.brand || '',
    number: item.number || '',
    name: item.name || '',
    price: prices.length ? Math.min(...prices) : null,
    stock: Number(item.count ?? stockSum) || 0,
    warehouses: warehouses.map((w) => w.code || w.id).filter(Boolean).join(', '),
    notRefund: Boolean(item.notRefund),
  };
}

export function flattenOffers(goods) {
  const seen = new Set();
  const list = [];

  goods.forEach((item) => {
    [item, ...(Array.isArray(item.analogues) ? item.analogues : [])].forEach((entry) => {
      const id = `${entry.brand}|${entry.number}|${entry.goodsID}`;
      if ((entry.brand || entry.number) && !seen.has(id)) {
        seen.add(id);
        list.push(entry);
      }
    });
  });

  return list
    .map(toOffer)
    .sort((a, b) => (a.price == null) - (b.price == null) || (a.price ?? 0) - (b.price ?? 0));
}

export function formatPrice(value) {
  if (value == null) return '—';
  return value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
