const TEMPLATE =
  'IND WAS | 90-90 | Q4 9:32 | FGA 68-79 | FTA 25-16 | TOV 16-7 | ODDS +105 -125';

const inputEl = document.getElementById('terminalInput');
const parseBtn = document.getElementById('parseBtn');
const resetBtn = document.getElementById('resetBtn');
const templateBtn = document.getElementById('templateBtn');
const errorEl = document.getElementById('error');
const parsedSummaryEl = document.getElementById('parsedSummary');
const metricsEl = document.getElementById('metrics');
const verdictEl = document.getElementById('verdict');
const explanationEl = document.getElementById('explanation');

function resetOutput() {
  errorEl.textContent = '';
  parsedSummaryEl.textContent = 'No parsed data yet.';
  metricsEl.textContent = 'Parse input to see results.';
  verdictEl.textContent = 'PASS';
  verdictEl.className = 'verdict verdict-neutral';
  explanationEl.textContent = 'Waiting for valid input.';
}

function formatFloat(n, digits = 2) {
  return Number.isFinite(n) ? n.toFixed(digits) : 'N/A';
}

function parseTerminal(text) {
  const pattern = /^\s*([A-Z0-9_]+)\s+([A-Z0-9_]+)\s*\|\s*(\d+)-(\d+)\s*\|\s*(Q\d+|OT)\s+(\d{1,2}:\d{2})\s*\|\s*FGA\s+(\d+)-(\d+)\s*\|\s*FTA\s+(\d+)-(\d+)\s*\|\s*TOV\s+(\d+)-(\d+)\s*\|\s*ODDS\s*([+-]\d+)\s+([+-]\d+)\s*$/i;
  const m = text.match(pattern);

  if (!m) {
    throw new Error(
      'Invalid format. Use: TEAM_A TEAM_B | SCORE_A-SCORE_B | Q{quarter} M:SS | FGA x-y | FTA x-y | TOV x-y | ODDS +a -b'
    );
  }

  const quarterToken = m[5].toUpperCase();
  const quarter = quarterToken === 'OT' ? 'OT' : parseInt(quarterToken.slice(1), 10);

  return {
    team_a: m[1].toUpperCase(),
    team_b: m[2].toUpperCase(),
    score_a: parseInt(m[3], 10),
    score_b: parseInt(m[4], 10),
    quarter,
    clock: m[6],
    fga_a: parseInt(m[7], 10),
    fga_b: parseInt(m[8], 10),
    fta_a: parseInt(m[9], 10),
    fta_b: parseInt(m[10], 10),
    tov_a: parseInt(m[11], 10),
    tov_b: parseInt(m[12], 10),
    odds_a: parseInt(m[13], 10),
    odds_b: parseInt(m[14], 10),
  };
}

function americanToImpliedProb(odds) {
  if (odds > 0) return 100 / (odds + 100);
  return -odds / (-odds + 100);
}

function compute(parsed) {
  const poss_a = parsed.fga_a + 0.44 * parsed.fta_a + parsed.tov_a;
  const poss_b = parsed.fga_b + 0.44 * parsed.fta_b + parsed.tov_b;

  const ppp_a = parsed.score_a / poss_a;
  const ppp_b = parsed.score_b / poss_b;

  const edge_team = ppp_a >= ppp_b ? parsed.team_a : parsed.team_b;
  const edge_pct = Math.abs(ppp_a - ppp_b) / Math.min(ppp_a, ppp_b);

  const avg_poss = (poss_a + poss_b) / 2;
  const pace_ok = avg_poss >= 30;

  const verdict = edge_pct >= 0.02 && pace_ok ? 'PLAY' : 'PASS';

  const implied_a = americanToImpliedProb(parsed.odds_a);
  const implied_b = americanToImpliedProb(parsed.odds_b);

  return {
    poss_a,
    poss_b,
    ppp_a,
    ppp_b,
    edge_team,
    edge_pct,
    avg_poss,
    pace_ok,
    verdict,
    implied_a,
    implied_b,
  };
}

function render(parsed, calc) {
  parsedSummaryEl.textContent = JSON.stringify(parsed, null, 2);

  const metrics = [
    ['poss_a', formatFloat(calc.poss_a)],
    ['poss_b', formatFloat(calc.poss_b)],
    ['avg_poss', formatFloat(calc.avg_poss)],
    ['ppp_a', formatFloat(calc.ppp_a, 3)],
    ['ppp_b', formatFloat(calc.ppp_b, 3)],
    ['edge_team', calc.edge_team],
    ['edge_pct', `${(calc.edge_pct * 100).toFixed(2)}%`],
    ['pace_ok', String(calc.pace_ok)],
    ['implied_prob_a', `${(calc.implied_a * 100).toFixed(2)}%`],
    ['implied_prob_b', `${(calc.implied_b * 100).toFixed(2)}%`],
  ];

  metricsEl.innerHTML = metrics
    .map(([k, v]) => `<div class="metric-item"><strong>${k}</strong><br/>${v}</div>`)
    .join('');

  verdictEl.textContent = calc.verdict;
  verdictEl.className =
    calc.verdict === 'PLAY' ? 'verdict verdict-play' : 'verdict verdict-pass';

  explanationEl.textContent = `Edge ${(calc.edge_pct * 100).toFixed(2)}% (${calc.edge_pct >= 0.02 ? '>=' : '<'}2.00%) and Avg Poss ${formatFloat(calc.avg_poss)} (${calc.pace_ok ? '>=' : '<'}30) => ${calc.verdict}`;
}

parseBtn.addEventListener('click', () => {
  errorEl.textContent = '';
  try {
    const parsed = parseTerminal(inputEl.value.trim());
    const calc = compute(parsed);
    render(parsed, calc);
  } catch (err) {
    resetOutput();
    errorEl.textContent = err.message || 'Parse failed.';
  }
});

resetBtn.addEventListener('click', () => {
  inputEl.value = '';
  resetOutput();
});

templateBtn.addEventListener('click', () => {
  inputEl.value = TEMPLATE;
});

resetOutput();
