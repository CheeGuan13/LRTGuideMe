/* kl-sentral-map.js — 支持跨层路线版本 */
(function(){
  window.STATION_MAPS = window.STATION_MAPS || {};
  window.TYPE_COLOR   = window.TYPE_COLOR   || {};

  window.TYPE_COLOR = Object.assign({
    ticket:   "#f59e0b",
    service:  "#16a34a",
    elevator: "#334155", 
    escalator:"#64748b",
    toilet:   "#7c3aed",
    prayer:   "#0891b2",
    retail:   "#2563eb",
    exit:     "#dc2626",
    platform: "#0ea5e9",
    accessible: "#059669",
    default:  "#2563eb"
  }, window.TYPE_COLOR || {});

  const WIDTH = 1000, HEIGHT = 540;

  /* -------------------- L1 -------------------- */
  const L1 = {
    width: WIDTH,
    height: HEIGHT,
    areas: [
      { x:  90, y: 180, w: 260, h: 150, label: 'KL CAT / Info', fill: '#fdeef2' },
      { x: 370, y: 160, w: 360, h: 190, label: 'Kelana Jaya Hall', fill: '#fff6cc' },
      { x: 760, y: 180, w: 180, h: 150, label: 'KLIA Transit / Express', fill: '#efe7ff' },
      { x: 120, y: 360, w: 350, h: 110, label: 'Shops (West)', fill: '#d9f7f5' },
      { x: 560, y: 360, w: 320, h: 110, label: 'Shops (East)', fill: '#d9f7f5' },
    ],
    corridors: [],
    pois: [
      { id:'l1-info',     name:'Customer Service',  type:'service',  x: 170, y: 230 },
      { id:'l1-ticket',   name:'Ticket Counter',    type:'ticket',   x: 230, y: 270 },
      { id:'l1-toiletW',  name:'Toilet (West)',     type:'toilet',   x: 110, y: 340 },
      { id:'l1-toiletC',  name:'Toilet (Center)',   type:'toilet',   x: 500, y: 210 },
      { id:'l1-serviceC', name:'Information Desk',  type:'service',  x: 600, y: 250 },
      { id:'l1-klia-tix', name:'KLIA Ticketing',    type:'ticket',   x: 820, y: 270 },
      { id:'l1-prayerE',  name:'Prayer Room',       type:'prayer',   x: 900, y: 230 },
      { id:'l1-retailW1', name:'Cafe',              type:'retail',   x: 170, y: 395 },
      { id:'l1-liftS',    name:'Elevator (South)',  type:'elevator', x: 420, y: 420 },
      { id:'l1-liftW',    name:'Elevator (North)',  type:'elevator', x: 420, y: 300 },
      { id:'l1-escS',     name:'Escalator (South)', type:'escalator',x: 620, y: 420 },
      { id:'l1-escW',     name:'Escalator (North)', type:'escalator',x: 620, y: 300 },
      { id:'l1-retailE1', name:'Bakery',            type:'retail',   x: 300, y: 440 },
      { id:'l1-retailE2', name:'Pharmacy',          type:'retail',   x: 750, y: 420 },
      { id:'l1-exitA',    name:'Pintu A (NU Sentral)',   type:'exit', x: 240, y: 505 },
      { id:'l1-exitB',    name:'Pintu B (Brickfields)',  type:'exit', x: 820, y: 505 },
      { id:'l1-rampA',    name:'Ramp A',            type:'accessible',x: 130, y: 505 },
      { id:'l1-rampB',    name:'Ramp B',            type:'accessible',x: 950, y: 505 },
    ],
    routes: [],
  };

  /* -------------------- L2 -------------------- */
  const L2 = {
    width: WIDTH,
    height: HEIGHT,
    areas: [
      { x: 160, y: 130, w: 700, h: 90,  label: 'Platform 1 / 2',   fill: '#e8f5e9' },
      { x: 160, y: 220, w: 700, h: 90,  label: 'Concourse Bridge', fill: '#f0fdf4' },
      { x: 160, y: 310, w: 700, h: 90,  label: 'Platform 3 / 4',   fill: '#e3f2fd' }
    ],
    corridors: [],
    pois: [
      { id:'l2-escN',       name:'Escalator (North)', type:'escalator',x: 520, y: 175 },
      { id:'l2-liftN',      name:'Elevator (North)',  type:'elevator', x: 220, y: 175 },
      { id:'l2-toiletN',    name:'Toilet (North)',    type:'toilet',   x: 820, y: 175 },
      { id:'l2-info',       name:'Platform Info',     type:'service',  x: 520, y: 265 },
      { id:'l2-escS',       name:'Escalator (South)', type:'escalator',x: 520, y: 345 },
      { id:'l2-liftS',      name:'Elevator (South)',  type:'elevator', x: 220, y: 345 },
      { id:'l2-toiletS',    name:'Toilet (South)',    type:'toilet',   x: 820, y: 345 },
      { id:'l2-exit',       name:'Exit to Concourse', type:'exit',     x: 220, y: 265 }
    ],
    routes: [],
  };

  /* -------------------- 跨层连接定义 -------------------- */
  const CROSS_PAIRS = [
    // 扶梯路线（默认）
    { from: { level:'L1', poi:'l1-escW' }, to: { level:'L2', poi:'l2-escN' }, type:'escalator' },
    { from: { level:'L1', poi:'l1-escS' }, to: { level:'L2', poi:'l2-escS' }, type:'escalator' },

    // 电梯路线
    { from: { level:'L1', poi:'l1-liftW' }, to: { level:'L2', poi:'l2-liftN' }, type:'elevator' },
    { from: { level:'L1', poi:'l1-liftS' }, to: { level:'L2', poi:'l2-liftS' }, type:'elevator' },

    // 无障碍路线（与电梯一致，除非从 ramp 出发）
    { from: { level:'L1', poi:'l1-rampA' }, to: { level:'L2', poi:'l2-liftN' }, type:'accessible' },
    { from: { level:'L1', poi:'l1-rampB' }, to: { level:'L2', poi:'l2-liftS' }, type:'accessible' },
  ];

  window.STATION_MAPS['KL Sentral'] = {
    defaultLevel: 'L1',
    size: { width: WIDTH, height: HEIGHT },
    levels: { L1, L2 },
    crossLinks: CROSS_PAIRS
  };
})();
