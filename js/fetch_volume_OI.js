const fetch = require('node-fetch').default;

const fs = require('fs');
const path = require('path');

async function fetchDataAndSave(apiUrl, filename) {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const outputFilePath = path.join(__dirname, '..', 'data', filename);
        fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 4));
        console.log(`Data successfully written to ${outputFilePath}`);
    } catch (error) {
        console.error(`Error fetching data from ${apiUrl}:`, error);
    }
}

// Calculate date 6 months ago
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
const startDate = sixMonthsAgo.toISOString();

const volumeUrl = `https://hypeflows.com/api/perp-data?markets=hyperliquid,binance,bybit,okx&metric=volume&startDate=${startDate}`;
const openInterestUrl = `https://hypeflows.com/api/perp-data?markets=hyperliquid,binance,bybit,okx&metric=open_interest&startDate=${startDate}`;

(async () => {
    await fetchDataAndSave(volumeUrl, 'volume_data.json');
    await fetchDataAndSave(openInterestUrl, 'open_interest_data.json');
})();
