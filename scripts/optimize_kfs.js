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

// Score calculation function (parameterized)
// Score calculation function (parameterized)
function calculateScore(player, weights) {
    const p = player;
    
    // Normalize inputs (handling missing values)
    const wrcPlus = p.wrc_plus || 100;
    const kPct = p.k_pct || 20;
    const bbPct = p.bb_pct || 8;
    const hr = p.hr || 10;
    const pa = p.pa || 300;
    const babip = p.babip || 0.300;
    const obp = p.obp || 0.320;
    const slg = p.slg || 0.400;
    const avg = p.avg || 0.280;
    const woba = p.woba || 0.350;
    const gdp = p.gdp || 10;

    // 1. Discipline
    const kScore = (25 - kPct) * weights.k_factor;
    const bbScore = (bbPct - 5) * weights.bb_factor;
    
    // 2. Power
    const hrRate = (hr / pa) * 600;
    const powerScore = hrRate * weights.hr_factor;
    
    // 3. Contact & Quality
    const avgScore = (avg - 0.280) * weights.avg_factor;
    const babipScore = (babip - 0.300) * weights.babip_factor;

    // 4. Value / Production
    const obpScore = (obp - 0.320) * weights.obp_factor;
    const slgScore = (slg - 0.400) * weights.slg_factor;
    const wobaScore = (woba - 0.350) * weights.woba_factor;
    const wrcScore = (wrcPlus - 100) * weights.wrc_factor;
    
    // 5. Negative factors (GDP)
    const gdpScore = (gdp - 10) * weights.gdp_factor;

    // Total
    const total = kScore + bbScore + powerScore + avgScore + babipScore + obpScore + slgScore + wobaScore + wrcScore + gdpScore;
    
    return total;
}

// Initial weights based on correlation magnitudes (x100)
// k_pct: -0.0527 -> 5.27
// bb_pct: 0.0064 -> 0.64
// hr: 0.2164 -> 21.64
// avg: -0.1738 -> 17.38
// babip: -0.2244 -> 22.44
// obp: -0.2176 -> 21.76
// slg: -0.0718 -> 7.18
// woba: -0.1554 -> 15.54
// wrc_plus: -0.1168 -> 11.68
// gdp: 0.1980 -> 19.80
const initialWeights = {
    k_factor: 5.27,
    bb_factor: 0.64,
    hr_factor: 21.64,
    avg_factor: 17.38,
    babip_factor: 22.44,
    obp_factor: 21.76,
    slg_factor: 7.18,
    woba_factor: 15.54,
    wrc_factor: 11.68,
    gdp_factor: 19.80
};

// Optimization loop (Random Search)
let bestWeights = { ...initialWeights };
let bestCorrelation = -1;

// Evaluate initial
const initialScores = mergedData.map(d => calculateScore(d.pre, initialWeights));
const kboWrcs = mergedData.map(d => d.kbo.wrc_plus);
const initialCorr = calculateCorrelation(initialScores, kboWrcs);
console.log(`Initial Correlation: ${initialCorr.toFixed(4)}`);
bestCorrelation = initialCorr;

const ITERATIONS = 10000;

for (let i = 0; i < ITERATIONS; i++) {
    // Mutate weights slightly
    const currentWeights = { ...bestWeights };
    const keys = Object.keys(currentWeights);
    const keyToMutate = keys[Math.floor(Math.random() * keys.length)];
    
    // Mutation: +/- 10%
    const mutation = 1 + (Math.random() * 0.2 - 0.1);
    currentWeights[keyToMutate] *= mutation;

    // Calculate correlation
    const scores = mergedData.map(d => calculateScore(d.pre, currentWeights));
    const corr = calculateCorrelation(scores, kboWrcs);

    if (corr > bestCorrelation) {
        bestCorrelation = corr;
        bestWeights = currentWeights;
        // console.log(`New best correlation: ${bestCorrelation.toFixed(4)}`);
    }
}

console.log('Optimization complete.');
console.log(`Best Correlation: ${bestCorrelation.toFixed(4)}`);
console.log('Best Weights:', JSON.stringify(bestWeights, null, 2));

fs.writeFileSync(path.join(__dirname, 'optimization_results.json'), JSON.stringify({
    bestCorrelation,
    bestWeights
}, null, 2));

// Calculate relative importance for Analysis Data
// We can estimate the max possible points for each category with best weights
// Discipline: cap
// Quality: cap
// OnBase: cap
// BABIP: ~10 * weight
// Experience: ~15 * weight
// wRC: ~15 * weight (if wrc_factor changes, max score changes)

console.log("\n--- Suggested Breakdown for Analysis ---");
console.log("Optimization complete. Caps removed.");
