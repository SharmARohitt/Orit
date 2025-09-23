// Dashboard JavaScript for ORIT Trading Platform
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

function initDashboard() {
    hideLoadingOverlay();
    initCharts();
    initRealTimeUpdates();
    initInteractiveElements();
    initAnimations();
    initResponsiveHandlers();
}

// Hide loading overlay
function hideLoadingOverlay() {
    setTimeout(() => {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
    }, 1500);
}

// Initialize all charts
function initCharts() {
    initMiniTrendChart();
    initMainTradingChart();
    initExchangePieChart();
}

// Mini trend chart for index overview
function initMiniTrendChart() {
    const canvas = document.getElementById('mini-trend-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Generate sample data
    const dataPoints = [];
    let baseValue = 250;
    for (let i = 0; i < 20; i++) {
        baseValue += (Math.random() - 0.5) * 10;
        dataPoints.push(baseValue);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: 20}, (_, i) => i),
            datasets: [{
                data: dataPoints,
                borderColor: '#66ffff',
                backgroundColor: 'rgba(102, 255, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: { display: false },
                y: { display: false }
            },
            elements: {
                point: { radius: 0 }
            },
            interaction: {
                intersect: false
            }
        }
    });
}

// Main trading chart
function initMainTradingChart() {
    const canvas = document.getElementById('main-trading-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Generate candlestick data
    const candlestickData = [];
    let currentPrice = 262.84;
    
    for (let i = 0; i < 50; i++) {
        const open = currentPrice;
        const change = (Math.random() - 0.5) * 20;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 10;
        const low = Math.min(open, close) - Math.random() * 10;
        
        candlestickData.push({
            x: new Date(Date.now() - (49 - i) * 24 * 60 * 60 * 1000),
            o: open,
            h: high,
            l: low,
            c: close
        });
        
        currentPrice = close;
    }

    const chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
            datasets: [{
                label: 'CMC 100 Index',
                data: candlestickData,
                borderColor: {
                    up: '#00ff88',
                    down: '#ff4757',
                    unchanged: '#999999'
                },
                backgroundColor: {
                    up: 'rgba(0, 255, 136, 0.1)',
                    down: 'rgba(255, 71, 87, 0.1)',
                    unchanged: 'rgba(153, 153, 153, 0.1)'
                }
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
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const data = context.raw;
                            return [
                                `Open: $${data.o.toFixed(2)}`,
                                `High: $${data.h.toFixed(2)}`,
                                `Low: $${data.l.toFixed(2)}`,
                                `Close: $${data.c.toFixed(2)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'day',
                        displayFormats: {
                            day: 'MMM dd'
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#999999'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#999999',
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Update chart periodically
    setInterval(() => {
        updateTradingChart(chart);
    }, 5000);
}

// Exchange distribution pie chart
function initExchangePieChart() {
    const canvas = document.getElementById('exchange-pie-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Binance', 'Coinbase', 'Others'],
            datasets: [{
                data: [42.3, 28.1, 29.6],
                backgroundColor: [
                    '#00ff88',
                    '#0066ff',
                    '#ff6b35'
                ],
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
            },
            elements: {
                arc: {
                    borderWidth: 2,
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    });
}

// Update trading chart with new data
function updateTradingChart(chart) {
    const lastData = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1];
    const newPrice = lastData.c + (Math.random() - 0.5) * 5;
    
    const newCandle = {
        x: new Date(),
        o: lastData.c,
        h: Math.max(lastData.c, newPrice) + Math.random() * 2,
        l: Math.min(lastData.c, newPrice) - Math.random() * 2,
        c: newPrice
    };

    chart.data.datasets[0].data.push(newCandle);
    
    // Keep only last 50 data points
    if (chart.data.datasets[0].data.length > 50) {
        chart.data.datasets[0].data.shift();
    }
    
    chart.update('none'); // No animation for real-time updates
}

// Real-time data updates
function initRealTimeUpdates() {
    updatePrices();
    updateIndicators();
    
    // Update prices every 3 seconds
    setInterval(updatePrices, 3000);
    
    // Update indicators every 10 seconds
    setInterval(updateIndicators, 10000);
}

function updatePrices() {
    // Update main index value
    const indexValue = document.querySelector('.index-value');
    if (indexValue) {
        const currentValue = parseFloat(indexValue.textContent.replace('$', ''));
        const change = (Math.random() - 0.5) * 2;
        const newValue = currentValue + change;
        
        animateValue(indexValue, currentValue, newValue, 1000, '$');
    }

    // Update table prices  
    const priceElements = document.querySelectorAll('.price-cell');
    priceElements.forEach(element => {
        if (Math.random() < 0.3) { // 30% chance to update
            const currentPrice = parseFloat(element.textContent.replace(/[$,]/g, ''));
            const changePercent = (Math.random() - 0.5) * 0.02; // ±1%
            const newPrice = currentPrice * (1 + changePercent);
            
            animateValue(element, currentPrice, newPrice, 500, '$', true);
            
            // Update trend
            const trendCell = element.parentElement.querySelector('.trend-cell');
            if (trendCell) {
                const isPositive = changePercent > 0;
                trendCell.className = `trend-cell ${isPositive ? 'positive' : 'negative'}`;
                trendCell.querySelector('.trend-arrow').textContent = isPositive ? '↑' : '↓';
                trendCell.querySelector('.trend-value').textContent = 
                    Math.abs(changePercent * 100).toFixed(2) + '%';
            }
        }
    });

    // Update volume and market cap
    updateMetric('.volume-value', '$', 'B', 0.02);
    updateMetric('.mcap-value', '$', 'T', 0.01);
}

function updateIndicators() {
    // Update RSI
    const rsiValue = document.querySelector('.indicator-item .value');
    if (rsiValue && rsiValue.textContent !== '∞') {
        const newRsi = Math.max(0, Math.min(100, parseFloat(rsiValue.textContent) + (Math.random() - 0.5) * 5));
        rsiValue.textContent = newRsi.toFixed(1);
        
        const rsiBar = rsiValue.closest('.indicator-item').querySelector('.bar-fill');
        if (rsiBar) {
            rsiBar.style.width = newRsi + '%';
        }
        
        // Update status
        const status = rsiValue.closest('.indicator-value').querySelector('.status');
        if (status) {
            if (newRsi > 70) {
                status.textContent = 'Overbought';
                status.className = 'status bearish';
            } else if (newRsi < 30) {
                status.textContent = 'Oversold';
                status.className = 'status bullish';
            } else {
                status.textContent = 'Neutral';
                status.className = 'status neutral';
            }
        }
    }

    // Update AI confidence
    const confidenceBar = document.querySelector('.confidence-fill');
    if (confidenceBar) {
        const newConfidence = Math.max(60, Math.min(95, 
            parseFloat(confidenceBar.style.width) + (Math.random() - 0.5) * 5));
        confidenceBar.style.width = newConfidence + '%';
        
        const confidenceText = confidenceBar.parentElement.nextElementSibling;
        if (confidenceText) {
            confidenceText.textContent = Math.round(newConfidence) + '%';
        }
    }
}

function updateMetric(selector, prefix, suffix, volatility) {
    const element = document.querySelector(selector);
    if (element) {
        const currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, ''));
        const change = currentValue * (Math.random() - 0.5) * volatility;
        const newValue = currentValue + change;
        
        animateValue(element, currentValue, newValue, 1000, prefix, false, suffix);
    }
}

function animateValue(element, start, end, duration, prefix = '', useCommas = false, suffix = '') {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (difference * progress);
        let formattedValue = prefix;
        
        if (useCommas) {
            formattedValue += current.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            formattedValue += current.toFixed(2);
        }
        
        formattedValue += suffix;
        element.textContent = formattedValue;
        
        // Add flash effect
        if (progress < 1) {
            element.style.color = difference > 0 ? '#00ff88' : '#ff4757';
            requestAnimationFrame(updateValue);
        } else {
            setTimeout(() => {
                element.style.color = '';
            }, 200);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Interactive elements
function initInteractiveElements() {
    initActionButtons();
    initTabSwitching();
    initTimeframeSwitching();
    initTableInteractions();
    initTooltips();
}

function initActionButtons() {
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', function() {
            const label = this.querySelector('.action-label').textContent;
            handleActionClick(label);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // FAB button
    const fabBtn = document.querySelector('.fab-btn');
    if (fabBtn) {
        fabBtn.addEventListener('click', function() {
            this.style.transform = 'rotate(45deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
        });
    }

    // Navigation items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Animate click
            this.style.transform = 'translateX(5px)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

function handleActionClick(action) {
    switch(action) {
        case 'Buy':
            showTradeModal('buy');
            break;
        case 'Sell':
            showTradeModal('sell');
            break;
        case 'Voice Trade':
            startVoiceRecognition();
            break;
        case 'AI Assistant':
            showAIAssistant();
            break;
        case 'Copy Trade':
            showCopyTradeModal();
            break;
        case 'Paper Trade':
            switchToPaperMode();
            break;
    }
}

function showTradeModal(type) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'trade-modal-overlay';
    modal.innerHTML = `
        <div class="trade-modal">
            <div class="modal-header">
                <h3>${type.toUpperCase()} CMC 100 Index</h3>
                <button class="close-btn">×</button>
            </div>
            <div class="modal-content">
                <div class="trade-form">
                    <div class="form-group">
                        <label>Amount</label>
                        <input type="number" placeholder="0.00" class="amount-input">
                    </div>
                    <div class="form-group">
                        <label>Order Type</label>
                        <select class="order-type">
                            <option>Market</option>
                            <option>Limit</option>
                            <option>Stop</option>
                        </select>
                    </div>
                    <div class="trade-summary">
                        <div class="summary-row">
                            <span>Current Price:</span>
                            <span>$262.84</span>
                        </div>
                        <div class="summary-row">
                            <span>Estimated Total:</span>
                            <span>$0.00</span>
                        </div>
                    </div>
                    <button class="confirm-trade-btn ${type}-btn">
                        Confirm ${type.toUpperCase()}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .trade-modal-overlay {
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
        .trade-modal {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            width: 400px;
            max-width: 90vw;
            animation: slideUp 0.3s ease;
        }
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem;
            border-bottom: 1px solid var(--glass-border);
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
            transition: all 0.3s ease;
        }
        .close-btn:hover {
            background: var(--glass-bg);
            color: var(--text-primary);
        }
        .modal-content {
            padding: 1.5rem;
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
        .amount-input, .order-type {
            width: 100%;
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            padding: 0.8rem;
            color: var(--text-primary);
            font-size: 1rem;
        }
        .amount-input:focus, .order-type:focus {
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
            transition: all 0.3s ease;
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
    `;
    document.head.appendChild(style);
    
    // Close modal functionality
    modal.querySelector('.close-btn').addEventListener('click', () => {
        modal.remove();
        style.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });
}

function startVoiceRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            showVoiceIndicator();
        };
        
        recognition.onresult = function(event) {
            const command = event.results[0][0].transcript.toLowerCase();
            processVoiceCommand(command);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            hideVoiceIndicator();
        };
        
        recognition.onend = function() {
            hideVoiceIndicator();
        };
        
        recognition.start();
    } else {
        alert('Speech recognition not supported in this browser');
    }
}

function showVoiceIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'voice-indicator';
    indicator.innerHTML = `
        <div class="voice-modal">
            <div class="voice-animation">
                <div class="voice-circle"></div>
                <div class="voice-wave"></div>
                <div class="voice-wave"></div>
                <div class="voice-wave"></div>
            </div>
            <p>Listening... Say your command</p>
            <button class="cancel-voice">Cancel</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        #voice-indicator {
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
        }
        .voice-modal {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            padding: 3rem;
            text-align: center;
        }
        .voice-animation {
            position: relative;
            width: 100px;
            height: 100px;
            margin: 0 auto 2rem;
        }
        .voice-circle {
            width: 60px;
            height: 60px;
            background: var(--accent-blue);
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: voicePulse 1s ease-in-out infinite;
        }
        .voice-wave {
            position: absolute;
            top: 50%;
            left: 50%;
            border: 2px solid var(--accent-blue);
            border-radius: 50%;
            animation: voiceWave 2s ease-out infinite;
        }
        .voice-wave:nth-child(2) {
            width: 80px;
            height: 80px;
            margin: -40px 0 0 -40px;
            animation-delay: 0.3s;
        }
        .voice-wave:nth-child(3) {
            width: 100px;
            height: 100px;
            margin: -50px 0 0 -50px;
            animation-delay: 0.6s;
        }
        .voice-wave:nth-child(4) {
            width: 120px;
            height: 120px;
            margin: -60px 0 0 -60px;
            animation-delay: 0.9s;
        }
        @keyframes voicePulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes voiceWave {
            0% { opacity: 0.8; transform: scale(0); }
            100% { opacity: 0; transform: scale(1); }
        }
        .cancel-voice {
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            color: var(--text-primary);
            cursor: pointer;
            margin-top: 1rem;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(indicator);
    
    indicator.querySelector('.cancel-voice').addEventListener('click', () => {
        hideVoiceIndicator();
    });
}

function hideVoiceIndicator() {
    const indicator = document.getElementById('voice-indicator');
    if (indicator) {
        indicator.remove();
    }
}

function processVoiceCommand(command) {
    hideVoiceIndicator();
    
    // Simple command processing
    if (command.includes('buy')) {
        showTradeModal('buy');
    } else if (command.includes('sell')) {
        showTradeModal('sell');
    } else if (command.includes('price')) {
        alert('Current CMC 100 Index price is $262.84');
    } else {
        alert(`Command recognized: "${command}". Feature coming soon!`);
    }
}

function initTabSwitching() {
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active from all tabs
            this.parentElement.querySelectorAll('.tab-btn').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

function initTimeframeSwitching() {
    document.querySelectorAll('.timeframe-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            this.parentElement.querySelectorAll('.timeframe-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // Add active to clicked button
            this.classList.add('active');
            
            // Simulate chart update
            const timeframe = this.textContent;
            console.log(`Switching to ${timeframe} timeframe`);
        });
    });
}

function initTableInteractions() {
    // Table row hover effects 
    document.querySelectorAll('.table-row').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        row.addEventListener('click', function() {
            // Simulate opening asset details
            const coinName = this.querySelector('.coin-name').textContent;
            console.log(`Opening details for ${coinName}`);
        });
    });

    // Pagination
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                // Simulate page change
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });
}

function initTooltips() {
    // Simple tooltip system
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

// Animations
function initAnimations() {
    // Fade in cards on load
    gsap.from('.dashboard-card', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Animate numbers on load
    gsap.from('.index-value', {
        duration: 2,
        textContent: 0,
        roundProps: 'textContent',
        ease: 'power2.out',
        onUpdate: function() {
            this.targets()[0].textContent = '$' + Math.floor(this.progress() * 262.84);
        }
    });

    // Animate progress bars
    gsap.from('.bar-fill, .weight-fill, .confidence-fill', {
        duration: 1.5,
        width: 0,
        delay: 0.5,
        ease: 'power2.out'
    });
}

// Responsive handlers
function initResponsiveHandlers() {
    // Mobile sidebar toggle
    const createMobileToggle = () => {
        if (window.innerWidth <= 768) {
            let toggle = document.getElementById('mobile-toggle');
            if (!toggle) {
                toggle = document.createElement('button');
                toggle.id = 'mobile-toggle';
                toggle.innerHTML = '☰';
                toggle.style.cssText = `
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    z-index: 1001;
                    background: var(--glass-bg);
                    border: 1px solid var(--glass-border);
                    border-radius: 8px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-primary);
                    font-size: 1.2rem;
                    cursor: pointer;
                `;
                document.body.appendChild(toggle);
                
                toggle.addEventListener('click', () => {
                    const sidebar = document.querySelector('.sidebar');
                    sidebar.classList.toggle('open');
                });
            }
        } else {
            const toggle = document.getElementById('mobile-toggle');
            if (toggle) {
                toggle.remove();
            }
        }
    };

    createMobileToggle();
    window.addEventListener('resize', createMobileToggle);

    // Handle window resize
    window.addEventListener('resize', () => {
        // Adjust chart sizes
        Chart.helpers.each(Chart.instances, (instance) => {
            instance.resize();
        });
    });
}

// Utility functions
function formatNumber(num, prefix = '', suffix = '') {
    if (num >= 1e12) {
        return prefix + (num / 1e12).toFixed(1) + 'T' + suffix;
    } else if (num >= 1e9) {
        return prefix + (num / 1e9).toFixed(1) + 'B' + suffix;
    } else if (num >= 1e6) {
        return prefix + (num / 1e6).toFixed(1) + 'M' + suffix;
    } else if (num >= 1e3) {
        return prefix + (num / 1e3).toFixed(1) + 'K' + suffix;
    }
    return prefix + num.toFixed(2) + suffix;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: var(--border-radius);
            padding: 1rem 1.5rem;
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        }
        .notification.success {
            border-left: 4px solid var(--success-green);
        }
        .notification.error {
            border-left: 4px solid var(--danger-red);
        }
        .notification.warning {
            border-left: 4px solid var(--warning-orange);
        }
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Export functions for external use
window.ORITDashboard = {
    showTradeModal,
    showNotification,
    updatePrices,
    formatNumber
};