// ORIT Crypto Markets - Advanced JavaScript with CoinMarketCap API Integration

// CoinMarketCap API Configuration
const CMC_API_KEY = '2e3bbb33-6d97-4fa6-b868-2168406076ca';
const CMC_BASE_URL = 'https://pro-api.coinmarketcap.com/v1';
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'; // CORS proxy for demo

// Application State
let cryptoData = [];
let currentPage = 1;
let itemsPerPage = 50;
let currentView = 'table';
let currentSort = 'market_cap';
let isLoading = false;

// DOM Elements
const elements = {
    loadingOverlay: document.getElementById('loadingOverlay'),
    cryptoTableBody: document.getElementById('cryptoTableBody'),
    cryptoCardsGrid: document.getElementById('cryptoCardsGrid'),
    tableView: document.getElementById('tableView'),
    cardsView: document.getElementById('cardsView'),
    totalMarketCap: document.getElementById('totalMarketCap'),
    totalVolume: document.getElementById('totalVolume'),
    btcDominance: document.getElementById('btcDominance'),
    marketCapChange: document.getElementById('marketCapChange'),
    volumeChange: document.getElementById('volumeChange'),
    dominanceChange: document.getElementById('dominanceChange'),
    fearGreedValue: document.getElementById('fearGreedValue'),
    fearGreedLabel: document.getElementById('fearGreedLabel'),
    fearGreedFill: document.getElementById('fearGreedFill'),
    pageInfo: document.getElementById('pageInfo'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    sortBy: document.getElementById('sortBy'),
    limitBy: document.getElementById('limitBy'),
    moversList: document.getElementById('moversList'),
    volumeLeaders: document.getElementById('volumeLeaders'),
    backToTop: document.getElementById('backToTop'),
    tradeFab: document.getElementById('tradeFab')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        showLoading();
        await initializeData();
        initializeEventListeners();
        initializeCharts();
        hideLoading();
        initializeAnimations();
    } catch (error) {
        console.error('Failed to initialize app:', error);
        hideLoading();
        showError('Failed to load cryptocurrency data. Please refresh the page.');
    }
}

// Loading Management
function showLoading() {
    if (elements.loadingOverlay) {
        elements.loadingOverlay.classList.remove('hidden');
    }
    isLoading = true;
}

function hideLoading() {
    setTimeout(() => {
        if (elements.loadingOverlay) {
            elements.loadingOverlay.classList.add('hidden');
        }
        isLoading = false;
    }, 1500);
}

// API Functions
async function fetchCryptoData(limit = 100, start = 1) {
    try {
        // Note: In production, you'd use a backend proxy to handle CORS and API keys
        // For demo purposes, we'll use mock data that matches CoinMarketCap structure
        
        const mockData = await generateMockCryptoData(limit);
        return mockData;
        
        // Actual API call (uncomment when using backend proxy):
        /*
        const response = await fetch(`${CMC_BASE_URL}/cryptocurrency/listings/latest?limit=${limit}&start=${start}&sort=${currentSort}`, {
            headers: {
                'X-CMC_PRO_API_KEY': CMC_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        */
    } catch (error) {
        console.error('Error fetching crypto data:', error);
        throw error;
    }
}

async function fetchGlobalMetrics() {
    try {
        // Mock global data - replace with actual API call
        return {
            data: {
                quote: {
                    USD: {
                        total_market_cap: 1834600000000,
                        total_volume_24h: 89540000000,
                        total_market_cap_yesterday: 1812300000000,
                        total_volume_24h_yesterday: 92100000000
                    }
                },
                btc_dominance: 52.8,
                btc_dominance_yesterday: 52.5,
                active_cryptocurrencies: 9943,
                active_exchanges: 756
            }
        };
    } catch (error) {
        console.error('Error fetching global metrics:', error);
        throw error;
    }
}

// Mock Data Generation (for demo purposes)
async function generateMockCryptoData(limit) {
    const cryptoNames = [
        { name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
        { name: 'Ethereum', symbol: 'ETH', icon: '♦' },
        { name: 'BNB', symbol: 'BNB', icon: '🔶' },
        { name: 'Solana', symbol: 'SOL', icon: '◎' },
        { name: 'XRP', symbol: 'XRP', icon: '💧' },
        { name: 'Cardano', symbol: 'ADA', icon: '🟢' },
        { name: 'Dogecoin', symbol: 'DOGE', icon: '🐕' },
        { name: 'Polygon', symbol: 'MATIC', icon: '🔷' },
        { name: 'Avalanche', symbol: 'AVAX', icon: '🔺' },
        { name: 'Chainlink', symbol: 'LINK', icon: '🔗' }
    ];

    const data = [];
    
    for (let i = 0; i < Math.min(limit, 100); i++) {
        const crypto = cryptoNames[i % cryptoNames.length];
        const basePrice = Math.random() * 1000 + 10;
        const change24h = (Math.random() - 0.5) * 20;
        const change7d = (Math.random() - 0.5) * 30;
        const volume = Math.random() * 10000000000;
        const marketCap = basePrice * (Math.random() * 1000000000 + 10000000);
        
        data.push({
            id: i + 1,
            name: `${crypto.name} ${i > 9 ? Math.floor(i/10) : ''}`.trim(),
            symbol: crypto.symbol,
            slug: crypto.name.toLowerCase(),
            cmc_rank: i + 1,
            num_market_pairs: Math.floor(Math.random() * 500) + 50,
            circulating_supply: Math.floor(Math.random() * 1000000000) + 1000000,
            total_supply: Math.floor(Math.random() * 2000000000) + 1000000,
            max_supply: Math.floor(Math.random() * 3000000000) + 1000000,
            last_updated: new Date().toISOString(),
            quote: {
                USD: {
                    price: basePrice,
                    volume_24h: volume,
                    percent_change_1h: (Math.random() - 0.5) * 5,
                    percent_change_24h: change24h,
                    percent_change_7d: change7d,
                    percent_change_30d: (Math.random() - 0.5) * 50,
                    market_cap: marketCap,
                    last_updated: new Date().toISOString()
                }
            },
            icon: crypto.icon
        });
    }

    return { data, status: { error_code: 0 } };
}

// Data Processing
async function initializeData() {
    try {
        // Fetch crypto data
        const cryptoResponse = await fetchCryptoData(parseInt(elements.limitBy.value));
        cryptoData = cryptoResponse.data;
        
        // Fetch global metrics
        const globalResponse = await fetchGlobalMetrics();
        updateGlobalMetrics(globalResponse.data);
        
        // Update UI
        renderCryptoData();
        updateMovers();
        updateVolumeLeaders();
        updateFearGreedIndex();
        
    } catch (error) {
        console.error('Error initializing data:', error);
        showError('Failed to load market data');
    }
}

function updateGlobalMetrics(data) {
    if (elements.totalMarketCap) {
        const marketCap = data.quote.USD.total_market_cap;
        const marketCapYesterday = data.quote.USD.total_market_cap_yesterday;
        const marketCapChange = ((marketCap - marketCapYesterday) / marketCapYesterday) * 100;
        
        elements.totalMarketCap.textContent = formatCurrency(marketCap);
        elements.marketCapChange.textContent = formatPercentage(marketCapChange);
        elements.marketCapChange.className = `card-change ${marketCapChange >= 0 ? 'positive' : 'negative'}`;
    }
    
    if (elements.totalVolume) {
        const volume = data.quote.USD.total_volume_24h;
        const volumeYesterday = data.quote.USD.total_volume_24h_yesterday;
        const volumeChange = ((volume - volumeYesterday) / volumeYesterday) * 100;
        
        elements.totalVolume.textContent = formatCurrency(volume);
        elements.volumeChange.textContent = formatPercentage(volumeChange);
        elements.volumeChange.className = `card-change ${volumeChange >= 0 ? 'positive' : 'negative'}`;
    }
    
    if (elements.btcDominance) {
        const dominance = data.btc_dominance;
        const dominanceYesterday = data.btc_dominance_yesterday;
        const dominanceChange = dominance - dominanceYesterday;
        
        elements.btcDominance.textContent = dominance.toFixed(1) + '%';
        elements.dominanceChange.textContent = formatPercentage(dominanceChange);
        elements.dominanceChange.className = `card-change ${dominanceChange >= 0 ? 'positive' : 'negative'}`;
    }
}

function updateFearGreedIndex() {
    // Mock Fear & Greed Index (0-100)
    const fearGreedValue = Math.floor(Math.random() * 100);
    let label, fillPercentage;
    
    if (fearGreedValue <= 20) {
        label = 'Extreme Fear';
        fillPercentage = 20;
    } else if (fearGreedValue <= 40) {
        label = 'Fear';
        fillPercentage = 40;
    } else if (fearGreedValue <= 60) {
        label = 'Neutral';
        fillPercentage = 60;
    } else if (fearGreedValue <= 80) {
        label = 'Greed';
        fillPercentage = 80;
    } else {
        label = 'Extreme Greed';
        fillPercentage = 100;
    }
    
    if (elements.fearGreedValue) elements.fearGreedValue.textContent = fearGreedValue;
    if (elements.fearGreedLabel) elements.fearGreedLabel.textContent = label;
    if (elements.fearGreedFill) {
        elements.fearGreedFill.style.clipPath = `polygon(0 0, ${fillPercentage}% 0, ${fillPercentage}% 100%, 0 100%)`;
    }
}

// Rendering Functions
function renderCryptoData() {
    if (currentView === 'table') {
        renderTable();
    } else {
        renderCards();
    }
    updatePagination();
}

function renderTable() {
    if (!elements.cryptoTableBody) return;
    
    elements.cryptoTableBody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = cryptoData.slice(startIndex, endIndex);
    
    pageData.forEach((crypto, index) => {
        const row = createTableRow(crypto, startIndex + index + 1);
        elements.cryptoTableBody.appendChild(row);
    });
}

function createTableRow(crypto, index) {
    const row = document.createElement('tr');
    row.className = 'crypto-row';
    
    const price = crypto.quote.USD.price;
    const change24h = crypto.quote.USD.percent_change_24h;
    const change7d = crypto.quote.USD.percent_change_7d;
    const volume24h = crypto.quote.USD.volume_24h;
    const marketCap = crypto.quote.USD.market_cap;
    
    row.innerHTML = `
        <td class="rank-col">
            <span class="crypto-rank">${crypto.cmc_rank}</span>
        </td>
        <td class="name-col">
            <div class="crypto-name">
                <div class="crypto-icon">${crypto.icon || '🪙'}</div>
                <div class="crypto-info">
                    <div class="crypto-symbol">${crypto.symbol}</div>
                    <div class="crypto-full-name">${crypto.name}</div>
                </div>
            </div>
        </td>
        <td class="price-col">
            <span class="crypto-price">${formatCurrency(price)}</span>
        </td>
        <td class="change-col">
            <span class="crypto-change ${change24h >= 0 ? 'positive' : 'negative'}">
                ${formatPercentage(change24h)}
            </span>
        </td>
        <td class="change-col">
            <span class="crypto-change ${change7d >= 0 ? 'positive' : 'negative'}">
                ${formatPercentage(change7d)}
            </span>
        </td>
        <td class="volume-col">
            <span class="volume-value">${formatCurrency(volume24h)}</span>
        </td>
        <td class="market-cap-col">
            <span class="market-cap-value">${formatCurrency(marketCap)}</span>
        </td>
        <td class="chart-col">
            <div class="mini-chart" data-crypto="${crypto.symbol}">
                <canvas width="80" height="40"></canvas>
            </div>
        </td>
        <td class="action-col">
            <button class="trade-btn" onclick="openTradeModal('${crypto.symbol}', ${price})">
                Trade
            </button>
        </td>
    `;
    
    // Add hover animations
    row.addEventListener('mouseenter', () => {
        gsap.to(row, { duration: 0.3, scale: 1.02, ease: 'power2.out' });
    });
    
    row.addEventListener('mouseleave', () => {
        gsap.to(row, { duration: 0.3, scale: 1, ease: 'power2.out' });
    });
    
    return row;
}

function renderCards() {
    if (!elements.cryptoCardsGrid) return;
    
    elements.cryptoCardsGrid.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = cryptoData.slice(startIndex, endIndex);
    
    pageData.forEach((crypto, index) => {
        const card = createCryptoCard(crypto, startIndex + index + 1);
        elements.cryptoCardsGrid.appendChild(card);
    });
}

function createCryptoCard(crypto) {
    const card = document.createElement('div');
    card.className = 'crypto-card';
    
    const price = crypto.quote.USD.price;
    const change24h = crypto.quote.USD.percent_change_24h;
    const volume24h = crypto.quote.USD.volume_24h;
    const marketCap = crypto.quote.USD.market_cap;
    
    card.innerHTML = `
        <div class="card-header">
            <div class="crypto-name">
                <div class="crypto-icon">${crypto.icon || '🪙'}</div>
                <div class="crypto-info">
                    <div class="crypto-symbol">${crypto.symbol}</div>
                    <div class="crypto-full-name">${crypto.name}</div>
                </div>
            </div>
            <span class="crypto-rank">#${crypto.cmc_rank}</span>
        </div>
        
        <div class="card-price">
            <span class="crypto-price">${formatCurrency(price)}</span>
            <span class="crypto-change ${change24h >= 0 ? 'positive' : 'negative'}">
                ${formatPercentage(change24h)}
            </span>
        </div>
        
        <div class="card-stats">
            <div class="stat-item">
                <span class="stat-label">Market Cap</span>
                <span class="stat-value">${formatCurrency(marketCap)}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Volume (24h)</span>
                <span class="stat-value">${formatCurrency(volume24h)}</span>
            </div>
        </div>
        
        <div class="card-actions">
            <button class="trade-btn" onclick="openTradeModal('${crypto.symbol}', ${price})">
                Trade ${crypto.symbol}
            </button>
        </div>
    `;
    
    return card;
}

function updateMovers() {
    if (!elements.moversList) return;
    
    // Sort by 24h change
    const gainers = [...cryptoData]
        .sort((a, b) => b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h)
        .slice(0, 5);
    
    const losers = [...cryptoData]
        .sort((a, b) => a.quote.USD.percent_change_24h - b.quote.USD.percent_change_24h)
        .slice(0, 5);
    
    // Default to gainers
    let movers = gainers;
    const activeBtn = document.querySelector('.mover-btn.active');
    if (activeBtn && activeBtn.dataset.type === 'losers') {
        movers = losers;
    }
    
    elements.moversList.innerHTML = '';
    
    movers.forEach((crypto, index) => {
        const item = document.createElement('div');
        item.className = 'mover-item';
        
        const change = crypto.quote.USD.percent_change_24h;
        
        item.innerHTML = `
            <div class="mover-info">
                <span class="mover-rank">${index + 1}</span>
                <div class="crypto-icon">${crypto.icon || '🪙'}</div>
                <div class="crypto-info">
                    <div class="crypto-symbol">${crypto.symbol}</div>
                    <div class="crypto-price">${formatCurrency(crypto.quote.USD.price)}</div>
                </div>
            </div>
            <span class="crypto-change ${change >= 0 ? 'positive' : 'negative'}">
                ${formatPercentage(change)}
            </span>
        `;
        
        elements.moversList.appendChild(item);
    });
}

function updateVolumeLeaders() {
    if (!elements.volumeLeaders) return;
    
    const leaders = [...cryptoData]
        .sort((a, b) => b.quote.USD.volume_24h - a.quote.USD.volume_24h)
        .slice(0, 5);
    
    elements.volumeLeaders.innerHTML = '';
    
    leaders.forEach((crypto, index) => {
        const item = document.createElement('div');
        item.className = 'mover-item';
        
        item.innerHTML = `
            <div class="mover-info">
                <span class="mover-rank">${index + 1}</span>
                <div class="crypto-icon">${crypto.icon || '🪙'}</div>
                <div class="crypto-info">
                    <div class="crypto-symbol">${crypto.symbol}</div>
                    <div class="crypto-price">${formatCurrency(crypto.quote.USD.price)}</div>
                </div>
            </div>
            <span class="volume-value">${formatCurrency(crypto.quote.USD.volume_24h)}</span>
        `;
        
        elements.volumeLeaders.appendChild(item);
    });
}

function updatePagination() {
    const totalPages = Math.ceil(cryptoData.length / itemsPerPage);
    
    if (elements.pageInfo) {
        elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    if (elements.prevPage) {
        elements.prevPage.disabled = currentPage === 1;
    }
    
    if (elements.nextPage) {
        elements.nextPage.disabled = currentPage === totalPages;
    }
}

// Event Listeners
function initializeEventListeners() {
    // View toggle
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            currentView = e.target.dataset.view;
            
            if (currentView === 'table') {
                elements.tableView.classList.remove('hidden');
                elements.cardsView.classList.add('hidden');
            } else {
                elements.tableView.classList.add('hidden');
                elements.cardsView.classList.remove('hidden');
            }
            
            renderCryptoData();
        });
    });
    
    // Pagination
    if (elements.prevPage) {
        elements.prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderCryptoData();
                scrollToTop();
            }
        });
    }
    
    if (elements.nextPage) {
        elements.nextPage.addEventListener('click', () => {
            const totalPages = Math.ceil(cryptoData.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderCryptoData();
                scrollToTop();
            }
        });
    }
    
    // Filters
    if (elements.sortBy) {
        elements.sortBy.addEventListener('change', (e) => {
            currentSort = e.target.value;
            sortCryptoData();
            renderCryptoData();
        });
    }
    
    if (elements.limitBy) {
        elements.limitBy.addEventListener('change', async (e) => {
            const newLimit = parseInt(e.target.value);
            showLoading();
            
            try {
                const response = await fetchCryptoData(newLimit);
                cryptoData = response.data;
                currentPage = 1;
                renderCryptoData();
            } catch (error) {
                showError('Failed to load data');
            }
            
            hideLoading();
        });
    }
    
    // Movers toggle
    document.querySelectorAll('.mover-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mover-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateMovers();
        });
    });
    
    // Scroll to top
    if (elements.backToTop) {
        elements.backToTop.addEventListener('click', scrollToTop);
    }
    
    // FAB
    if (elements.tradeFab) {
        elements.tradeFab.addEventListener('click', () => {
            openQuickTradeModal();
        });
    }
    
    // Scroll listener for back to top button
    window.addEventListener('scroll', () => {
        if (elements.backToTop) {
            if (window.scrollY > 300) {
                elements.backToTop.classList.add('visible');
            } else {
                elements.backToTop.classList.remove('visible');
            }
        }
    });
    
    // Timeframe buttons
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.timeframe-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const period = e.target.dataset.period;
            updateMarketTrendChart(period);
        });
    });
}

// Utility Functions
function sortCryptoData() {
    cryptoData.sort((a, b) => {
        switch (currentSort) {
            case 'market_cap':
                return b.quote.USD.market_cap - a.quote.USD.market_cap;
            case 'price':
                return b.quote.USD.price - a.quote.USD.price;
            case 'percent_change_24h':
                return b.quote.USD.percent_change_24h - a.quote.USD.percent_change_24h;
            case 'volume_24h':
                return b.quote.USD.volume_24h - a.quote.USD.volume_24h;
            default:
                return b.quote.USD.market_cap - a.quote.USD.market_cap;
        }
    });
}

function formatCurrency(value) {
    if (value >= 1e12) {
        return `$${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
        return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
        return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
        return `$${(value / 1e3).toFixed(2)}K`;
    } else {
        return `$${value.toFixed(2)}`;
    }
}

function formatPercentage(value) {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showError(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
            <button class="close-notification">×</button>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .error-notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--danger-red);
            border-radius: var(--border-radius);
            padding: 1rem;
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .error-icon {
            font-size: 1.2rem;
        }
        .error-message {
            flex: 1;
            font-size: 0.9rem;
        }
        .close-notification {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0;
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 5000);
    
    // Manual close
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.remove();
        style.remove();
    });
}

// Modal Functions
function openTradeModal(symbol, price) {
    const modal = document.createElement('div');
    modal.className = 'trade-modal-overlay';
    modal.innerHTML = `
        <div class="trade-modal">
            <div class="modal-header">
                <h3>Trade ${symbol}</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="modal-content">
                <div class="trade-tabs">
                    <button class="trade-tab active" data-type="buy">Buy</button>
                    <button class="trade-tab" data-type="sell">Sell</button>
                </div>
                <div class="trade-form">
                    <div class="form-group">
                        <label>Amount (${symbol})</label>
                        <input type="number" id="tradeAmount" placeholder="0.00" class="trade-input">
                    </div>
                    <div class="form-group">
                        <label>Order Type</label>
                        <select id="orderType" class="trade-select">
                            <option value="market">Market Order</option>
                            <option value="limit">Limit Order</option>
                            <option value="stop">Stop Order</option>
                        </select>
                    </div>
                    <div class="trade-summary">
                        <div class="summary-row">
                            <span>Current Price:</span>
                            <span>${formatCurrency(price)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Estimated Total:</span>
                            <span id="estimatedTotal">$0.00</span>
                        </div>
                    </div>
                    <button class="confirm-trade-btn buy-btn" id="confirmTrade">
                        Buy ${symbol}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    addModalStyles();
    
    // Event listeners
    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Trade tabs
    modal.querySelectorAll('.trade-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            modal.querySelectorAll('.trade-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            
            const type = e.target.dataset.type;
            const confirmBtn = modal.querySelector('#confirmTrade');
            confirmBtn.textContent = `${type.charAt(0).toUpperCase() + type.slice(1)} ${symbol}`;
            confirmBtn.className = `confirm-trade-btn ${type}-btn`;
        });
    });
    
    // Amount input
    const amountInput = modal.querySelector('#tradeAmount');
    amountInput.addEventListener('input', (e) => {
        const amount = parseFloat(e.target.value) || 0;
        const total = amount * price;
        modal.querySelector('#estimatedTotal').textContent = formatCurrency(total);
    });
    
    // Confirm trade
    modal.querySelector('#confirmTrade').addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (amount > 0) {
            showTradeConfirmation(symbol, amount, price);
            modal.remove();
        }
    });
}

function openQuickTradeModal() {
    // Show popular cryptocurrencies for quick trading
    const topCryptos = cryptoData.slice(0, 6);
    
    const modal = document.createElement('div');
    modal.className = 'quick-trade-modal-overlay';
    modal.innerHTML = `
        <div class="quick-trade-modal">
            <div class="modal-header">
                <h3>Quick Trade</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="modal-content">
                <div class="quick-trade-grid">
                    ${topCryptos.map(crypto => `
                        <div class="quick-trade-item" onclick="openTradeModal('${crypto.symbol}', ${crypto.quote.USD.price})">
                            <div class="crypto-icon">${crypto.icon || '🪙'}</div>
                            <div class="crypto-info">
                                <div class="crypto-symbol">${crypto.symbol}</div>
                                <div class="crypto-price">${formatCurrency(crypto.quote.USD.price)}</div>
                            </div>
                            <div class="crypto-change ${crypto.quote.USD.percent_change_24h >= 0 ? 'positive' : 'negative'}">
                                ${formatPercentage(crypto.quote.USD.percent_change_24h)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    addModalStyles();
    
    modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

function showTradeConfirmation(symbol, amount, price) {
    const total = amount * price;
    showSuccess(`Trade executed: ${amount} ${symbol} for ${formatCurrency(total)}`);
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="success-icon">✅</span>
            <span class="success-message">${message}</span>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .success-notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--success-green);
            border-radius: var(--border-radius);
            padding: 1rem;
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

function addModalStyles() {
    if (document.getElementById('modal-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'modal-styles';
    style.textContent = `
        .trade-modal-overlay, .quick-trade-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        .trade-modal, .quick-trade-modal {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            width: 500px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--glass-border);
        }
        .modal-header h3 {
            margin: 0;
            color: var(--text-primary);
        }
        .close-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: var(--transition);
        }
        .close-btn:hover {
            background: var(--glass-bg);
            color: var(--text-primary);
        }
        .modal-content {
            padding: 1.5rem;
        }
        .trade-tabs {
            display: flex;
            background: var(--glass-bg);
            border-radius: 8px;
            padding: 4px;
            margin-bottom: 1.5rem;
        }
        .trade-tab {
            flex: 1;
            background: transparent;
            border: none;
            padding: 0.75rem;
            color: var(--text-secondary);
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            transition: var(--transition);
        }
        .trade-tab.active {
            background: var(--accent-blue);
            color: white;
        }
        .form-group {
            margin-bottom: 1.5rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--text-secondary);
            font-weight: 500;
        }
        .trade-input, .trade-select {
            width: 100%;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 0.8rem;
            color: var(--text-primary);
            font-size: 1rem;
        }
        .trade-input:focus, .trade-select:focus {
            outline: none;
            border-color: var(--accent-blue);
        }
        .trade-summary {
            background: var(--glass-bg);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.5rem;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        .summary-row:last-child {
            margin-bottom: 0;
            font-weight: 600;
        }
        .confirm-trade-btn {
            width: 100%;
            padding: 1rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            transition: var(--transition);
        }
        .confirm-trade-btn.buy-btn {
            background: var(--success-green);
            color: white;
        }
        .confirm-trade-btn.sell-btn {
            background: var(--danger-red);
            color: white;
        }
        .confirm-trade-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }
        .quick-trade-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        .quick-trade-item {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 1rem;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }
        .quick-trade-item:hover {
            border-color: var(--accent-blue);
            transform: translateY(-2px);
        }
        .quick-trade-item .crypto-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }
        .quick-trade-item .crypto-symbol {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }
        .quick-trade-item .crypto-price {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
        }
    `;
    
    document.head.appendChild(style);
}

// Charts
function initializeCharts() {
    initializeMarketTrendChart();
    initializeDominanceChart();
    initializeETFFlowChart();
    initializeMiniCharts();
}

function initializeMarketTrendChart() {
    const canvas = document.getElementById('marketTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Generate sample market data
    const labels = [];
    const data = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(time);
        data.push(Math.random() * 100000 + 1800000);
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Market Cap',
                data: data,
                borderColor: '#00ccff',
                backgroundColor: 'rgba(0, 204, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 15, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#66ffff',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: { unit: 'hour' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#999999' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#999999',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function initializeDominanceChart() {
    const canvas = document.getElementById('dominanceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bitcoin', 'Ethereum', 'Others'],
            datasets: [{
                data: [52.8, 18.2, 29.0],
                backgroundColor: ['#f7931a', '#627eea', '#00ccff'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 15, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#66ffff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function initializeETFFlowChart() {
    const canvas = document.getElementById('etfFlowChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Generate sample ETF flow data
    const labels = [];
    const positiveData = [];
    const negativeData = [];
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString());
        
        const flow = (Math.random() - 0.6) * 1000000000;
        if (flow > 0) {
            positiveData.push(flow);
            negativeData.push(0);
        } else {
            positiveData.push(0);
            negativeData.push(flow);
        }
    }
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Inflows',
                    data: positiveData,
                    backgroundColor: '#00ff88',
                    borderRadius: 2
                },
                {
                    label: 'Outflows',
                    data: negativeData,
                    backgroundColor: '#ff4757',
                    borderRadius: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(10, 10, 15, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#66ffff',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return formatCurrency(Math.abs(context.parsed.y));
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { 
                        color: '#999999',
                        maxTicksLimit: 10
                    }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#999999',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

function initializeMiniCharts() {
    // Initialize mini charts for each crypto in the table
    setTimeout(() => {
        document.querySelectorAll('.mini-chart canvas').forEach(canvas => {
            const ctx = canvas.getContext('2d');
            
            // Generate sample price data
            const data = [];
            for (let i = 0; i < 20; i++) {
                data.push(Math.random() * 100 + 50);
            }
            
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 20}, (_, i) => i),
                    datasets: [{
                        data: data,
                        borderColor: data[19] > data[0] ? '#00ff88' : '#ff4757',
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    elements: { point: { radius: 0 } },
                    interaction: { intersect: false }
                }
            });
        });
    }, 100);
}

function updateMarketTrendChart(period) {
    // Update chart based on selected timeframe
    console.log(`Updating chart for ${period} period`);
    // Implementation would fetch new data and update chart
}

// Animations
function initializeAnimations() {
    // Animate cards on load
    gsap.from('.overview-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
    });
    
    gsap.from('.analytics-card', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    // Animate numbers
    gsap.from('.card-value', {
        duration: 2,
        textContent: 0,
        roundProps: 'textContent',
        ease: 'power2.out',
        delay: 0.5
    });
}

// Real-time updates (simulation)
setInterval(() => {
    if (!isLoading && cryptoData.length > 0) {
        updateRealTimeData();
    }
}, 30000); // Update every 30 seconds

function updateRealTimeData() {
    // Simulate price changes
    cryptoData.forEach(crypto => {
        const change = (Math.random() - 0.5) * 0.02; // ±1% change
        crypto.quote.USD.price *= (1 + change);
        crypto.quote.USD.percent_change_24h += (Math.random() - 0.5) * 2;
        crypto.quote.USD.volume_24h *= (1 + (Math.random() - 0.5) * 0.1);
        crypto.quote.USD.market_cap = crypto.quote.USD.price * crypto.circulating_supply;
    });
    
    // Update UI
    if (currentView === 'table') {
        renderTable();
    } else {
        renderCards();
    }
    
    updateMovers();
    updateVolumeLeaders();
}

// Export functions for external use
window.ORITCrypto = {
    openTradeModal,
    openQuickTradeModal,
    formatCurrency,
    formatPercentage
};