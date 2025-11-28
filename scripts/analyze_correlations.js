const fs = require('fs');
const path = require('path');

// Load data
const preKboPath = path.join(__dirname, '../src/data/pre_kbo_stats_matched.json');
const kboPath = path.join(__dirname, '../src/data/kbo_first_year_stats_matched.json');

const preKboData = JSON.parse(fs.readFileSync(preKboPath, 'utf8')).players;
const kboData = JSON.parse(fs.readFileSync(kboPath, 'utf8')).players;

// Merge data
const mergedData = [];
preKboData.forEach(pre => {
    const kbo = kboData.find(k => k.name === pre.name && k.kbo_entry_year === pre.kbo_entry_year);
    if (kbo) {
        mergedData.push({ pre, kbo });
    }
});

console.log(`Loaded ${mergedData.length} matched player records.`);

// Helper to calculate correlation
function calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
}

// Get all numeric keys from pre-kbo data
const sample = mergedData[0].pre;
const numericKeys = Object.keys(sample).filter(key => typeof sample[key] === 'number');

const kboWrcs = mergedData.map(d => d.kbo.wrc_plus);

console.log("\n--- Correlation Analysis (Pre-KBO Stat vs KBO wRC+) ---");
const correlations = numericKeys.map(key => {
    const values = mergedData.map(d => d.pre[key] || 0);
    const corr = calculateCorrelation(values, kboWrcs);
    return { key, corr };
});

// Sort by absolute correlation
correlations.sort((a, b) => Math.abs(b.corr) - Math.abs(a.corr));

const output = correlations.map(c => `${c.key.padEnd(20)}: ${c.corr.toFixed(4)}`).join('\n');
fs.writeFileSync(path.join(__dirname, 'correlation_results.txt'), output);
console.log("Results saved to correlation_results.txt");
