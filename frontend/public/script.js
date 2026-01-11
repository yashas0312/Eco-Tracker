/***********************
  Energy form + network
  Paste this at the end of your script.js
***********************/

// <- Change this to your backend URL if not localhost
const BASE_URL = 'http://localhost:4000';

// helper: show small text messages in the UI (create target elements if not present)
function showMessage(targetId, text, isError = false, timeout = 4000) {
  let el = document.getElementById(targetId);
  if (!el) {
    // create if missing (appends to body) — useful during integration
    el = document.createElement('div');
    el.id = targetId;
    el.style.position = 'fixed';
    el.style.right = '20px';
    el.style.bottom = '20px';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.zIndex = 9999;
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.style.background = isError ? 'rgba(220,50,50,0.95)' : 'rgba(30,130,50,0.95)';
  el.style.color = '#fff';
  el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
  setTimeout(() => { if (el) el.textContent = ''; }, timeout);
}

// POST helper that returns parsed JSON or throws object { status, body }
async function postEntry(urlPath, payload) {
  const res = await fetch(`${BASE_URL}${urlPath}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch (e) { body = { raw: text }; }

  if (!res.ok) throw { status: res.status, body };
  return body;
}

// Preview helper for energy
function previewEnergyCo2(units, gridFactor = 0.9) {
  const co2 = +(Number(units) * Number(gridFactor));
  return Math.round(co2 * 1000) / 1000;
}

// Energy form submit handler
async function handleEnergySubmit(e) {
  e.preventDefault?.();
  try {
    // Adjust these IDs to match your actual HTML inputs
    const energyTypeEl = document.getElementById('energy-type');      // select
    const unitsEl = document.getElementById('energy-units');         // input
    const msgTarget = 'energy-msg';                                  // element id for messages

    const energyType = energyTypeEl ? energyTypeEl.value : 'Electricity';
    const units = unitsEl ? Number(unitsEl.value || 0) : 0;

    if (!energyType || !units || Number.isNaN(units) || units <= 0) {
      return showMessage(msgTarget, 'Please enter valid units (kWh).', true);
    }

    // Preview CO2 to show user
    const gridFactor = 0.9; // default — change per region if needed
    const preview = previewEnergyCo2(units, gridFactor);
    showMessage(msgTarget, `Preview CO₂: ${preview} kg (will be saved)`, false, 2500);

    // Build payload to match backend model
    const payload = {
      energyType,
      unitsConsumed: units,
      gridFactor
    };

    // POST to backend (change path if you mounted at /api/energy)
    const saved = await postEntry('/api/energy', payload);

    // Success: notify and reset form
    showMessage(msgTarget, `Saved — CO₂: ${saved.co2} kg`);
    if (unitsEl && typeof unitsEl.value !== 'undefined') unitsEl.value = '';

    // Optionally refresh history UI if you have a function refreshHistory()
    if (typeof refreshHistory === 'function') refreshHistory();
  } catch (err) {
    console.error('Energy submit error:', err);
    const msg = err?.body?.error || err?.body?.message || JSON.stringify(err?.body) || 'Failed to save energy entry';
    showMessage('energy-msg', `Error: ${msg}`, true, 6000);
  }
}

// hook the handler on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const energyForm = document.getElementById('energy-form'); // your <form id="energy-form">
  const previewBtn = document.getElementById('energy-preview-btn'); // optional preview button
  if (energyForm) energyForm.addEventListener('submit', handleEnergySubmit);
  if (previewBtn) previewBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    const unitsEl = document.getElementById('energy-units');
    const units = unitsEl ? Number(unitsEl.value || 0) : 0;
    if (!units) return showMessage('energy-msg','Enter units to preview', true);
    showMessage('energy-msg', `Preview CO₂: ${previewEnergyCo2(units)} kg`, false, 2500);
  });
});
