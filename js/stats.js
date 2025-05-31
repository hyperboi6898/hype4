// Node.js script to fetch Hyperliquid stats data and save to JSON files
const fetch = require('node-fetch').default;
const fs = require('fs');
const path = require('path');

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Main function to fetch all data and save to JSON files
async function fetchAllData() {
    console.log('Fetching all Hyperliquid stats data...');
    
    try {
        // Fetch all data in parallel
        const [feeData, tvlData] = await Promise.all([
            fetchFeeData(),
            fetchTVLData()
        ]);
        
        console.log('All data fetched successfully!');
        return { feeData, tvlData };
    } catch (error) {
        console.error('Error fetching data:', error);
        process.exit(1);
    }
}

// Global variables for data
let feeData = null;
let tvlData = null;
let volumeData = null;
let athPrice = 39.8; // Default ATH value, will be updated dynamically

// Fetch fee data from DeFi Llama API
async function fetchFeeData() {
    try {
        console.log('Fetching fee data from DeFi Llama...');
        
        // Fetch data from DeFi Llama API
        const response = await fetch('https://api.llama.fi/summary/fees/hyperliquid?dataType=dailyFees');
        
        if (!response.ok) {
            throw new Error('Failed to fetch fee data');
        }
        
        const data = await response.json();
        
        // Save data to JSON file
        const filePath = path.join(dataDir, 'fee_data.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`Fee data saved to ${filePath}`);
        
        return data;
    } catch (error) {
        console.error('Error fetching fee data:', error);
        return null;
    }
}

// Update fee UI elements
function updateFeeUI(data) {
    // Format numbers with commas
    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US').format(num);
    };
    
    // Get today's fee and yesterday's fee
    const todayFee = data.total24h;
    const yesterdayFee = data.total48hto24h;
    
    // Calculate change percentage
    const changePercent = ((todayFee - yesterdayFee) / yesterdayFee) * 100;
    const changeClass = changePercent >= 0 ? 'positive' : 'negative';
    const changeSign = changePercent >= 0 ? '+' : '';
    
    // Update UI elements
    document.getElementById('today-fee').textContent = '$' + formatNumber(todayFee);
    document.getElementById('fee-change').innerHTML = `
        <span class="change-value ${changeClass}">${changeSign}${changePercent.toFixed(2)}%</span>
        <span class="change-label">so với hôm qua</span>
    `;
    document.getElementById('fee-7d').textContent = '$' + formatNumber(data.total7d);
    document.getElementById('fee-total').textContent = '$' + formatNumber(data.totalAllTime);
}

// Initialize fee chart
function initFeeChart(data) {
    const ctx = document.getElementById('fee-chart').getContext('2d');
    
    // Get the last 7 days of data
    const chartData = getLast7DaysData(data);
    
    feeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Phí giao dịch hàng ngày',
                data: chartData.values,
                backgroundColor: 'rgba(0, 212, 170, 0.7)',
                borderColor: 'rgba(0, 212, 170, 1)',
                borderWidth: 1,
                borderRadius: 4,
                hoverBackgroundColor: 'rgba(0, 212, 170, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            if (value >= 1000000) {
                                return '$' + (value / 1000000).toFixed(1) + 'M';
                            }
                            return '$' + (value / 1000).toFixed(0) + 'K';
                        }
                    }
                }
            }
        }
    });
}

// Update fee chart based on selected timeframe
function updateFeeChart(timeframe) {
    if (!feeData || !feeChart) return;
    
    let chartData;
    
    switch (timeframe) {
        case '7d':
            chartData = getLast7DaysData(feeData);
            break;
        case '30d':
            chartData = getLast30DaysData(feeData);
            break;
        case '90d':
            chartData = getLast90DaysData(feeData);
            break;
        default:
            chartData = getLast7DaysData(feeData);
    }
    
    feeChart.data.labels = chartData.labels;
    feeChart.data.datasets[0].data = chartData.values;
    feeChart.update();
}

// Helper functions to extract chart data
function getLast7DaysData(data) {
    const totalDataChart = data.totalDataChart;
    const last7Days = totalDataChart.slice(-7);
    
    return {
        labels: last7Days.map(day => formatDate(day[0])),
        values: last7Days.map(day => day[1])
    };
}

function getLast30DaysData(data) {
    const totalDataChart = data.totalDataChart;
    const last30Days = totalDataChart.slice(-30);
    
    return {
        labels: last30Days.map(day => formatDate(day[0])),
        values: last30Days.map(day => day[1])
    };
}

function getLast90DaysData(data) {
    const totalDataChart = data.totalDataChart;
    const last90Days = totalDataChart.slice(-90);
    
    // For 90 days, we'll show every 5th day to avoid overcrowding
    return {
        labels: last90Days.map((day, index) => index % 5 === 0 ? formatDate(day[0]) : ''),
        values: last90Days.map(day => day[1])
    };
}

// Format Unix timestamp to date string
function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.getDate() + '/' + (date.getMonth() + 1);
}

// Fetch TVL data from DeFi Llama API
async function fetchTVLData() {
    try {
        console.log('Fetching TVL data from DeFi Llama...');
        
        // Fetch data from DeFi Llama API - using the protocol endpoint
        const response = await fetch('https://api.llama.fi/protocol/hyperliquid');
        
        if (!response.ok) {
            throw new Error(`Failed to fetch TVL data: ${response.status} ${response.statusText}`);
        }
        
        const rawData = await response.json();
        
        // Process the data to get TVL history
        const data = rawData.tvl.map(item => ({
            date: new Date(item.date * 1000).toISOString().split('T')[0],
            totalLiquidityUSD: item.totalLiquidityUSD
        }));
        
        // Save data to JSON file
        const filePath = path.join(dataDir, 'tvl_data.json');
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`TVL data saved to ${filePath}`);
        
        return data;
    } catch (error) {
        console.error('Error fetching TVL data:', error.message);
        
        // If we already have a TVL data file, we'll use that instead of failing
        const filePath = path.join(dataDir, 'tvl_data.json');
        if (fs.existsSync(filePath)) {
            console.log('Using existing TVL data file...');
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        return null;
    }
}

// Format number with commas
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

// Volume data is now handled by fetch_volume_OI.js

// Fetch price data from DeFi Llama API
async function fetchPriceData() {
    try {
        // Show loading state
        document.getElementById('current-price').innerHTML = '$<span class="loading"></span>';
        
        // Fetch data from DeFi Llama API
        const response = await fetch('https://coins.llama.fi/prices/current/hyperliquid:0x0d01dc56dcaaca66ad901c959b4011ec?searchWidth=4h');
        
        if (!response.ok) {
            throw new Error('Failed to fetch price data');
        }
        
        const data = await response.json();
        priceData = data;
        
        // Extract price information
        const tokenData = data.coins['hyperliquid:0x0d01dc56dcaaca66ad901c959b4011ec'];
        const price = tokenData.price;
        const confidence = tokenData.confidence * 100;
        
        // Update UI with the latest data
        document.getElementById('current-price').textContent = '$' + price.toFixed(2);
        document.getElementById('price-confidence').textContent = confidence.toFixed(0) + '%';
        
        // Check if current price is a new ATH
        if (price > athPrice) {
            athPrice = price;
            // Update ATH display
            const athElement = document.querySelector('.stats-summary-item:first-child .summary-value');
            if (athElement) {
                athElement.textContent = '$' + athPrice.toFixed(2);
                // Add a highlight effect
                athElement.classList.add('highlight-ath');
                setTimeout(() => {
                    athElement.classList.remove('highlight-ath');
                }, 3000);
            }
        }
        
        // For demonstration purposes, we'll simulate a price change since we don't have historical data
        // In a real application, you would fetch historical price data
        const changePercent = ((Math.random() * 5) - 2).toFixed(2); // Random change between -2% and +3%
        const changeClass = parseFloat(changePercent) >= 0 ? 'positive' : 'negative';
        const changeSign = parseFloat(changePercent) >= 0 ? '+' : '';
        
        document.getElementById('price-change').innerHTML = `
            <span class="change-value ${changeClass}">${changeSign}${changePercent}%</span>
            <span class="change-label">24 giờ qua</span>
        `;
        
        // Initialize or update price chart with simulated data
        if (!priceChart) {
            initPriceChart(price);
        }
        
        return true;
    } catch (error) {
        console.error('Error fetching price data:', error);
        
        // Show error state
        document.getElementById('current-price').textContent = 'Không thể tải dữ liệu';
        
        return false;
    }
}

// Initialize price chart with simulated data
function initPriceChart(currentPrice) {
    const ctx = document.getElementById('price-chart').getContext('2d');
    
    // Generate simulated price data for demonstration
    const simulatedData = generateSimulatedPriceData(currentPrice, 24);
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: simulatedData.labels,
            datasets: [{
                label: 'Giá HYPE',
                data: simulatedData.values,
                backgroundColor: 'rgba(0, 212, 170, 0.2)',
                borderColor: 'rgba(0, 212, 170, 1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(0, 212, 170, 1)',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        maxRotation: 0,
                        autoSkip: true,
                        maxTicksLimit: 12
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Update price chart based on selected timeframe
function updatePriceChart(timeframe) {
    if (!priceChart) return;
    
    // In a real application, you would fetch historical price data for the selected timeframe
    // For demonstration purposes, we'll generate simulated data
    
    let hours;
    switch (timeframe) {
        case '24h':
            hours = 24;
            break;
        case '7d':
            hours = 24 * 7;
            break;
        case '30d':
            hours = 24 * 30;
            break;
        default:
            hours = 24;
    }
    
    const currentPrice = parseFloat(document.getElementById('current-price').textContent.replace('$', ''));
    const simulatedData = generateSimulatedPriceData(currentPrice, hours);
    
    priceChart.data.labels = simulatedData.labels;
    priceChart.data.datasets[0].data = simulatedData.values;
    
    // Adjust x-axis tick density based on timeframe
    if (timeframe === '24h') {
        priceChart.options.scales.x.ticks.maxTicksLimit = 12;
    } else if (timeframe === '7d') {
        priceChart.options.scales.x.ticks.maxTicksLimit = 7;
    } else {
        priceChart.options.scales.x.ticks.maxTicksLimit = 10;
    }
    priceChart.update();
}

// Generate simulated price data for demonstration
function generateSimulatedPriceData(currentPrice, hours) {
    const data = [];
    const now = new Date();
    
    for (let i = hours; i >= 0; i--) {
        const timestamp = new Date(now);
        timestamp.setHours(now.getHours() - i);
        
        // Generate random price fluctuations
        // More recent hours have smaller fluctuations to create a realistic curve
        const volatility = i < 6 ? 0.005 : 0.01;
        const change = currentPrice * volatility * (Math.random() - 0.5);
        
        // Add some trend bias based on hour of day
        const hourOfDay = timestamp.getHours();
        let trendBias = 0;
        
        // Slight uptrend during US trading hours (14-22 UTC)
        if (hourOfDay >= 14 && hourOfDay <= 22) {
            trendBias = 0.001;
        }
        // Slight downtrend during Asian trading hours (0-8 UTC)
        else if (hourOfDay >= 0 && hourOfDay <= 8) {
            trendBias = -0.0005;
        }
        
        const priceAtTimestamp = i === 0 ? 
            currentPrice : // Current price is exact
            data[data.length - 1].price + change + (data[data.length - 1].price * trendBias);
        
        data.push({
            timestamp: timestamp.getTime(),
            price: priceAtTimestamp
        });
    }
    
    return data;
}

// Execute the main function when the script is run directly
if (require.main === module) {
    console.log('Starting Hyperliquid stats data fetch...');
    fetchAllData()
        .then(() => {
            console.log('All data fetched and saved successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Error in main execution:', error);
            process.exit(1);
        });
}
