// Shared portfolio state via localStorage
const KEY = 'vpp_portfolio';

export function getPortfolio() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function addShares(farmId, qty, farmMeta) {
  const portfolio = getPortfolio();
  if (portfolio[farmId]) {
    portfolio[farmId].qty += qty;
    portfolio[farmId].totalInvested += qty * farmMeta.sharePrice;
  } else {
    portfolio[farmId] = {
      qty,
      totalInvested: qty * farmMeta.sharePrice,
      farmMeta,
      purchaseDate: new Date().toLocaleDateString('he-IL'),
    };
  }
  localStorage.setItem(KEY, JSON.stringify(portfolio));
  window.dispatchEvent(new Event('portfolio_updated'));
}