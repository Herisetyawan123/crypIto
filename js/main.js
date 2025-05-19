document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.getElementById('hamburger-menu');
  const navMenu = document.querySelector('nav ul');

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      navMenu.classList.toggle('show');

      const spans = hamburgerMenu.querySelectorAll('span');
      if (navMenu.classList.contains('show')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (
      navMenu &&
      navMenu.classList.contains('show') &&
      !e.target.closest('nav') &&
      !e.target.closest('.hamburger')
    ) {
      navMenu.classList.remove('show');

      const spans = hamburgerMenu.querySelectorAll('span');
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });

  initAccordions();

  const topCoinsGrid = document.getElementById('top-coins-grid');
  if (topCoinsGrid) {
    loadTopCoins();
  }
});

const dummyCoins = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'btc',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 68421.53,
    price_change_percentage_24h: 2.76,
    market_cap: 1345876543210,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'eth',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 3542.87,
    price_change_percentage_24h: 3.45,
    market_cap: 425632145698,
  },
  {
    id: 'binancecoin',
    name: 'Binance Coin',
    symbol: 'bnb',
    image:
      'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
    current_price: 614.23,
    price_change_percentage_24h: -1.25,
    market_cap: 94532178456,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'sol',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 159.87,
    price_change_percentage_24h: 5.32,
    market_cap: 69854123657,
  },
];

function loadTopCoins() {
  const topCoinsGrid = document.getElementById('top-coins-grid');
  const loader = document.getElementById('top-coins-loader');

  if (topCoinsGrid) {
    if (loader) {
      loader.style.display = 'none';
    }

    topCoinsGrid.innerHTML = '';

    displayTopCoins(dummyCoins);
  }
}

function displayTopCoins(coins) {
  const topCoinsGrid = document.getElementById('top-coins-grid');

  if (!topCoinsGrid) return;

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
        ${
          coin.price_change_percentage_24h
            ? coin.price_change_percentage_24h.toFixed(2)
            : '0.00'
        }% (24h)
      </div>
      <div class="coin-market-cap">Market Cap: $${formatLargeNumber(
        coin.market_cap
      )}</div>
    `;

    topCoinsGrid.appendChild(coinCard);
  });
}

function initAccordions() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');

      header.addEventListener('click', () => {
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            otherItem
              .querySelector('.accordion-content')
              .classList.remove('active');
          }
        });

        item.classList.toggle('active');
        content.classList.toggle('active');
      });
    });
  }
}

function formatLargeNumber(num) {
  if (!num) return '0';

  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  }
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }

  return num.toLocaleString();
}

function formatPrice(price) {
  if (price === null || price === undefined) return '0.00';

  if (price < 0.01) {
    return price.toFixed(6);
  } else if (price < 1) {
    return price.toFixed(4);
  } else {
    return price.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

function showError(message, element) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-notification';
  errorDiv.textContent = message;

  if (element) {
    element.insertAdjacentElement('afterend', errorDiv);
  } else {
    document.body.appendChild(errorDiv);
  }

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}
