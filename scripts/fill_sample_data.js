const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/sampleData.json');
const raw = fs.readFileSync(filePath, 'utf8');
const data = JSON.parse(raw);

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function computeHealthScore(t) {
  let score = 100;
  const temp = typeof t.temperature === 'number' ? t.temperature : (t.optimalTemp || 27);
  const pH = typeof t.pH === 'number' ? t.pH : (t.optimalPH || 7);
  const oxygen = typeof t.oxygen === 'number' ? t.oxygen : 6;
  const ammonia = typeof t.ammonia === 'number' ? t.ammonia : 0.02;
  const nitrate = typeof t.nitrate === 'number' ? t.nitrate : 10;

  // temp penalty (optimal window ~26-30)
  if (temp < 26) score -= Math.min(20, Math.round((26 - temp) * 5));
  if (temp > 30) score -= Math.min(20, Math.round((temp - 30) * 5));

  // pH penalty (optimal ~6.8 - 7.8)
  if (pH < 6.8) score -= Math.min(15, Math.round((6.8 - pH) * 20));
  if (pH > 7.8) score -= Math.min(15, Math.round((pH - 7.8) * 20));

  // oxygen
  const minOxy = typeof t.minOxygen === 'number' ? t.minOxygen : 5;
  if (oxygen < minOxy) score -= 25;
  else if (oxygen < minOxy + 1) score -= 10;

  // ammonia
  const maxA = typeof t.maxAmmonia === 'number' ? t.maxAmmonia : 0.05;
  if (ammonia > maxA) {
    const over = ammonia / maxA;
    score -= Math.min(40, Math.round(20 * over));
  }

  if (nitrate > 30) score -= 5;

  score = Math.max(0, Math.min(100, Math.round(score)));
  return score;
}

let changed = false;
for (const t of data.tanks) {
  // feedAmount = fishCount * avgWeight * 0.002 (rounded)
  if (typeof t.feedAmount !== 'number' || t.feedAmount <= 0) {
    const fc = typeof t.fishCount === 'number' ? t.fishCount : 100;
    const aw = typeof t.avgWeight === 'number' ? t.avgWeight : 50;
    t.feedAmount = Math.round(fc * aw * 0.002);
    changed = true;
  }

  // growthRate = clamp(avgWeight/100 * 1.2, 0.5, 2.5) rounded to 1 decimal
  if (typeof t.growthRate !== 'number' || Number.isNaN(t.growthRate)) {
    const aw = typeof t.avgWeight === 'number' ? t.avgWeight : 50;
    const raw = aw / 100 * 1.2;
    t.growthRate = Math.round(clamp(raw, 0.5, 2.5) * 10) / 10;
    changed = true;
  }

  // healthStatus from healthScore mapping
  const score = computeHealthScore(t);
  let status = 'Moderate';
  if (score >= 80) status = 'Healthy';
  else if (score >= 60) status = 'Moderate';
  else status = 'Poor';

  if (t.healthStatus !== status) {
    t.healthStatus = status;
    changed = true;
  }
}

if (changed) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('sampleData.json updated with computed feedAmount/growthRate/healthStatus');
} else {
  console.log('No changes needed');
}
