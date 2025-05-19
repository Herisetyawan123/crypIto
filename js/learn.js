const topCoinsGrid = document.getElementById('top-coins-grid');

document.addEventListener('DOMContentLoaded', () => {
  if (topCoinsGrid) {
    fetchTopCoins();
  }
});

async function fetchTopCoins() {
  try {
    const loader = document.getElementById('top-coins-loader');
    if (loader) loader.style.display = 'block';

    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false&price_change_percentage=24h'
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    displayTopCoins(data);

    if (loader) loader.style.display = 'none';
  } catch (error) {
    console.error('Error fetching data:', error);

    if (topCoinsGrid) {
      topCoinsGrid.innerHTML =
        '<p class="error-text">Failed to load top coins. Please try again later.</p>';
    }

    const loader = document.getElementById('top-coins-loader');
    if (loader) loader.style.display = 'none';
  }
}

function displayTopCoins(coins) {
  if (!topCoinsGrid) return;

  topCoinsGrid.innerHTML = '';

  coins.forEach((coin) => {
    const priceChangeClass =
      coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';

    const coinCard = document.createElement('div');
    coinCard.className = 'coin-card';

    coinCard.innerHTML = `
      <div class="coin-card-header">
        <img src="${coin.image}" alt="${coin.name}">
        <div>
          <div class="coin-name">${coin.name}</div>
          <div class="coin-symbol">${coin.symbol.toUpperCase()}</div>
        </div>
      </div>
      <div class="coin-price">$${formatPrice(coin.current_price)}</div>
      <div class="coin-change ${priceChangeClass}">
        ${coin.price_change_percentage_24h.toFixed(2)}% (24h)
      </div>
    `;

    topCoinsGrid.appendChild(coinCard);
  });
}
