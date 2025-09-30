const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

/**
 * Serve static HTML file
 */
async function serveHTML(res) {
    try {
        const htmlPath = path.join(process.cwd(), 'rota.html');
        const html = await fs.promises.readFile(htmlPath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
    } catch (error) {
        console.error('Error serving HTML:', error);
        return res.status(500).send('Error loading interface');
    }
}

/**
 * Fetch rota table from a given URL and return as array of objects
 */
async function fetchRota(url) {
    console.log(`🔍 Fetching rota from ${url}...`);
    
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        console.log(`📡 Response Status Code: ${response.status}`);
        
        if (response.status !== 200) {
            console.log(`❌ ERROR: Failed to fetch data from ${url} (status ${response.status})`);
            return [];
        }

        const $ = cheerio.load(response.data);
        const table = $('table').first();
        
        if (table.length === 0) {
            console.log(`⚠️ WARNING: No table found on the page ${url}`);
            return [];
        }

        // Extract table data
        const rows = [];
        const headers = [];
        
        // Get headers
        table.find('thead tr th, tbody tr:first-child th, tr:first-child td').each((i, elem) => {
            headers.push($(elem).text().trim());
        });
        
        // Get data rows
        table.find('tbody tr, tr').each((i, row) => {
            const cells = [];
            $(row).find('td, th').each((j, cell) => {
                cells.push($(cell).text().trim());
            });
            
            if (cells.length > 0 && i > 0) { // Skip header row
                const rowData = {};
                headers.forEach((header, index) => {
                    rowData[header || `Column_${index}`] = cells[index] || '';
                });
                rows.push(rowData);
            }
        });
        
        console.log(`✅ Successfully fetched ${rows.length} rows from ${url}`);
        return rows;
        
    } catch (error) {
        console.error(`❌ ERROR fetching from ${url}:`, error.message);
        return [];
    }
}

/**
 * Fetch, clean, and merge two rotas dynamically
 */
async function mergeRotas() {
    console.log("🚀 Running mergeRotas() function...");
    
    const url1 = "https://vchp.my.salesforce-sites.com/rota?clinicId=7014J000000kfMy";
    const url2 = "https://vchp.my.salesforce-sites.com/rota?clinicId=7014J000000kfNS";
    
    const [rota1, rota2] = await Promise.all([
        fetchRota(url1),
        fetchRota(url2)
    ]);
    
    if (rota1.length === 0 && rota2.length === 0) {
        console.log("❌ ERROR: No data fetched from either rota URL!");
        return [];
    }
    
    // Merge and remove duplicates
    const merged = [...rota1, ...rota2];
    const uniqueRotas = merged.filter((item, index, self) => 
        index === self.findIndex(t => JSON.stringify(t) === JSON.stringify(item))
    );
    
    // Filter out Shift Instructions and add running status
    const rotasWithStatus = uniqueRotas.map(rota => {
        // Create a new object without the Shift Instructions column
        const { ['Shift Instructions']: removed, ...rotaWithoutShiftInstructions } = rota;
        const volunteers = rota['Volunteers Confirmed'] || '';
        const hasOptometrist = /optometrist/i.test(volunteers);
        const hasAssistant = /assistant/i.test(volunteers);
        
        let status;
        if (hasOptometrist && hasAssistant) {
            status = 'Running';
        } else if (hasOptometrist || hasAssistant) {
            status = 'In Progress';
        } else {
            status = 'Recruiting';
        }
        
        return {
            ...rotaWithoutShiftInstructions,
            'Status': status
        };
    });
    
    return rotasWithStatus;
}

const express = require('express');
const app = express();

// Create handler function that works both with Express and Vercel
const handler = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    
    try {
        // Serve HTML interface for root and rota.html
        if (pathname === '/' || pathname === '/rota.html') {
            console.log("🏠 Serving HTML interface");
            return await serveHTML(res);
        }

        // API status endpoint
        if (pathname === '/api') {
            console.log("ℹ️ API status requested");
            return res.status(200).json({
                message: "Rota Merge API is Running!",
                endpoints: {
                    home: "/",
                    mergedRota: "/api/merged-rota",
                    frontend: "/rota.html"
                }
            });
        }
        
        if (pathname === '/api/merged-rota' || pathname === '/merged-rota') {
            console.log("🌐 /merged-rota accessed");
            const mergedData = await mergeRotas();
            
            if (mergedData.length === 0) {
                console.log("❌ ERROR: No rota data available");
                return res.status(500).json({
                    error: "No data available. Check logs."
                });
            }
            
            return res.status(200).json({
                success: true,
                data: mergedData,
                count: mergedData.length
            });
        }
        
        return res.status(404).json({ error: "Endpoint not found" });
        
    } catch (error) {
        console.error("❌ API Error:", error);
        return res.status(500).json({
            error: "Internal server error",
            message: error.message
        });
    }
};

// Use the handler for both Vercel and Express
if (process.env.VERCEL) {
    // Export for Vercel
    module.exports = handler;
} else {
    // Set up Express routes for local development
    app.use(handler);
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
        console.log(`📱 View the rota at http://localhost:${PORT}/rota.html`);
    });
}
