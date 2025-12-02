
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
  avg: number;
  woba: number;
}

export interface KFSResult {
  score: number;
  predictedWrcPlus: number;
  successProbability: number;
  breakdown: {
    discipline: number;
    power: number;
    contact: number; // Avg, BABIP
    value: number;   // OBP, SLG, wOBA, wRC+
    experience: number; // GDP
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
    gdp = 10,
    avg = 0.280,
    woba = 0.350
  } = inputs;

  // Weights based on Correlation Ratios (x100 for rate stats scaling)
  // "Use the ratio that came out"
  const weights = {
    k_factor: 0.05,
    bb_factor: 0.01,
    hr_factor: 0.22,
    avg_factor: 0.17,
    babip_factor: 0.22,
    obp_factor: 0.22,
    slg_factor: 0.07,
    woba_factor: 0.16,
    wrc_factor: 0.12,
    gdp_factor: 0.20
  };

  // 1. Discipline
  const kScore = (25 - kPct) * weights.k_factor;
  const bbScore = (bbPct - 5) * weights.bb_factor;
  const disciplineScore = kScore + bbScore;
  
  // 2. Power
  const hrRate = (hr / pa) * 600;
  const powerScore = hrRate * weights.hr_factor;
  
  // 3. Contact & Quality
  // Scale by 1000 to match units
  const avgScore = (avg - 0.280) * 1000 * weights.avg_factor;
  const babipScore = (babip - 0.300) * 1000 * weights.babip_factor;
  const contactScore = avgScore + babipScore;

  // 4. Value / Production
  const obpScore = (obp - 0.320) * 1000 * weights.obp_factor;
  const slgScore = (slg - 0.400) * 1000 * weights.slg_factor;
  const wobaScore = (woba - 0.350) * 1000 * weights.woba_factor;
  const wrcScore = (wrcPlus - 100) * weights.wrc_factor;
  const valueScore = obpScore + slgScore + wobaScore + wrcScore;
  
  // 5. Experience (GDP)
  const gdpScore = (gdp - 10) * weights.gdp_factor;
  
  const rawTotalScore = disciplineScore + powerScore + contactScore + valueScore + gdpScore;

  // Normalize to 0-100?
  // Max score estimation:
  // HR=40 -> 40*0.22 = 8.8
  // Avg=0.350 -> 70*0.17 = 11.9
  // BABIP=0.350 -> 50*0.22 = 11.0
  // OBP=0.400 -> 80*0.22 = 17.6
  // SLG=0.600 -> 200*0.07 = 14.0
  // wOBA=0.450 -> 100*0.16 = 16.0
  // wRC=150 -> 50*0.12 = 6.0
  // GDP=20 -> 10*0.20 = 2.0
  // Total ~ 80-90.
  // So raw score is already close to 0-100 scale!
  // I will just clamp it.
  
  const totalScore = Math.max(0, Math.min(100, rawTotalScore));
  
  // Updated prediction formula based on new weights
  const predictedWrcPlus = Math.round(
    wrcPlus * 0.4 + 100 * 0.6 + (totalScore - 50) * 0.6
  );
  
  const successProbability = Math.min(95, Math.max(5, 
    totalScore * 0.95
  ));

  return {
    score: Math.round(totalScore * 10) / 10,
    predictedWrcPlus,
    successProbability: Math.round(successProbability * 10) / 10,
    breakdown: {
      discipline: Math.round(disciplineScore * 10) / 10,
      power: Math.round(powerScore * 10) / 10,
      contact: Math.round(contactScore * 10) / 10,
      value: Math.round(valueScore * 10) / 10,
      experience: Math.round(gdpScore * 10) / 10,
    }
  };
};
