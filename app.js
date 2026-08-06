/* =======================================================================
   APP-LOGIK – Zelt Weckmann Helfer-App
   Kein Framework, kein Build-Schritt: läuft direkt aus dem Repo.
   ======================================================================= */

const ICONS = {
  home: '<path d="M4 11.5 12 5l8 6.5"/><path d="M6 10v9h12v-9"/><path d="M10 19v-5h4v5"/>',
  doc: '<path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12h5M9.5 15h5M9.5 9h2"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/>',
  alert: '<path d="M12 4 21 19H3z"/><path d="M12 10v4.2"/><circle cx="12" cy="16.8" r="0.6" fill="currentColor"/>',
  cutlery: '<path d="M8 3v7a2 2 0 0 0 4 0V3"/><path d="M10 10v11"/><path d="M16 3c-1.4 0-2.4 1.8-2.4 4.6 0 2 1 3 2.4 3.4V21"/>',
  star: '<path d="M12 3.5l2.4 5.1 5.6.6-4.2 3.8 1.1 5.6L12 15.8 6.9 18.6l1.2-5.6-4.2-3.8 5.6-.6z"/>',
  cloud: '<path d="M7 18a4.2 4.2 0 0 1-.6-8.35A5 5 0 0 1 16.2 8 4 4 0 0 1 17 16"/><path d="M7 18h10"/>',
  medkit: '<rect x="3.5" y="7.5" width="17" height="11" rx="2"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5"/><path d="M12 11v5M9.5 13.5h5"/>',
  user: '<circle cx="12" cy="8.3" r="3.3"/><path d="M5.5 20c1-3.6 4-5.2 6.5-5.2S17.5 16.4 18.5 20"/>',
  wc: '<circle cx="8" cy="6" r="1.8"/><path d="M8 9v6M5.5 22l1-7M10.5 22l-1-7M5 12h6"/><circle cx="17" cy="6" r="1.8"/><path d="M14.5 22V15a2.2 2.2 0 0 1 4.4 0V22"/><path d="M14.5 12h4.4"/>',
  chevron: '<path d="M9 6l7 6-7 6"/>',
  logout: '<path d="M15 4H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h9"/><path d="M10 12h10m0 0-3-3m3 3-3 3"/>',
};

function icon(name, size = 20, color = "currentColor", stroke = 1.6) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ""}</svg>`;
}

const STORAGE_KEY = "weckmann_login";

// ---- Login-Status ----
function getSession() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
}
function setSession(code) { localStorage.setItem(STORAGE_KEY, JSON.stringify({ code })); }
function clearSession() { localStorage.removeItem(STORAGE_KEY); }

function resolveAccount(rawCode) {
  const code = (rawCode || "").trim().toLowerCase();
  if (TEAMS[code]) return { type: "team", code, ...TEAMS[code] };
  if (BOXEN[code]) return { type: "box", code, ...BOXEN[code] };
  return null;
}

// ---- Tag-Ermittlung (mit Dev-Override zum Testen außerhalb der Festzeit) ----
function todayISO() {
  const override = sessionStorage.getItem("weckmann_dev_day");
  if (override) return override;
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getCurrentDayIndex() {
  const iso = todayISO();
  const idx = DAYS.findIndex(d => d.date === iso);
  return idx; // -1 wenn außerhalb des Festzeitraums
}

// ---- Rendering ----
function renderHeader(account) {
  document.getElementById("brand-team").textContent = account.type === "team" ? account.name : account.name;
  document.getElementById("brand-badge").textContent = account.code.toUpperCase();
}

function renderHeute(account) {
  const wrap = document.getElementById("view-heute");
  const dayIdx = getCurrentDayIndex();
  let heroHtml;

  if (account.type === "team" && dayIdx >= 0) {
    const day = DAYS[dayIdx];
    const sched = SCHEDULE[account.teamKey];
    const pos = sched.positions[dayIdx];
    const shiftsHtml = day.shifts.map(s => `<span class="chip">${icon("cloud", 15, "#D9C08C", 1.6)} ${s.label} ab ${s.time} Uhr</span>`).join("");
    heroHtml = `
      <div class="hero-card">
        <div class="hero-top">
          <div class="hero-label">Dein Bereich heute</div>
          <div class="hero-day">${day.weekday}</div>
        </div>
        <div class="hero-number">${pos}</div>
        <div class="hero-sub">${sched.dutyNote ? "Reihen im Zelt Weckmann · " + sched.dutyNote : "Reihen im Zelt Weckmann"}</div>
        <div class="divider"></div>
        <div class="hero-time">${shiftsHtml}</div>
      </div>`;
  } else if (account.type === "box") {
    heroHtml = `
      <div class="hero-card">
        <div class="hero-top"><div class="hero-label">Dein Bereich</div></div>
        <div class="hero-number" style="font-size:26px;">${account.bereich}</div>
        <div class="hero-sub">Feste Station – keine Rotation</div>
      </div>`;
  } else {
    heroHtml = `
      <div class="hero-card">
        <div class="hero-top"><div class="hero-label">Dein Bereich</div></div>
        <div class="hero-number" style="font-size:22px;">Außerhalb des Festzeitraums</div>
        <div class="hero-sub">Wähle unten testweise einen Festtag, um die Ansicht zu prüfen.</div>
      </div>`;
  }

  const day = dayIdx >= 0 ? DAYS[dayIdx] : null;
  const tagesgericht = day ? (TAGESGERICHT[day.date] || "Wird noch ergänzt") : "—";
  const sonderaktion = day ? day.sonderaktion : "—";
  const sonderDetail = day ? (SONDERAKTION_DETAILS[day.date] || "Details folgen – wird kurzfristig ergänzt.") : "";

  wrap.innerHTML = `
    ${devPickerHtml(dayIdx)}
    ${heroHtml}
    <div class="eyebrow">Wichtig heute</div>
    ${WICHTIGE_INFOS.slice(0, 1).map(infoCard).join("")}
    <div class="card">
      <div class="row">
        <div class="icon-circle" style="background:rgba(31,58,44,0.08); color:var(--tanne);">${icon("cutlery", 18, "#1F3A2C")}</div>
        <div><h3 class="title">Tagesgericht</h3><p class="desc">${tagesgericht}</p></div>
      </div>
    </div>
    <div class="card">
      <div class="row">
        <div class="icon-circle" style="background:rgba(173,138,68,0.14); color:var(--messing);">${icon("star", 18, "#AD8A44")}</div>
        <div><h3 class="title">Sonderaktion heute${day ? ": " + sonderaktion : ""}</h3><p class="desc">${sonderDetail}</p></div>
      </div>
    </div>
    <div class="card" id="wetter-card">
      <div class="row">
        <div class="icon-circle" style="background:rgba(31,58,44,0.08); color:var(--tanne);">${icon("cloud", 18, "#1F3A2C")}</div>
        <div><h3 class="title">Wetter</h3><p class="desc" id="wetter-text">Wird geladen …</p></div>
      </div>
    </div>
  `;
  document.querySelectorAll(".dev-day-select").forEach(sel => {
    sel.addEventListener("change", e => {
      if (e.target.value) sessionStorage.setItem("weckmann_dev_day", e.target.value);
      else sessionStorage.removeItem("weckmann_dev_day");
      renderHeute(account);
    });
  });
  loadWetter();
}

function devPickerHtml(dayIdx) {
  const opts = DAYS.map(d => `<option value="${d.date}" ${d.date === todayISO() ? "selected" : ""}>${d.weekday} ${d.date.slice(8)}.${d.date.slice(5,7)}.</option>`).join("");
  return `
  <div class="dev-picker">
    <span>🧪 Zum Testen: Festtag simulieren</span>
    <select class="dev-day-select">
      <option value="">– echtes Datum –</option>
      ${opts}
    </select>
  </div>`;
}

function infoCard(info) {
  const colorMap = { alert: "var(--bordeaux)", medkit: "var(--bordeaux)", user: "var(--tanne)", wc: "var(--messing)", info: "var(--tanne)" };
  const bgMap = { alert: "rgba(124,46,39,0.08)", medkit: "rgba(124,46,39,0.08)", user: "rgba(31,58,44,0.08)", wc: "rgba(173,138,68,0.14)", info: "rgba(31,58,44,0.08)" };
  return `
    <div class="card">
      <div class="row">
        <div class="icon-circle" style="background:${bgMap[info.icon]}; color:${colorMap[info.icon]};">${icon(info.icon, 18, colorMap[info.icon])}</div>
        <div><h3 class="title">${info.title}</h3><p class="desc">${info.text}</p></div>
      </div>
    </div>`;
}

function renderKarte() {
  const wrap = document.getElementById("view-karte");
  wrap.innerHTML = `
    <div class="eyebrow">Downloads</div>
    <div class="card download-card">
      <div class="download-icon" style="background:rgba(124,46,39,0.08); color:var(--bordeaux);">${icon("doc", 22, "#7C2E27")}</div>
      <h3 class="title serif" style="font-size:17px;">Speisekarte</h3>
      <p class="desc" style="margin-bottom:16px;">Alle Gerichte &amp; Getränke mit Preisen</p>
      <a class="btn" href="${DOWNLOADS.speisekarte}" target="_blank" rel="noopener">PDF öffnen ${icon("chevron", 15, "#fff", 2)}</a>
    </div>
    <div class="card download-card">
      <div class="download-icon" style="background:rgba(173,138,68,0.14); color:var(--messing);">${icon("doc", 22, "#AD8A44")}</div>
      <h3 class="title serif" style="font-size:17px;">Spickzettel</h3>
      <p class="desc" style="margin-bottom:16px;">Kurzübersicht für den Ausschank</p>
      <a class="btn" href="${DOWNLOADS.spickzettel}" target="_blank" rel="noopener">PDF öffnen ${icon("chevron", 15, "#fff", 2)}</a>
    </div>
  `;
}

function renderInfos(account) {
  const wrap = document.getElementById("view-infos");
  wrap.innerHTML = `
    <div class="eyebrow">Wichtige Infos</div>
    ${WICHTIGE_INFOS.map(infoCard).join("")}
    <div style="height:8px;"></div>
    <button class="btn" style="background:var(--bordeaux);" id="logout-btn">${icon("logout", 16, "#fff", 2)} Abmelden</button>
  `;
  document.getElementById("logout-btn").addEventListener("click", () => {
    clearSession();
    showLogin();
  });
}

// ---- Wetter (Open-Meteo, kein API-Key nötig) ----
async function loadWetter() {
  const el = document.getElementById("wetter-text");
  if (!el) return;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${WETTER_CONFIG.latitude}&longitude=${WETTER_CONFIG.longitude}&current=temperature_2m,weather_code&timezone=Europe%2FBerlin`;
    const res = await fetch(url);
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    el.textContent = `${temp}° in Straubing gerade eben`;
  } catch (e) {
    el.textContent = "Aktuell nicht verfügbar";
  }
}

// ---- Views / Tabs ----
function switchTab(tab) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${tab}`).classList.add("active");
  document.querySelectorAll(".tabitem").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  window.scrollTo(0, 0);
}

function initTabs(account) {
  document.querySelectorAll(".tabitem").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
}

// ---- Login ----
function showLogin() {
  document.getElementById("login-screen").classList.remove("hidden");
  document.getElementById("app-screen").classList.add("hidden");
}

function showApp(account) {
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-screen").classList.remove("hidden");
  renderHeader(account);
  renderHeute(account);
  renderKarte();
  renderInfos(account);
  initTabs(account);
  switchTab("heute");
}

function tryLogin() {
  const input = document.getElementById("code-input");
  const errorEl = document.getElementById("login-error");
  const account = resolveAccount(input.value);
  if (!account) {
    errorEl.textContent = "Code nicht erkannt. Bitte prüfen und erneut versuchen.";
    return;
  }
  errorEl.textContent = "";
  setSession(account.code);
  showApp(account);
}

// ---- Start ----
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-btn").addEventListener("click", tryLogin);
  document.getElementById("code-input").addEventListener("keydown", e => {
    if (e.key === "Enter") tryLogin();
  });

  const session = getSession();
  const account = session ? resolveAccount(session.code) : null;
  if (account) {
    showApp(account);
  } else {
    showLogin();
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
