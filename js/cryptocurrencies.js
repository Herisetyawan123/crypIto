const cryptoTable = document.getElementById('crypto-table');
const cryptoData = document.getElementById('crypto-data');
const searchInput = document.getElementById('searchInput');
const selectedCryptoDiv = document.getElementById('selected-crypto');
const cryptoDetails = document.getElementById('crypto-details');
const closeDetailsButton = document.getElementById('close-details');
const totalMarketCapElement = document.getElementById('total-market-cap');
const totalVolumeElement = document.getElementById('total-volume');
const btcDominanceElement = document.getElementById('btc-dominance');
const hotCoinsGrid = document.getElementById('hot-coins-grid');
const overlay = document.getElementById('overlay');

let cryptoArray = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchCryptoData();

  if (searchInput) {
    searchInput.addEventListener('input', filterCryptoData);
  }

  if (closeDetailsButton) {
    closeDetailsButton.addEventListener('click', hideDetails);
  }

  if (overlay) {
    overlay.addEventListener('click', hideDetails);
  }

  setInterval(fetchCryptoData, 60000);
});

async function fetchCryptoData() {
  try {
    const hotCoinsLoader = document.getElementById('hot-coins-loader');
    if (hotCoinsLoader) hotCoinsLoader.style.display = 'block';

    if (cryptoTable) {
      cryptoTable.style.display = 'none';
    }

    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h,24h,7d'
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    cryptoArray = await response.json();

    if (hotCoinsGrid) {
      displayHotCoins(cryptoArray.slice(0, 4));
      if (hotCoinsLoader) hotCoinsLoader.style.display = 'none';
    }

    if (cryptoData) {
      displayCryptoData(cryptoArray);
      updateMarketStats(cryptoArray);

      if (cryptoTable) {
        cryptoTable.style.display = 'table';
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    showError('Failed to load cryptocurrency data. Please try again later.');

    if (hotCoinsLoader) hotCoinsLoader.style.display = 'none';

    if (hotCoinsGrid) {
      hotCoinsGrid.innerHTML =
        '<p class="error-text">Failed to load data. Please try again later.</p>';
    }

    if (cryptoData) {
      cryptoData.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 2rem;">
            <div style="color: var(--danger);">
              Failed to load data. Please try again later.
            </div>
          </td>
        </tr>
      `;

      if (cryptoTable) {
        cryptoTable.style.display = 'table';
      }
    }
  }
}

// Display hot coins in grid
function displayHotCoins(coins) {
  if (!hotCoinsGrid) return;

  hotCoinsGrid.innerHTML = '';

  coins.forEach((coin) => {
    const priceChangeClass =
      coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';

    const coinCard = document.createElement('div');
    coinCard.className = 'coin-card';
    coinCard.addEventListener('click', () => showCryptoDetails(coin));

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
        ${
          coin.price_change_percentage_24h
            ? coin.price_change_percentage_24h.toFixed(2)
            : '0.00'
        }% (24h)
      </div>
    `;

    hotCoinsGrid.appendChild(coinCard);
  });
}

// Display the crypto data in the table
function displayCryptoData(data) {
  if (!cryptoData) return;

  cryptoData.innerHTML = '';

  data.forEach((coin) => {
    const row = document.createElement('tr');
    row.addEventListener('click', () => showCryptoDetails(coin));

    const priceChangeClass24h =
      coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';
    const priceChangeClass7d =
      coin.price_change_percentage_7d_in_currency >= 0
        ? 'positive'
        : 'negative';

    row.innerHTML = `
      <td>${coin.market_cap_rank}</td>
      <td>
        <div class="crypto-name">
          <img src="${coin.image}" alt="${coin.name}">
          ${
            coin.name
          } <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span>
        </div>
      </td>
      <td>$${formatPrice(coin.current_price)}</td>
      <td class="${priceChangeClass24h}">${
      coin.price_change_percentage_24h
        ? coin.price_change_percentage_24h.toFixed(2)
        : '0.00'
    }%</td>
      <td class="${priceChangeClass7d}">${
      coin.price_change_percentage_7d_in_currency
        ? coin.price_change_percentage_7d_in_currency.toFixed(2)
        : '0.00'
    }%</td>
      <td>$${formatLargeNumber(coin.market_cap)}</td>
      <td>$${formatLargeNumber(coin.total_volume)}</td>
    `;

    cryptoData.appendChild(row);
  });
}

function filterCryptoData() {
  if (!searchInput || !cryptoArray) return;

  const searchTerm = searchInput.value.toLowerCase();

  const filteredData = cryptoArray.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm) ||
      coin.symbol.toLowerCase().includes(searchTerm)
  );

  displayCryptoData(filteredData);
}

function showCryptoDetails(coin) {
  if (!cryptoDetails || !selectedCryptoDiv || !overlay) return;

  const priceChangeClass24h =
    coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative';

  cryptoDetails.innerHTML = `
    <div class="crypto-detail-header">
      <img src="${coin.image}" alt="${coin.name}">
      <div>
        <h2>${
          coin.name
        } <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span></h2>
        <div class="price-large">$${formatPrice(coin.current_price)}</div>
        <span class="${priceChangeClass24h}">${
    coin.price_change_percentage_24h
      ? coin.price_change_percentage_24h.toFixed(2)
      : '0.00'
  }% (24h)</span>
      </div>
    </div>
    
    <div class="crypto-stats">
      <div class="stat-item">
        <div class="stat-label">Market Cap</div>
        <div class="stat-value">$${formatLargeNumber(coin.market_cap)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">24h Volume</div>
        <div class="stat-value">$${formatLargeNumber(coin.total_volume)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Circulating Supply</div>
        <div class="stat-value">${formatLargeNumber(
          coin.circulating_supply
        )} ${coin.symbol.toUpperCase()}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">Total Supply</div>
        <div class="stat-value">${
          coin.total_supply ? formatLargeNumber(coin.total_supply) : 'N/A'
        } ${coin.symbol.toUpperCase()}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">All-Time High</div>
        <div class="stat-value">$${formatPrice(coin.ath)}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">All-Time Low</div>
        <div class="stat-value">$${formatPrice(coin.atl)}</div>
      </div>
    </div>
  `;

  selectedCryptoDiv.style.display = 'block';
  overlay.style.display = 'block';
}

function hideDetails() {
  if (!selectedCryptoDiv || !overlay) return;

  selectedCryptoDiv.style.display = 'none';
  overlay.style.display = 'none';
}

function updateMarketStats(data) {
  if (!totalMarketCapElement || !totalVolumeElement || !btcDominanceElement)
    return;

  let totalMarketCap = 0;
  let totalVolume = 0;
  let btcMarketCap = 0;

  data.forEach((coin) => {
    totalMarketCap += coin.market_cap || 0;
    totalVolume += coin.total_volume || 0;

    if (coin.symbol === 'btc') {
      btcMarketCap = coin.market_cap || 0;
    }
  });

  const btcDominance = ((btcMarketCap / totalMarketCap) * 100).toFixed(1);

  totalMarketCapElement.textContent = `$${formatLargeNumber(totalMarketCap)}`;
  totalVolumeElement.textContent = `$${formatLargeNumber(totalVolume)}`;
  btcDominanceElement.textContent = `${btcDominance}%`;
}
