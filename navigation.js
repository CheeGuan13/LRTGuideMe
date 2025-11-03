/* navigation.js
 *
 * This script powers the interactive station map. It reads station map data
 * (from window.STATION_MAPS), renders the selected level, allows the user
 * to choose a route type (escalator/elevator/accessible), select a start
 * location and a destination by clicking on POIs, and then draws a simple
 * polyline showing the route. It also handles multi-language support and
 * gracefully falls back when data is missing.
 *
 * The file is organized into several sections: DOM references, state
 * variables, helper functions (for geometry, routing, etc.), UI binding,
 * rendering logic, and initialization. Comments throughout explain the
 * purpose of each line or block. Simplifying the code where possible, we
 * avoid complex logic and provide clear variable names.
 */

/* ---------- DOM references ---------- */
// The container that will hold the SVG map or fallback message
const mapCanvas    = document.getElementById("mapCanvas");
// The element where facility details (name, nearby POIs) are displayed
const infoBody     = document.getElementById("infoBody");
// The button users click to generate directions
const getDirBtn    = document.getElementById("getDirBtn");
// A small label showing the name of the current station
const stationLabel = document.getElementById("currentStationLabel");

/* ---------- Global / state ---------- */
// Station map definitions are stored on the window by the HTML. If not present,
// initialize to an empty object to avoid errors.
window.STATION_MAPS = window.STATION_MAPS || {};
// A global colour scheme for different POI types; can be extended by other scripts.
window.TYPE_COLOR   = window.TYPE_COLOR   || {};

// The currently selected station name. This is read from localStorage so that
// returning to the page remembers the last station the user selected.
let currentStation = localStorage.getItem("currentStation");

// The currently selected level within the station (e.g. 'L1' or 'L2'). If
// none is stored, the default level defined in the station data will be used.
let currentLevel = localStorage.getItem("currentLevel");

// The POI the user has clicked on as the destination. Used to highlight the
// selected POI and display its details.
let currentSelectedPoi = null;

// The route type chosen by the user: 'escalator', 'elevator', 'accessible', or
// null if none selected. This affects which connections are preferred when
// computing a route.
// MODIFIED: [FIX 2] Set to null. No route is active by default on load.
let selectedRouteType = null;

// The ID of the start POI, taken from the "I am at" dropdown. Only used when
// computing routes.
let currentStartPoiId = null;

// The level on which the start POI resides. Needed for cross-level routing.
let currentStartLevel = null;

// A reference to the currently drawn route polyline so it can be removed and
// redrawn when the user changes options.
let dynamicRouteEl = null;

// For cross-level routes: an object keyed by level (e.g. 'L1' or 'L2')
// containing the list of points for that portion of the route. This allows
// switching between levels without recomputing the route.
let dynamicRoutes = {};

/* ---------- Colour palette ---------- */
// Default colours for different POI types. These can be overridden by
// providing TYPE_COLOR on window. We merge the defaults with any
// user-provided colours so that unspecified types fall back to defaults.
const TYPE_COLORS = Object.assign({
  ticket:   "#f59e0b", // orange for ticket counters
  service:  "#16a34a", // green for customer services
  elevator: "#334155", // dark blue-grey for lifts
  toilet:   "#7c3aed", // purple for toilets
  prayer:   "#0891b2", // teal for prayer rooms
  retail:   "#2563eb", // blue for shops
  exit:     "#dc2626", // red for exits
  platform: "#0ea5e9", // light blue for platforms
  default:  "#2563eb"  // fallback colour
}, window.TYPE_COLOR || {});

/* ---------- 小工具 ---------- */
function rectToBlobPath(x, y, w, h){
  const r = Math.min(w, h) * 0.28;
  const j = Math.max(8, Math.min(18, Math.min(w,h)*0.06));
  return [
    `M${x + r},${y}`,
    `H${x + w - r}`,
    `C${x + w - j},${y} ${x + w},${y + j} ${x + w},${y + r}`,
    `V${y + h - r}`,
    `C${x + w},${y + h - j} ${x + w - j},${y + h} ${x + w - r},${y + h}`,
    `H${x + r}`,
    `C${x + j},${y + h} ${x},${y + h - j} ${x},${y + h - r}`,
    `V${y + r}`,
    `C${x},${y + j} ${x + j},${y} ${x + r},${y}`,
    `Z`
  ].join(' ');
}
function expandRect(bb, pad){
  return { x: bb.x - pad, y: bb.y - pad, width: bb.width + 2*pad, height: bb.height + 2*pad };
}
function intersectsAny(bb, arr){
  return arr.some(r => !(bb.x + bb.width < r.x || r.x + r.width < bb.x || bb.y + bb.height < r.y || r.y + r.height < bb.y));
}

/**
 * Show a custom alert message in a styled overlay. The message will auto-hide after 4 seconds.
 * This avoids using the blocking window.alert and supports internationalized messages.
 * @param {string} msg - Message to display
 */
function showCustomAlert(msg) {
  // Reuse existing alert container if present
  let container = document.getElementById('customAlertContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'customAlertContainer';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.left = '50%';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '10000';
    container.style.background = 'rgba(0,0,0,0.8)';
    container.style.color = '#fff';
    container.style.padding = '12px 20px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    container.style.maxWidth = '90%';
    container.style.textAlign = 'center';
    container.style.fontSize = '14px';
    container.style.display = 'none';
    document.body.appendChild(container);
  }
  container.textContent = msg;
  container.style.display = 'block';
  // Clear previous timer if exists
  if (container.__hideTimer) {
    clearTimeout(container.__hideTimer);
  }
  container.__hideTimer = setTimeout(() => {
    container.style.display = 'none';
  }, 4000);
}

/* --- 统一楼层键名 --- */
function normalizeLevelKey(lv) {
  if (!lv) return lv;
  const v = String(lv).toLowerCase();
  if (v === 'ground' || v === 'l1') return 'L1';
  if (v === 'platform' || v === 'l2') return 'L2';
  return lv; // 其它站可能有自定义键，原样返回
}
// 读取 localStorage 后立刻规范化一次
currentLevel = normalizeLevelKey(currentLevel);

/* ---------- 当前楼层对象 ---------- */
function getCurrentLevelObj(){
  const stationObj = STATION_MAPS[currentStation];
  if (!stationObj) return null;

  currentLevel = normalizeLevelKey(currentLevel);

  let levelKey = currentLevel;
  if (!levelKey || !(stationObj.levels || {})[levelKey]) {
    const def = normalizeLevelKey(stationObj.defaultLevel);
    levelKey = (stationObj.levels || {})[def] ? def : Object.keys(stationObj.levels || {})[0];
  }
  return stationObj.levels && stationObj.levels[levelKey]
    ? { lv: stationObj.levels[levelKey], levelKey }
    : null;
}

/* ---------- 过滤器 ---------- */
function ensureLevelOriginalPois(){
  const ctx = getCurrentLevelObj();
  if (!ctx) return null;
  const { lv } = ctx;
  if (!lv.__originalPois && Array.isArray(lv.pois)) {
    lv.__originalPois = lv.pois.slice();
  }
  return lv;
}
function applyFilters(){
  const ctx = getCurrentLevelObj();
  if (!ctx) return;
  const { lv } = ctx;

  if (!lv.__originalPois && Array.isArray(lv.pois)) lv.__originalPois = lv.pois.slice();

  const boxes = document.querySelectorAll('.type-filter');
  if (!boxes.length) { lv.pois = lv.__originalPois.slice(); return; }

  const active = new Set();
  boxes.forEach(cb => { if (cb.checked) active.add(cb.value); });
  lv.pois = (lv.__originalPois || []).filter(p => !p.type || active.has(p.type));
}

/* ---------- 距离 & Nearby ---------- */
function dist(a, b){
  const dx = (a.x||0) - (b.x||0);
  const dy = (a.y||0) - (b.y||0);
  return Math.sqrt(dx*dx + dy*dy);
}
function getNearbyPois(poi, lv, limit=4, radius=180){
  const list = (lv.pois || [])
    .filter(p => p.id !== poi.id)
    .map(p => ({...p, __d: dist(poi, p)}))
    .filter(p => p.__d <= radius)
    .sort((a,b)=> a.__d - b.__d)
    .slice(0, limit)
    .map(p => ({ name: p.name, tag: p.type || '', how: `${Math.round(p.__d)}m` }));
  return list;
}

/* ---------- 简易路径计算 ---------- */
// 为简单原型定义各楼层走廊的 y 坐标。后续可从 STATION_MAPS.corridors 推断。
const CORRIDOR_Y = {
  L1: [265, 415],
  L2: [175, 345]
};

// DELETED: Removed conflicting CROSS_PAIRS array.
// The script will now use STATION_MAPS[currentStation].crossLinks from kl-sentral-map.js

// 将楼层键转换为人类可读名称。用于方向文本。
function levelKeyToName(lv) {
  const key = normalizeLevelKey(lv);
  if (key === 'L1') return 'Ground Floor';
  if (key === 'L2') return 'Platform Level';
  return lv;
}

/**
 * 计算跨层路线。返回一个对象，包含起始层路线点序列、目标层路线点序列以及所选的连接类型。
 * 如果无法找到跨层路径，返回 null。
 * @param {Object} start 起点 POI（含 x,y,type）
 * @param {Object} end   终点 POI（含 x,y）
 * @param {string} startLevel 起点所在层键（如 'L1'）
 * @param {string} destLevel 终点所在层键（如 'L2'）
 * @param {string} routeType 用户选择的路线类型 (e.g., 'escalator', 'elevator', 'accessible')
 * @returns {Object|null} { startPath: Array<{x,y}>, destPath: Array<{x,y}>, connType: string }
 */
function computeCrossLevelRoute(start, end, startLevel, destLevel, routeType) {
  // 过滤出从起始层到目标层的所有连通对
  // 确保读取 kl-sentral-map.js 中定义的 crossLinks
  const allPairs = (STATION_MAPS[currentStation] || {}).crossLinks || [];
  const levelCandidates = allPairs.filter(p => p.from.level === startLevel && p.to.level === destLevel);

  if (!levelCandidates.length) return null; // 没有任何跨层连接

  // 1. 根据用户选择，决定实际要用的连接类型
  // 'routeType' can be null on first run, default to 'escalator'
  let typeToUse = routeType || 'escalator'; // 默认为扶梯

  // 您的新逻辑：无障碍路线 (accessible) 始终等同于电梯 (elevator) 路线
  if (typeToUse === 'accessible') {
    typeToUse = 'elevator';
  }

  // 2. 筛选出符合该类型的路径
  let candidates = levelCandidates.filter(p => p.type === typeToUse);

  // 3. 兜底：如果选定的类型没有路径(例如,选了扶梯但该方向只有电梯)，则在所有可用路径(同层)中寻找最短的
  if (candidates.length === 0) {
    candidates = levelCandidates;
  }

  let best = null;
  // 遍历每种候选的跨层连接组合
  for (const pair of candidates) {
    // 找出跨层的起始点与目标点的坐标
    const fromPoiId = pair.from.poi;
    const toPoiId   = pair.to.poi;
    
    // 在 STATION_MAPS 中查找对应的 POI 对象
    const startLevelObj = STATION_MAPS[currentStation]?.levels?.[startLevel];
    const destLevelObj  = STATION_MAPS[currentStation]?.levels?.[destLevel];
    if (!startLevelObj || !destLevelObj) continue;

    // 确保我们从原始 POI 列表中查找（防止 POI 被过滤器隐藏）
    // (如果 __originalPois 不存在，则回退到 lv.pois)
    const startPois = (startLevelObj.__originalPois || startLevelObj.pois) || [];
    const destPois = (destLevelObj.__originalPois || destLevelObj.pois) || [];

    const fromPoi = startPois.find(p => p.id === fromPoiId);
    const toPoi   = destPois.find(p => p.id === toPoiId);
    
    if (!fromPoi || !toPoi) continue;

    // 计算起点到跨层入口的路线
    const routeStart = computeSimpleRoute(start, fromPoi, startLevel);
    // 计算跨层出口到终点的路线
    const routeEnd   = computeSimpleRoute(toPoi, end, destLevel);
    // 估算总距离作为代价
    const lenStart = routeLength(routeStart);
    const lenEnd   = routeLength(routeEnd);
    const totalLen = lenStart + lenEnd;

    // 寻找最短路径
    if (!best || totalLen < best.totalLen) {
      best = { startPath: routeStart, destPath: routeEnd, connType: pair.type, totalLen };
    }
  }
  return best;
}


/**
 * 计算路线长度：两点之间的欧氏距离累加。
 * @param {Array<{x:number,y:number}>} pts
 * @returns {number} 长度（像素）
 */
function routeLength(pts) {
  let sum = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dx = (a.x || 0) - (b.x || 0);
    const dy = (a.y || 0) - (b.y || 0);
    sum += Math.sqrt(dx * dx + dy * dy);
  }
  return sum;
}

/**
 * 根据路径点序列生成英文导航步骤。
 * 如果给定 finalName，则在最后添加终点名称提示。
 * @param {Array<{x:number,y:number}>} pts 路径点序列
 * @param {string|null} finalName 最终目的地名称
 * @returns {string[]} 步骤数组
 */
function generateSteps(pts, finalName) {
  const steps = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distPx = Math.sqrt(dx * dx + dy * dy);
    const dist = Math.round(distPx);
    if (Math.abs(dx) < 1) {
      const dir = dy > 0 ? 'down' : 'up';
      steps.push(`Go ${dir} for ${dist}m.`);
    } else if (Math.abs(dy) < 1) {
      const dir = dx > 0 ? 'right' : 'left';
      steps.push(`Walk ${dir} for ${dist}m.`);
    } else {
      steps.push(`Proceed diagonally for ${dist}m.`);
    }
  }
  if (finalName) {
    steps.push(`Look for “${finalName}”.`);
  }
  return steps;
}

/**
 * 计算两点之间的简单“L 形”路径。该函数先把起点投影到最近的走廊，再水平方向到终点 x，再垂直至终点。
 * 这适用于无障碍的简易场景。对于跨层导航，可在未来扩展。
 * @param {Object} start 起点 POI（含 x,y）
 * @param {Object} end   终点 POI（含 x,y）
 * @param {string} levelKey 楼层键（如 'L1' 或 'L2'）
 * @returns {Array<{x:number,y:number}>} 路线点序列
 */
function computeSimpleRoute(start, end, levelKey){
  // 如果没有走廊定义，直接连线
  const ys = CORRIDOR_Y[levelKey] || [];
  if (!ys.length) return [ { x: start.x, y: start.y }, { x: end.x, y: end.y } ];
  // 选择使总垂直距离最小的走廊
  let bestY = ys[0];
  let bestCost = Math.abs(start.y - ys[0]) + Math.abs(end.y - ys[0]);
  for (const y of ys){
    const c = Math.abs(start.y - y) + Math.abs(end.y - y);
    if (c < bestCost){ bestCost = c; bestY = y; }
  }
  const route = [];
  // 起点
  route.push({ x: start.x, y: start.y });
  // 若起点不在走廊上，垂直移动到走廊
  if (start.y !== bestY) {
    route.push({ x: start.x, y: bestY });
  }
  // 水平移动至终点 x
  if (start.x !== end.x) {
    route.push({ x: end.x, y: bestY });
  }
  // 垂直到终点
  if (bestY !== end.y) {
    route.push({ x: end.x, y: end.y });
  }
  return route;
}

/* ---------- 信息面板（不显示 Type，改显示 Nearby） ---------- */
function renderPoiInfo(station, levelKey, poi){
  const ctx = getCurrentLevelObj();
  const lv  = ctx?.lv;

  // 优先使用数据里的 places；没有则自动就近找
  let nearby = Array.isArray(poi.places) ? poi.places.slice(0,4) : [];
  if (!nearby.length && lv) nearby = getNearbyPois(poi, lv, 4, 180);

  const nearbyHtml = nearby.length
    ? `<div style="margin-top:8px;">
         <strong>Nearby</strong>
         <ul style="margin:6px 0 0 18px; line-height:1.6;">
           ${nearby.map(n => `<li>${n.name}${n.tag ? ` <small style="color:#64748b;">(${n.tag})</small>`:''}${n.how ? ` — <small style="color:#64748b;">${n.how}</small>`:''}</li>`).join('')}
         </ul>
       </div>`
    : '';

  return `
    <div><strong>${station} — ${levelKey}</strong></div>
    <p>${poi.name}</p>
    ${nearbyHtml}
  `;
}

/* ---------- 路线（polyline） ---------- */
function drawRoutes(world, lv){
  // 默认路线（escalator/elevator/accessible）在本改进版中不再绘制，以简化界面
  return;
}

/* ---------- 渲染入口 ---------- */
function assertStationDataOrShowError() {
  if (!STATION_MAPS[currentStation]) {
    if (mapCanvas) {
      mapCanvas.innerHTML =
        `<div class="panel" style="text-align:center;color:#ef4444">
           ⚠️ No map data for station: ${currentStation || '-'}
         </div>`;
    }
    if (stationLabel) stationLabel.textContent = currentStation || "-";
    return false;
  }
  return true;
}

/* --- 填充 “I am at” 下拉（当前层的 POI） --- */
function populateImAtOptions(){
  // 优先查找导航页面中用于表示“我在这里”的下拉框。顺序：#startSel → #imAtSelect → #startSelect → data-role → 根据 label 文本匹配。
  const select =
    document.querySelector('#startSel') ||
    document.querySelector('#imAtSelect') ||
    document.querySelector('#startSelect') ||
    document.querySelector('select[data-role="im-at"]') ||
    (() => {
      const labels = Array.from(document.querySelectorAll('label'));
      const targetLabel = labels.find(l => /i\s*am\s*at/i.test(l.textContent || ''));
      if (targetLabel) {
        const sel = targetLabel.parentElement?.querySelector('select');
        if (sel) return sel;
      }
      return document.querySelector('main select, .content select, select');
    })();
  if (!select) return;

  const ctx = getCurrentLevelObj();
  if (!ctx) return;
  const { lv } = ctx;
  const pois = Array.isArray(lv.pois) ? lv.pois : [];

  const opts = ['<option value="">-- Select location --</option>']
    .concat(pois.slice().sort((a,b)=> (a.name||'').localeCompare(b.name||''))
      .map(p => `<option value="${p.id}">${p.name}</option>`))
    .join('');

  if (select.__lastOptionsHTML !== opts) {
    select.innerHTML = opts;
    select.__lastOptionsHTML = opts;
  }

  // 如果当前选择的起点不在此楼层，则仍保留它供跨层导航使用，但不在下拉框中显示
  if (!pois.some(p => p.id === currentStartPoiId)) {
    // 起点位于其他楼层，保留 currentStartPoiId
    // 清空下拉框显示值
    if (select.value !== '') select.value = '';
  }

  // 绑定下拉变化事件，仅绑定一次
  if (!select.__imAtListenerAttached) {
    select.addEventListener('change', (e) => {
      const val = e.target.value;
      currentStartPoiId = val || null;
      // 记录起点所属楼层，便于跨层导航
      const ctx2 = getCurrentLevelObj();
      if (currentStartPoiId && ctx2) {
        currentStartLevel = ctx2.levelKey;
      } else {
        currentStartLevel = null;
      }
      // 用户变更起点时，清除现有动态路径
      dynamicRoutes = {};
      dynamicRouteEl = null;
      // 重新绘制地图以去除旧路径
      rerender();
    });
    select.__imAtListenerAttached = true;
  }
}

function renderMap(){
  if (!assertStationDataOrShowError() || !mapCanvas) return;

  const ctx = getCurrentLevelObj();
  if (!ctx){ mapCanvas.innerHTML = `<div class="panel" style="text-align:center;">No map available.</div>`; return; }
  const { lv, levelKey } = ctx;

  if (stationLabel) {
    // Use translated prefix for current station label
    const prefix = (window.translations?.[window.currentLang]?.current_station_prefix) || (window.translations?.en?.current_station_prefix) || '';
    stationLabel.textContent = prefix + (currentStation || '-');
  }

  mapCanvas.innerHTML = '';
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg   = document.createElementNS(svgNS,'svg');
  svg.setAttribute('viewBox','0 0 1000 540');

  // =================================================================
  // 【【【 优化点 1：已还原 】】】
  //
  //   我们把它改回 100%，让桌面端可以自动缩放
  //   移动端的平移功能将由 CSS (@media) 来强制实现
  //
  //   原代码 (上一个版本):
  //   svg.setAttribute('width','1000');
  //   svg.setAttribute('height','540');
  //
  //   修改后 (还原):
  svg.setAttribute('width','100%');
  svg.setAttribute('height','100%');
  // =================================================================
  
  svg.style.borderRadius = '16px';
  svg.style.background   = '#f1f5f9';

  const world = document.createElementNS(svgNS,'g');
  svg.appendChild(world);

  // 1) 胶囊区块
  (lv.areas || []).forEach(a=>{
    const path = document.createElementNS(svgNS,'path');
    path.setAttribute('d', rectToBlobPath(a.x,a.y,a.w,a.h));
    path.setAttribute('fill', a.fill || '#e7eaf0');
    // 移除区块的描边，使不同区域之间不再出现灰色线条
    path.setAttribute('stroke', 'none');
    path.setAttribute('stroke-width', '0');
    path.setAttribute('opacity', '0.96');
    world.appendChild(path);

    if (a.label){
      const t = document.createElementNS(svgNS,'text');
      t.textContent = a.label;
      t.setAttribute('x', a.x + a.w/2);
      t.setAttribute('y', a.y + 22);
      t.setAttribute('text-anchor','middle');
      t.setAttribute('font-size','13');
      t.setAttribute('fill','#475569');
      world.appendChild(t);
    }
  });

  // 2) 走廊（如有）

  // 3) 路线（polyline）
  drawRoutes(world, lv);

  // 3.5) 绘制动态导航路线（如果有）。
  // 将路线置于POI标注之前，避免遮挡文本。
  const dynPts = dynamicRoutes[levelKey];
  if (dynPts && Array.isArray(dynPts) && dynPts.length >= 2) {
    const poly = document.createElementNS(svgNS,'polyline');
    poly.setAttribute('class','route-line');
    poly.setAttribute('points', dynPts.map(pt => `${pt.x},${pt.y}`).join(' '));
    poly.setAttribute('fill','none');
    
    // Use routeType from calculation, fallback to blue
    let col = '#1d4ed8'; // Default blue
    // selectedRouteType might be null, but the button highlight is handled by calculateAndDrawRoute
    if (selectedRouteType === 'escalator') col = '#1d4ed8';
    else if (selectedRouteType === 'elevator') col = '#6366f1';
    else if (selectedRouteType === 'accessible') col = '#6366f1'; // Per request, accessible = elevator
    
    poly.setAttribute('stroke', col);
    poly.setAttribute('stroke-width','6');
    poly.setAttribute('stroke-linecap','round');
    poly.setAttribute('stroke-linejoin','round');
    world.appendChild(poly);
  }

  // 4) POI 标注：绘制圆点和文字。尝试多种放置方式避免重叠。
  const placedBoxes = [];
  (lv.pois || []).forEach(p => {
    const group = document.createElementNS(svgNS,'g');
    const dot = document.createElementNS(svgNS,'circle');
    dot.setAttribute('cx', p.x);
    dot.setAttribute('cy', p.y);
    dot.setAttribute('r', '7');
    dot.setAttribute('fill', TYPE_COLORS[p.type] || TYPE_COLORS.default);
    group.appendChild(dot);
    // 创建文本
    const label = document.createElementNS(svgNS,'text');
    label.textContent = p.name;
    label.setAttribute('font-size', '12');
    label.setAttribute('fill', '#0f172a');
    label.setAttribute('pointer-events', 'none');
    label.setAttribute('paint-order', 'stroke');
    label.setAttribute('stroke', 'white');
    label.setAttribute('stroke-width', '2');
    group.appendChild(label);
    world.appendChild(group);
    // 定义候选放置方式：下方、上方、右侧、左侧
    const candidates = [
      { dx: 0, dy: 10,  anchor: 'middle' }, // 下方
      { dx: 0, dy: -12, anchor: 'middle' }, // 上方
      { dx: 12, dy: 4,  anchor: 'start'  }, // 右侧
      { dx: -12,dy: 4,  anchor: 'end'    }  // 左侧
    ];
    let placed = false;
    for (const pos of candidates) {
      const xPos = p.x + pos.dx;
      const yPos = p.y + pos.dy;
      label.setAttribute('x', xPos);
      label.setAttribute('y', yPos);
      label.setAttribute('text-anchor', pos.anchor);
      // 测量文本包围盒
      const bb = label.getBBox();
      const rect = expandRect(bb, 2);
      if (!intersectsAny(rect, placedBoxes)) {
        placedBoxes.push(rect);
        placed = true;
        break;
      }
    }
    if (!placed) {
      // 如果所有候选位置均重叠，则默认放置在下方，允许部分重叠
      label.setAttribute('x', p.x);
      label.setAttribute('y', p.y + 10);
      label.setAttribute('text-anchor','middle');
      const bb = label.getBBox();
      placedBoxes.push(expandRect(bb,2));
    }
    const currentY = parseFloat(label.getAttribute('y') || p.y);
    label.setAttribute('y', currentY + 8);
    // 设置点击事件：高亮点位并更新信息面板；使按钮可用
    group.style.cursor = 'pointer';
    dot.addEventListener('click', () => {
      currentSelectedPoi = p;
      if (infoBody) {
        // 使用 renderPoiInfo 生成信息面板内容（包含附近点等）
        infoBody.innerHTML = renderPoiInfo(currentStation, levelKey, p);
      }
      if (getDirBtn) getDirBtn.disabled = false;
      // 取消其它圆点的高亮，突出当前选择
      world.querySelectorAll('circle').forEach(c => c.removeAttribute('stroke'));
      dot.setAttribute('stroke','#1d4ed8');
      dot.setAttribute('stroke-width','3');
    });
  });

  mapCanvas.appendChild(svg);
}

/* ---------- 重绘 ---------- */
function rerender(){
  applyFilters();
  renderMap();
  populateImAtOptions();   // 同步 “I am at” 下拉
  // 切换楼层或过滤器时清除旧的动态 polyline
  dynamicRouteEl = null;
  // 动态路线由 renderMap() 自行绘制，无需在此插入
}

/* ---------- 找按钮的小工具（按文字兜底） ---------- */
// MOVED: Moved helper functions here to ensure they are defined before use.
function findBtnByText(scope, text){
  if (!scope) return null;
  const t = String(text).toLowerCase().replace(/\s+/g,' ').trim();
  const cands = scope.querySelectorAll('button,[role="button"],.btn,.chip,.pill');
  for (const el of cands) {
    const txt = (el.textContent || '').toLowerCase().replace(/\s+/g,' ').trim();
    if (txt === t) return el;
  }
  return null;
}
function setActive(list, el){
  list.forEach(e => e && e.classList && e.classList.remove('active'));
  if (el && el.classList) el.classList.add('active');
}

/**
 * 核心函数：计算并绘制从起点到终点的路线。
 * 它处理同层和跨层，并更新信息面板。
 */
async function calculateAndDrawRoute() {
  // 1. 检查是否选了终点
  if (!currentSelectedPoi) {
    // (如果需要，可以在此显示提醒)
    return;
  }
  
  // 2. 检查是否选了起点
  if (!currentStartPoiId) {
      // 显示本地化提醒
      {
        const lang = window.currentLang || 'en';
        const tDict = (window.translations && window.translations[lang]) || {};
        const msg = tDict.select_current_location_prompt || 'Please select your current location in the "I am at" dropdown.';
        showCustomAlert(msg);
      }
    return;
  }

  // 3. 查找起点 POI 完整对象 (支持跨层)
  const station = STATION_MAPS[currentStation];
  if (!station) return;
  let startPoi = null;
  let startLvKey = null;
  for (const lvKey of Object.keys(station.levels || {})) {
    const arr = (station.levels[lvKey].__originalPois || station.levels[lvKey].pois) || [];
    const found = arr.find(p => p.id === currentStartPoiId);
    if (found) {
      startPoi = found;
      startLvKey = lvKey;
      break;
    }
  }

  // 4. 检查起点是否有效
  if (!startPoi || !startLvKey) {
    {
      const lang = window.currentLang || 'en';
      const tDict = (window.translations && window.translations[lang]) || {};
      const msg = tDict.start_not_found || 'Selected start location not found in station map.';
      showCustomAlert(msg);
    }
    return;
  }

  // 5. 获取终点 POI 和楼层
  const ctx = getCurrentLevelObj();
  if (!ctx) return;
  const { lv, levelKey: destLvKey } = ctx;
  const targetPoi = currentSelectedPoi; // 终点
  
  // 6. 重置路线和步骤
  dynamicRoutes = {}; // 重置跨层动态路线
  let steps = [];
  const navScope = document.querySelector('.navigation-type') || document;

  // 7. 计算路线 (同层或跨层)
  if (startLvKey === destLvKey) {
    // 同层导航
    const routePts = computeSimpleRoute(startPoi, targetPoi, destLvKey);
    dynamicRoutes[destLvKey] = routePts;
    steps = generateSteps(routePts, targetPoi.name);
    
    // 您的需求：同层时，清除路线类型高亮
    navScope.querySelectorAll('[data-route]').forEach(b=>b.classList.remove('active'));
    // Also reset the state variable
    selectedRouteType = null;

  } else {
    // 跨层导航
    // (startPoi 包含 type, 用于 Ramp 判断)
    // 'selectedRouteType' may be null here, computeCrossLevelRoute will default to 'escalator'
    const cross = computeCrossLevelRoute(startPoi, targetPoi, startLvKey, destLvKey, selectedRouteType);
    
    if (!cross) {
      {
        const lang = window.currentLang || 'en';
        const tDict = (window.translations && window.translations[lang]) || {};
        const msg = tDict.cross_level_unavailable || 'Cross-level navigation is not available between these floors.';
        showCustomAlert(msg);
      }
      return;
    }

    // MODIFIED: [FIX 1]
    // 只有在用户 *没有* 选择路线时 (selectedRouteType === null)，
    // (例如：用户第一次点击 "Get Directions")，
    // 我们才用计算出的类型 (cross.connType) 来更新UI和状态。
    if (selectedRouteType === null) {
        selectedRouteType = cross.connType;
        setActive([...navScope.querySelectorAll('[data-route]')], navScope.querySelector(`[data-route="${cross.connType}"]`));
    }
    // 如果用户 *已经* 点击了 "accessible" 或 "elevator" (selectedRouteType != null),
    // 那么 bindUI 已经设置了高亮，我们 *不会* 覆盖它。
    // "accessible" 按钮将保持高亮，即使用户被引导至电梯。


    dynamicRoutes[startLvKey] = cross.startPath;
    dynamicRoutes[destLvKey]  = cross.destPath;
    
    const stepsStart = generateSteps(cross.startPath, null);
    const connName   = cross.connType === 'lift' ? 'lift' : cross.connType;
    const crossStep  = `Take the ${connName} to ${levelKeyToName(destLvKey)}.`;
    const stepsEnd   = generateSteps(cross.destPath, targetPoi.name);
    steps = [...stepsStart, crossStep, ...stepsEnd];
  }

  // 8. 重新渲染地图 (绘制新路线)
  rerender();

  // 9. 翻译步骤
  let translatedSteps = steps;
  try {
    if (window.currentLang && window.currentLang !== 'en' && typeof window.translateExternal === 'function') {
      translatedSteps = await Promise.all(steps.map(s => window.translateExternal(s, window.currentLang)));
    }
  } catch (err) {
    console.error('Failed to translate directions', err);
    translatedSteps = steps;
  }

  // 10. 更新信息面板 (在 POI 信息后附加步骤)
  // (确保不会丢失 POI 基础信息)
  const baseOnly = infoBody.innerHTML.split('<hr')[0] || infoBody.innerHTML;
  const lang = window.currentLang || 'en';
  const dirLabel = (window.translations?.[lang]?.directions) || 'Directions';
  infoBody.innerHTML = baseOnly + `
    <hr/>
    <div><strong>${dirLabel}</strong></div>
    <ol style="margin:6px 0;padding-left:18px;">
      ${translatedSteps.map(s => `<li>${s}</li>`).join('')}
    </ol>
  `;
}

/* ---------- Get Directions（去重） ---------- */
if (getDirBtn && infoBody) {
  // 现在它只调用我们的新函数
  getDirBtn.addEventListener('click', calculateAndDrawRoute);
}

/* ---------- 事件绑定 ---------- */
function bindUI(){
  /* 楼层切换：优先 data-level；否则按文字兜底（Ground Floor / Platform Level） */
  const lvlScope = document.querySelector('.station-levels') || document;
  let levelBtns = [...lvlScope.querySelectorAll('[data-level]')];
  if (levelBtns.length === 0) {
    const g = findBtnByText(lvlScope, 'Ground Floor');
    const p = findBtnByText(lvlScope, 'Platform Level');
    if (g) g.dataset.level = 'L1';
    if (p) p.dataset.level = 'L2';
    levelBtns = [g,p].filter(Boolean);
  }
  lvlScope.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-level]');
    if (!btn) return;
    const lv = normalizeLevelKey(btn.dataset.level);
    if (!lv || lv === currentLevel) return;
    currentLevel = lv;
    localStorage.setItem('currentLevel', currentLevel);
    setActive([...lvlScope.querySelectorAll('[data-level]')], btn);
    rerender();
  });

  /* 导航类型：优先 data-route；否则按文字兜底 */
  const navScope = document.querySelector('.navigation-type') || document;
  const ensureNavBtn = (label, val)=>{
    let b = navScope.querySelector(`[data-route="${val}"]`);
    if (!b) { b = findBtnByText(navScope, label); if (b) b.dataset.route = val; }
    return b;
  };
  ensureNavBtn('Escalator Route','escalator');
  ensureNavBtn('Elevator Route', 'elevator');
  ensureNavBtn('Accessible Route','accessible');

  navScope.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-route]');
    if (!btn) return;
    const type = btn.dataset.route;

    // 如果点击的已经是当前激活的类型，则不执行任何操作
    // (MODIFIED: [FIX 1] Removed the 'active' check to allow re-calculation)
    if (selectedRouteType === type) {
        // If it's already selected, re-run the calculation
        // in case the start/end points changed.
        if (currentStartPoiId && currentSelectedPoi) {
             calculateAndDrawRoute();
        }
        return;
    }
    
    selectedRouteType = type;
    setActive([...navScope.querySelectorAll('[data-route]')], btn);
    
    // === 核心修改 ===
    // 检查是否已经有起点和终点 (即路线正在显示中)
    if (currentStartPoiId && currentSelectedPoi) {
      // 如果是，立即重新计算并绘制路线
      calculateAndDrawRoute();
    } else {
      // 否则 (如果用户只是在看地图，还没选点)，
      // 只清除旧路线(如果有)并重绘
      dynamicRoutes = {};
      rerender(); 
    }
  });

  /* 过滤器 */
  document.querySelectorAll('.type-filter').forEach(cb=>{
    cb.addEventListener('change', rerender);
  });

  /* 更换车站（可选按钮） */
  const changeBtn = document.getElementById('changeStationBtn');
  if (changeBtn) changeBtn.addEventListener('click', ()=>{ window.location.href = 'station-select.html'; });

  /* 窗口调整 → 重绘 */
  let resizeTimer = null;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rerender, 120);
  });
}

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  // 1) 站点检查
  // 如果尚未选择站点，则默认加载 “KL Sentral” 以便展示示例地图。
  if (!currentStation) {
    currentStation = 'KL Sentral';
    localStorage.setItem('currentStation', currentStation);
  }
  // If the selected station has no map data, display a "coming soon" message instead of
  // falling back to another map. We use the translation dictionary to show the
  // message in the current language. After showing the message, we stop further
  // initialization so the rest of the navigation UI does not attempt to render.
  if (!STATION_MAPS[currentStation]) {
    const lang = localStorage.getItem('preferredLang') || 'en';
    let msg = 'Map coming soon...';
    try {
      if (typeof translations === 'object' && translations[lang] && translations[lang].map_coming_soon) {
        msg = translations[lang].map_coming_soon;
      }
    } catch (e) {
      // use default
    }
    // Show message in the map canvas area. Create an element with a data-i18n-key so
    // that it will update when the language changes via applyTranslations().
    if (mapCanvas) {
      // Clear existing content
      mapCanvas.innerHTML = '';
      const msgEl = document.createElement('div');
      msgEl.className = 'panel';
      msgEl.style.textAlign = 'center';
      msgEl.style.color = '#ef4444';
      // Set English text as the default/original content. This ensures that
      // when lang === 'en', applyTranslations will keep the original text.
      const enText = (typeof translations === 'object' && translations['en'] && translations['en'].map_coming_soon)
        ? translations['en'].map_coming_soon
        : 'Map coming soon...';
      msgEl.textContent = enText;
      msgEl.setAttribute('data-i18n-key', 'map_coming_soon');
      mapCanvas.appendChild(msgEl);
      // Immediately translate the message to the current language
      if (typeof applyTranslations === 'function') {
        applyTranslations(lang);
      }
    }
    // Update station label to reflect the selected station
    const lbl = document.getElementById('currentStationLabel');
    if (lbl) {
      const prefix = (translations[lang] && translations[lang].current_station_prefix) || 'Current Station: ';
      lbl.textContent = `${prefix}${currentStation}`;
    }
    return;
  }

  // 2) 同步/修正楼层（无值则用默认层）
  const stationObj = STATION_MAPS[currentStation];
  if (!currentLevel || !(stationObj.levels || {})[currentLevel]) {
    currentLevel = normalizeLevelKey(stationObj.defaultLevel) || Object.keys(stationObj.levels || {})[0];
    localStorage.setItem('currentLevel', currentLevel);
  }

  // 3) 首次渲染
  rerender();

  // 4) 根据当前状态恢复按钮高亮
  const lvlScope = document.querySelector('.station-levels') || document;
  const curLvlBtn = lvlScope.querySelector(`[data-level="${currentLevel}"]`)
                  || findBtnByText(lvlScope, currentLevel === 'L2' ? 'Platform Level' : 'Ground Floor');
  if (curLvlBtn) setActive([...lvlScope.querySelectorAll('[data-level]')], curLvlBtn);

  // MODIFIED: [FIX 2] Deleted the block that highlights the default route type on load.
  // Route type buttons are not highlighted by default anymore.

  // 5) 绑定事件
  bindUI();
});