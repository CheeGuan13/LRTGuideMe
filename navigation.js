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
// MODIFIED: Default to 'escalator' per user request.
let selectedRouteType = 'escalator';

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

// 【【【 优化点 1：新增 】】】
// 用于存储当前的缩放实例
let currentPanZoomInstance = null;

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

// =================================================================
// 【【【 【【【 新增的 Helper Function 】】】 】】】
// =================================================================
/**
 * 在所有楼层中查找一个 POI。
 * @param {string} poiId - 要查找的 POI ID
 * @returns {Object|null} { poi: Object, levelKey: string }
 */
function findPoiInAnyLevel(poiId) {
  const station = STATION_MAPS[currentStation];
  if (!station || !poiId) return null;
  for (const lvKey of Object.keys(station.levels || {})) {
    // 确保从 __originalPois 查找，以防 POI 被过滤器隐藏
    const arr = (station.levels[lvKey].__originalPois || station.levels[lvKey].pois) || [];
    const found = arr.find(p => p.id === poiId);
    if (found) {
      return { poi: found, levelKey: lvKey };
    }
  }
  return null;
}
// =================================================================

/* ---------- 简易路径计算 ---------- */
// 为简单原型定义各楼层走廊的 y 坐标。后续可从 STATION_MAPS.corridors 推断。
const CORRIDOR_Y = {
  L1: [265, 415],
  L2: [175, 345]
};

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
  const allPairs = (STATION_MAPS[currentStation] || {}).crossLinks || [];
  
  // =================================================================
  // 【【【 【【【 这 是 跨 层 导 航 修 复 】】】 】】】
  // =================================================================
  // 错误：旧代码只检查 L1->L2
  // 修复：新代码检查 L1->L2 和 L2->L1 (双向)
  const levelCandidates = allPairs.filter(p => 
    (p.from.level === startLevel && p.to.level === destLevel) ||
    (p.from.level === destLevel && p.to.level === startLevel) // <-- 新增反向检查
  );
  // =================================================================

  if (!levelCandidates.length) return null; // 没有任何跨层连接

  // 1. 根据用户选择和起点，决定实际要用的连接类型
  let typeToUse = routeType || 'escalator'; // 默认为扶梯

  // 您的逻辑：无障碍路线(accessible)与电梯(elevator)一致，除非起点是 Ramp (type 'accessible')
  if (typeToUse === 'accessible' && start.type !== 'accessible') {
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
    
    // =================================================================
    // 【【【 【【【 这 是 跨 层 导 航 修 复 (第2部分) 】】】 】】】
    // =================================================================
    // 找出连接点 POI
    const fromLevelObj = STATION_MAPS[currentStation]?.levels?.[pair.from.level];
    const toLevelObj   = STATION_MAPS[currentStation]?.levels?.[pair.to.level];
    if (!fromLevelObj || !toLevelObj) continue;

    const fromPois = (fromLevelObj.__originalPois || fromLevelObj.pois) || [];
    const toPois = (toLevelObj.__originalPois || toLevelObj.pois) || [];

    const connFromPoi = fromPois.find(p => p.id === pair.from.poi); // "From" 连接点 (例如 L1-Escalator)
    const connToPoi   = toPois.find(p => p.id === pair.to.poi);     // "To" 连接点 (例如 L2-Escalator)
    
    if (!connFromPoi || !connToPoi) continue;
    
    let routeStart, routeEnd;

    if (pair.from.level === startLevel) {
        // 方向正确: L1 -> L2
        // routeStart: 你的起点 (L1) -> 连接点From (L1)
        // routeEnd:   连接点To (L2) -> 你的终点 (L2)
        routeStart = computeSimpleRoute(start, connFromPoi, startLevel);
        routeEnd   = computeSimpleRoute(connToPoi, end, destLevel);
    } else {
        // 方向相反: L2 -> L1
        // routeStart: 你的起点 (L2) -> 连接点To (L2)
        // routeEnd:   连接点From (L1) -> 你的终点 (L1)
        routeStart = computeSimpleRoute(start, connToPoi, startLevel);
        routeEnd   = computeSimpleRoute(connFromPoi, end, destLevel);
    }
    // =================================================================
    
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

// =================================================================
// 【【【 【【【 已修复：populateImAtOptions (保留起点) 】】】 】】】
// =================================================================
/* --- 填充 “I am at” 下拉（当前层的 POI） --- */
function populateImAtOptions(){
  const select = document.querySelector('#startSel');
  if (!select) return;

  const ctx = getCurrentLevelObj();
  if (!ctx) return;
  const { lv, levelKey: currentLvKey } = ctx; // 获取当前楼层的 Key
  const pois = Array.isArray(lv.pois) ? lv.pois : [];

  // 1. 始终包含默认选项
  const opts = ['<option value="">-- Select location --</option>'];

  // 2. 添加当前可见楼层的所有 POI
  opts.push(...pois.slice().sort((a,b)=> (a.name||'').localeCompare(b.name||''))
    .map(p => `<option value="${p.id}">${p.name}</option>`));

  let valueToSet = ''; // 最终要设置给 select.value 的值

  // 3. 检查全局保存的起点 (currentStartPoiId)
  if (currentStartPoiId) {
    // 检查起点是否就在这个楼层
    const isStartOnThisLevel = pois.some(p => p.id === currentStartPoiId);

    if (isStartOnThisLevel) {
      // 起点就在这个楼层, 正常设置 value
      valueToSet = currentStartPoiId;
    } else {
      // 起点在 *另一个* 楼层
      const startPoiData = findPoiInAnyLevel(currentStartPoiId);
      if (startPoiData) {
        // 找到起点了, 添加一个禁用的“占位”选项来显示它
        const startLevelName = levelKeyToName(startPoiData.levelKey);
        // (使用 i18n 翻译 'on')
        const onText = (window.translations?.[window.currentLang]?.on_level) || 'on';
        
        opts.push(`<option value="${currentStartPoiId}" disabled selected style="color:#2563eb; font-weight:bold;">
                     ${startPoiData.poi.name} [${onText} ${startLevelName}]
                   </option>`);
        valueToSet = currentStartPoiId; // 告诉 select 选中这个禁用的项
      }
    }
  }

  // 4. 渲染 HTML
  const optsHTML = opts.join('');
  if (select.__lastOptionsHTML !== optsHTML) {
    select.innerHTML = optsHTML;
    select.__lastOptionsHTML = optsHTML;
  }
  
  // 5. 设置下拉框的选中值
  select.value = valueToSet;

  // 6. 绑定事件 (只绑定一次)
  if (!select.__imAtListenerAttached) {
    select.addEventListener('change', (e) => {
      const val = e.target.value;
      currentStartPoiId = val || null;
      
      // 记录起点所属楼层
      const startPoiData = findPoiInAnyLevel(currentStartPoiId);
      if (startPoiData) {
        currentStartLevel = startPoiData.levelKey;
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
// =================================================================


function renderMap(){
  // 【【【 优化点 2：新增 】】】
  // 开始渲染前，先销毁旧的缩放实例
  if (currentPanZoomInstance) {
    currentPanZoomInstance.destroy();
    currentPanZoomInstance = null;
  }
  
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
  // 【【【 优化点 3：还原 】】】
  //
  //   我们把它改回 100%，让 svg-pan-zoom 库来处理缩放
  //
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
    // 根据所选路线类型着色
    let col = '#e11d48';
    if (selectedRouteType === 'escalator') col = '#1d4ed8';
    else if (selectedRouteType === 'elevator') col = '#6366f1';
    else if (selectedRouteType === 'accessible') col = '#0ea5e9';
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
  
  // =================================================================
  // 【【【 【【【 这 是 修 复 V3 (最终版) 】】】 】】】
  //
  //   我们不再依赖 `fit: true` 选项, 而是手动调用 .fit()
  //
  // =================================================================
  setTimeout(() => {
    // 检查 svg 是否还在DOM中 (防止用户在0.1秒内切换了楼层)
    if (document.getElementById("mapCanvas")?.contains(svg)) { 
      currentPanZoomInstance = svgPanZoom(svg, {
        panEnabled: true,
        zoomEnabled: true,
        controlIconsEnabled: false,
        // fit: true,      // <-- 【删除】
        // center: true,   // <-- 【删除】
        minZoom: 0.7,
        maxZoom: 5,
        zoomScaleSensitivity: 0.3,
        preventMouseEventsDefault: false 
      });

      // 【【【 新增 】】】
      // 在创建实例后，手动调用 fit 和 center
      // 这样做更可靠，因为它会强制库重新检查容器尺寸
      currentPanZoomInstance.fit();
      currentPanZoomInstance.center();
    }
  }, 100); // 100ms 延迟仍然是好的，以等待 flexbox 稳定
  // =================================================================

} // 这是 renderMap() 函数的结束括号

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
  // 【【【 修复：使用新的 helper function 】】】
  const startPoiData = findPoiInAnyLevel(currentStartPoiId);

  // 4. 检查起点是否有效
  if (!startPoiData) {
    {
      const lang = window.currentLang || 'en';
      const tDict = (window.translations && window.translations[lang]) || {};
      const msg = tDict.start_not_found || 'Selected start location not found in station map.';
      showCustomAlert(msg);
    }
    return;
  }

  const startPoi = startPoiData.poi;
  const startLvKey = startPoiData.levelKey;

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

  } else {
    // 跨层导航
    // (startPoi 包含 type, 用于 Ramp 判断)
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

    // 您的需求：高亮实际使用的路线按钮
    setActive([...navScope.querySelectorAll('[data-route]')], navScope.querySelector(`[data-route="${cross.connType}"]`));
    selectedRouteType = cross.connType; // 同步状态

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
  
  // 【【【 新增：AR 视图按钮 】】】
  const arBtnLabel = (window.translations?.[lang]?.ar_view_mockup) || 'AR View (Mock-up)';
  const arButtonHtml = `
    <div style="text-align: center; margin-top: 15px;">
      <a href="ar_mockup.html" class="btn primary small">
        ${arBtnLabel}
      </a>
    </div>
  `;

  infoBody.innerHTML = baseOnly + `
    <hr/>
    <div><strong>${dirLabel}</strong></div>
    <ol style="margin:6px 0;padding-left:18px;">
      ${translatedSteps.map(s => `<li>${s}</li>`).join('')}
    </ol>
    ${arButtonHtml}
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
    if (p) p.dataset.level = 'L2'; // <-- 【【【 修复 V3 】】】
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
    const btn = e.target.closest('[data-route]'); // <-- 【【【 修复 V3 】】】
    if (!btn) return;
    const type = btn.dataset.route;

    // 如果点击的已经是当前激活的类型，则不执行任何操作
    if (selectedRouteType === type && btn.classList.contains('active')) return;
    
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
  // =================================================================
  // 【【【 【【【 这 是 终 极 修 复 】】】 】】】
  // =================================================================
  let resizeTimer = null;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeTimer); // 清除旧的计时器
    
    // 设置一个新的计时器
    resizeTimer = setTimeout(() => {
      if (currentPanZoomInstance) {
        currentPanZoomInstance.resize(); // 1. 告诉库容器大小变了
        currentPanZoomInstance.fit();     // 2. 告诉库重新适应内容
        currentPanZoomInstance.center();  // 3. 告诉库居中
      }
    }, 150); // 150毫秒延迟，等待 resize 风暴结束
  });
  // =================================================================
  
  // =================================================================
  // 【【【 【【【 新增：修复地图缩放导致页面滚动的问题 】】】 】】】
  // =================================================================
  if (mapCanvas) {
    mapCanvas.addEventListener('wheel', (event) => {
      // 当鼠标在地图上滚动时，阻止页面的默认滚动行为
      event.preventDefault();
    }, { passive: false }); // 明确告诉浏览器我们会调用 preventDefault
  }
  // =================================================================

}

/* ---------- 初始化 ---------- */
// =================================================================
// 【【【 【【【 这 是 核 心 修 改 (V2 - 数据库版) 】】】 】】】
// =================================================================
document.addEventListener('DOMContentLoaded', ()=>{
  // 1) 站点检查
  if (!currentStation) {
    currentStation = 'KL Sentral';
    localStorage.setItem('currentStation', currentStation);
  }
  
  // 2) 去 API 获取数据，而不是依赖 kl-sentral-map.js
  fetch(`get_map_data.php?station=${encodeURIComponent(currentStation)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // 将获取的数据存入全局变量，后续代码可以像以前一样运行
      window.STATION_MAPS = data; 
      
      // 3) 确保在访问 STATION_MAPS 之前，原始 POI 列表被备份
      if (STATION_MAPS[currentStation] && STATION_MAPS[currentStation].levels) {
        Object.values(STATION_MAPS[currentStation].levels).forEach(lv => {
          if (Array.isArray(lv.pois) && !lv.__originalPois) {
            lv.__originalPois = lv.pois.slice();
          }
        });
      }

      // 4) 检查地图数据是否存在
      if (!STATION_MAPS[currentStation]) {
        const lang = localStorage.getItem('preferredLang') || 'en';
        let msg = 'Map coming soon...';
        try {
          if (typeof translations === 'object' && translations[lang] && translations[lang].map_coming_soon) {
            msg = translations[lang].map_coming_soon;
          }
        } catch (e) { /* use default */ }
        
        if (mapCanvas) {
          mapCanvas.innerHTML = '';
          const msgEl = document.createElement('div');
          msgEl.className = 'panel';
          msgEl.style.textAlign = 'center';
          msgEl.style.color = '#ef4444';
          const enText = (typeof translations === 'object' && translations['en'] && translations['en'].map_coming_soon)
            ? translations['en'].map_coming_soon
            : 'Map coming soon...';
          msgEl.textContent = enText;
          msgEl.setAttribute('data-i18n-key', 'map_coming_soon');
          mapCanvas.appendChild(msgEl);
          if (typeof applyTranslations === 'function') {
            applyTranslations(lang);
          }
        }
        const lbl = document.getElementById('currentStationLabel');
        if (lbl) {
          const prefix = (translations[lang] && translations[lang].current_station_prefix) || 'Current Station: ';
          lbl.textContent = `${prefix}${currentStation}`;
        }
        return; // 停止执行，因为没有地图
      }

      // 5) 同步/修正楼层（无值则用默认层）
      const stationObj = STATION_MAPS[currentStation];
      if (!currentLevel || !(stationObj.levels || {})[currentLevel]) {
        currentLevel = normalizeLevelKey(stationObj.defaultLevel) || Object.keys(stationObj.levels || {})[0];
        localStorage.setItem('currentLevel', currentLevel);
      }

      // 6) 首次渲染
      rerender();

      // 7) 根据当前状态恢复按钮高亮
      const lvlScope = document.querySelector('.station-levels') || document;
      const curLvlBtn = lvlScope.querySelector(`[data-level="${currentLevel}"]`)
                      || findBtnByText(lvlScope, currentLevel === 'L2' ? 'Platform Level' : 'Ground Floor');
      if (curLvlBtn) setActive([...lvlScope.querySelectorAll('[data-level]')], curLvlBtn);

      // 8) 恢复默认路线类型的高亮
      if (selectedRouteType) {
        const navScope = document.querySelector('.navigation-type') || document;
        const curRouteBtn = navScope.querySelector(`[data-route="${selectedRouteType}"]`);
        if (curRouteBtn) setActive([...navScope.querySelectorAll('[data-route]')], curRouteBtn);
      }

      // 9) 绑定事件
      bindUI();
      
    })
    .catch(error => {
      console.error('Error fetching map data:', error);
      mapCanvas.innerHTML = `<div class="panel" style="text-align:center;color:#ef4444">⚠️ Failed to load map data. Please check connection or API.</div>`;
    });
});