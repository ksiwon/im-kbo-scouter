// src/utils/kfsScore.ts

export interface KFSInputs {
  wrcPlus: number;
  kPct: number;
  bbPct: number;
  hr: number;
  pa: number;
  babip: number;
  obp: number;
  slg: number;
  gdp: number;
}

export interface KFSResult {
  score: number;
  predictedWrcPlus: number;
  successProbability: number;
  breakdown: {
    discipline: number;
    power: number;
    onBase: number;
    babip: number;
    experience: number; // Used for GDP
    wrc: number;
  };
}

export const calculateKFSScore = (inputs: KFSInputs): KFSResult => {
  const {
    wrcPlus = 100,
    kPct = 20,
    bbPct = 8,
    hr = 10,
    pa = 300,
    babip = 0.300,
    obp = 0.320,
    slg = 0.400,
    gdp = 10
  } = inputs;

  // Optimized Weights (Correlation: 0.44)
  const weights = {
    k_factor: 0.63,
    bb_factor: 0.00,
    discipline_cap: 36.6,
    
    hr_factor: 1.17,
    power_cap: 48.2,

    obp_factor: 17.5,
    slg_factor: 457.2,
    onbase_cap: 1.0,

    babip_weight: 2.46,
    wrc_factor: 2.36,
    
    gdp_factor: 3.10,
    gdp_cap: 34.2
  };

  const kScore = Math.max(0, (25 - kPct) * weights.k_factor);
  const bbScore = Math.max(0, (bbPct - 5) * weights.bb_factor);
  const disciplineScore = Math.min(weights.discipline_cap, kScore + bbScore);
  
  // HR per 600 PA roughly
  const hrRate = (hr / pa) * 600;
  const powerScore = Math.min(weights.power_cap, hrRate * weights.hr_factor);
  
  const obpScore = Math.max(0, (obp - 0.300) * weights.obp_factor);
  const slgScore = Math.max(0, (slg - 0.350) * weights.slg_factor);
  const onBaseScore = Math.min(weights.onbase_cap, obpScore + slgScore);
  
  let babipScore = 10;
  if (babip > 0.380) babipScore = Math.max(0, 10 - (babip - 0.380) * 30);
  else if (babip < 0.280) babipScore = Math.max(0, (babip - 0.250) * 30);
  babipScore = babipScore * weights.babip_weight;
    
  const wrcScore = Math.max(0, Math.min(15, (wrcPlus - 80) * weights.wrc_factor));
  
  const gdpScore = Math.min(weights.gdp_cap, gdp * weights.gdp_factor);
  
  const rawTotalScore = disciplineScore + powerScore + onBaseScore + 
    babipScore + wrcScore + gdpScore;

  // Theoretical Max Score is approx 159.6
  // Normalize to 0-100 scale
  const totalScore = Math.max(0, Math.min(100, (rawTotalScore / 159.6) * 100));
  
  // Updated prediction formula based on new weights
  const predictedWrcPlus = Math.round(
    wrcPlus * 0.4 + 100 * 0.6 + (totalScore - 50) * 0.6
  );
  
  const successProbability = Math.min(95, Math.max(5, 
    totalScore * 0.95
  ));

  return {
    score: Math.round(totalScore),
    predictedWrcPlus,
    successProbability: Math.round(successProbability),
    breakdown: {
      discipline: Math.round(disciplineScore),
      power: Math.round(powerScore),
      onBase: Math.round(onBaseScore),
      babip: Math.round(babipScore),
      experience: Math.round(gdpScore), // Using Experience slot for GDP
      wrc: Math.round(wrcScore),
    }
  };
};
