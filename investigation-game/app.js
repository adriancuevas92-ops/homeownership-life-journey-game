import { LOCATIONS, TIER1_IDS, unlockedTiers, isLocked } from './locations.js';

const STORAGE_KEY = 'quiet-losses-investigation-v1';
const board = document.getElementById('board');

function loadVisited() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
}

function saveVisited(visited) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
  } catch (e) {
    // localStorage unavailable — progress just won't persist across reloads.
  }
}

let visited = loadVisited();

function tierLabel(tier) {
  if (tier === 1) return 'Pérdidas silenciosas';
  if (tier === 2) return 'La herramienta';
  return 'Casos en vivo';
}

function renderProgress() {
  const total = LOCATIONS.length;
  const count = LOCATIONS.filter(l => visited.has(l.id)).length;
  return `<div class="progress">EXPEDIENTE: ${count} / ${total} VISITADOS</div>`;
}

function renderHub() {
  const tiers = [1, 2, 3];
  const blocks = tiers.map(tier => {
    const locs = LOCATIONS.filter(l => l.tier === tier);
    const pins = locs.map(loc => {
      const locked = isLocked(loc, visited);
      const wasVisited = visited.has(loc.id);
      const status = locked ? '&#128274;' : (wasVisited ? '&#10003;' : '');
      return `
        <button class="pin ${locked ? 'pin--locked' : ''}" data-id="${loc.id}" ${locked ? 'disabled' : ''}>
          <div class="pin-status">${status}</div>
          <div class="pin-title">${loc.title}</div>
          <div class="pin-subtitle">${locked ? 'Bloqueado' : loc.subtitle}</div>
        </button>
      `;
    }).join('');
    return `
      <div class="tier-block">
        <div class="tier-label">${tierLabel(tier)}</div>
        <div class="pin-grid">${pins}</div>
      </div>
    `;
  }).join('');

  board.innerHTML = `
    <h1>Pérdidas silenciosas</h1>
    <div class="subtitle">Una investigación sobre cómo crece el Valle de San Joaquín y quién queda afuera cuando crece.</div>
    ${renderProgress()}
    ${blocks}
  `;

  board.querySelectorAll('.pin:not(.pin--locked)').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      window.location.hash = `#location/${id}`;
    });
  });
}

function renderLocation(id) {
  const loc = LOCATIONS.find(l => l.id === id);
  if (!loc || isLocked(loc, visited)) {
    window.location.hash = '#hub';
    return;
  }

  // Visiting a screen is what triggers it — mark visited on entry.
  if (!visited.has(id)) {
    visited.add(id);
    saveVisited(visited);
  }

  const body = loc.cards
    ? loc.cards.map(c => `<div class="card"><h3>${c.h}</h3><p>${c.p}</p></div>`).join('')
    : '<p><em>El contenido educativo de esta sección irá aquí cuando se produzca el segmento.</em></p>';

  board.innerHTML = `
    <button class="back-btn">&larr; Volver al expediente</button>
    <h2>${loc.title}</h2>
    <div class="subtitle">${loc.subtitle}</div>
    <div class="video-slot">
      <div class="play-icon"></div>
      <div class="placeholder-label">VIDEO AÚN NO PRODUCIDO</div>
    </div>
    <div class="location-body">${body}</div>
  `;

  board.querySelector('.back-btn').addEventListener('click', () => {
    window.location.hash = '#hub';
  });
}

function route() {
  const hash = window.location.hash || '#hub';
  const match = hash.match(/^#location\/(.+)$/);
  if (match) {
    renderLocation(match[1]);
  } else {
    renderHub();
  }
}

window.addEventListener('hashchange', route);
route();
