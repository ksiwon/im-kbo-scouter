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

    // 1. Discipline Score (Only K% and BB%)
    const kScore = Math.max(0, (25 - kPct) * weights.k_factor);
    const bbScore = Math.max(0, (bbPct - 5) * weights.bb_factor);
    const disciplineScore = Math.min(weights.discipline_cap, kScore + bbScore);

    // 2. Power (Only HR/PA)
    // HR per 600 PA roughly
    const hrRate = (hr / pa) * 600;
    const powerScore = Math.min(weights.power_cap, hrRate * weights.hr_factor);
    
    // 3. OnBase & Slg
    const obpScore = Math.max(0, (obp - 0.300) * weights.obp_factor);
    const slgScore = Math.max(0, (slg - 0.350) * weights.slg_factor);
    const onBaseScore = Math.min(weights.onbase_cap, obpScore + slgScore);

    // 4. BABIP
    let babipScore = 10;
    if (babip > 0.380) babipScore = Math.max(0, 10 - (babip - 0.380) * 30);
    else if (babip < 0.280) babipScore = Math.max(0, (babip - 0.250) * 30);
    babipScore = babipScore * weights.babip_weight;


    // 5. Pre-KBO wRC+
    const wrcScore = Math.max(0, Math.min(15, (wrcPlus - 80) * weights.wrc_factor));

    // 6. GDP (Unexpected Factor)
    // GDP correlates positively (0.19). Let's normalize it.
    // Avg GDP is probably around 10?
    const gdp = p.gdp || 0;
    const gdpScore = Math.min(weights.gdp_cap, gdp * weights.gdp_factor);

    // Total
    const total = disciplineScore + powerScore + onBaseScore + babipScore + wrcScore + gdpScore;
    return Math.max(0, Math.min(100, total));
}

// Initial weights
const initialWeights = {
    k_factor: 1.2,
    bb_factor: 1.0,
    discipline_cap: 35,
    
    hr_factor: 0.5,
    power_cap: 20,

    obp_factor: 50,
    slg_factor: 30,
    onbase_cap: 20,

    babip_weight: 1.0,
    wrc_factor: 0.25,
    
    gdp_factor: 0.5,
    gdp_cap: 10
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
console.log(`Discipline Cap: ${bestWeights.discipline_cap.toFixed(1)}`);
console.log(`Power Cap: ${bestWeights.power_cap.toFixed(1)}`);
console.log(`OnBase Cap: ${bestWeights.onbase_cap.toFixed(1)}`);
