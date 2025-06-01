const fetch = require('node-fetch').default;
const fs = require('fs');
const path = require('path');

async function fetchDataAndSave(apiUrl, filename) {
    try {
        console.log(`Fetching data from ${apiUrl}...`);
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const outputFilePath = path.join(__dirname, '..', 'data', filename);
        fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 4));
        console.log(`Data successfully written to ${outputFilePath}`);
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${apiUrl}:`, error);
        return null;
    }
}

// URL for the assistance fund data
const assistanceFundUrl = 'https://assistancefund.top/data';

(async () => {
    // Fetch and save the assistance fund data
    const afData = await fetchDataAndSave(assistanceFundUrl, 'assistance_fund_data.json');
    
    if (afData) {
        console.log('Assistance fund data fetched and saved successfully.');
        
        // Data has been successfully fetched and saved to assistance_fund_data.json
        // No additional processing needed
    } else {
        console.error('Failed to fetch assistance fund data.');
    }
})();
