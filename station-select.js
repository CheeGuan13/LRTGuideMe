// ========= Config =========
const NAV_PAGE = 'navigation.html'; 

const LINES = [
  {
    key: 'kelana',
    name: 'Kelana Jaya Line',
    dotClass: 'kelana',
    stations: [
      'Gombak','Taman Melati','Wangsa Maju','Sri Rampai','Setiawangsa','Jelatek',
      "Dato' Keramat",'Damai','Ampang Park','KLCC','Kampung Baru','Dang Wangi',
      'Masjid Jamek','Pasar Seni','KL Sentral','Bangsar','Abdullah Hukum','Kerinchi',
      'Universiti','Taman Jaya','Asia Jaya','Taman Paramount','Taman Bahagia',
      'Kelana Jaya','Lembah Subang','Ara Damansara','Glenmarie','Subang Jaya',
      'SS15','SS18','USJ 7','Taipan','Wawasan','USJ 21','Alam Megah','Subang Alam',
      'Putra Heights'
    ]
  },
  {
    key: 'sripetaling',
    name: 'Sri Petaling Line',
    dotClass: 'sripetaling',
    stations: [
      'Sentul Timur','Sentul','Titiwangsa','PWTC','Sultan Ismail','Bandaraya',
      'Masjid Jamek','Plaza Rakyat','Hang Tuah','Pudu','Chan Sow Lin','Cheras',
      'Salak Selatan','Bandar Tun Razak','Bandar Tasik Selatan','Sungai Besi',
      'Bukit Jalil','Sri Petaling','Awan Besar','Muhibbah','Alam Sutera',
      'Kinrara BK5','IOI Puchong Jaya','Pusat Bandar Puchong','Taman Perindustrian Puchong',
      'Bandar Puteri','Puchong Perdana','Puchong Prima','Putra Heights'
    ]
  },
  {
    key: 'ampang',
    name: 'Ampang Line',
    dotClass: 'ampang',
    stations: [
      'Sentul Timur','Sentul','Titiwangsa','PWTC','Sultan Ismail','Bandaraya',
      'Masjid Jamek','Plaza Rakyat','Pudu','Hang Tuah','Chan Sow Lin','Miharja',
      'Maluri','Pandan Jaya','Cempaka','Pandan Indah','Cahaya','Ampang'
    ]
  }
];

// ========= DOM =========
const picker = document.getElementById('linePicker');
const list = document.getElementById('stationList2');
const q = document.getElementById('stationSearch2');
const groupDot = document.getElementById('groupDot');
const groupName = document.getElementById('groupName');
const continueBox = document.getElementById('continueBox');
const continueBtn = document.getElementById('continueBtn');

let current = LINES[0];
let selectedStation = null;

document.addEventListener('click', (e) => {
  const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
  if (!a) return;
  const href = (a.getAttribute('href') || '').toLowerCase();
  if (href.includes('nav.html') || href.includes('navigation.html')) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);

function renderLineChips() {
  picker.innerHTML = '';
  LINES.forEach(line => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.type = 'button';
    btn.setAttribute('aria-pressed', String(line.key === current.key));
    btn.innerHTML = `<span class="dot ${line.dotClass}"></span> ${line.name}`;
    btn.addEventListener('click', () => {
      current = line;
      selectedStation = null;
      continueBox.style.display = 'none';
      picker.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      if (q) q.value = '';
      renderGroupHead();
      renderStations();
    });
    picker.appendChild(btn);
  });
}


function renderGroupHead() {
  groupDot.className = `dot ${current.dotClass}`;
  groupName.textContent = current.name;
}

function renderStations() {
  const term = (q?.value || '').trim().toLowerCase();
  list.innerHTML = '';
  current.stations
    .filter(n => !term || n.toLowerCase().includes(term))
    .forEach(name => {
      const card = document.createElement('button');
      card.className = 'station-card';
      card.type = 'button';
      card.innerHTML = `
        <svg class="train-ic" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2c3.9 0 7 1 7 4v7c0 2-1.5 3.5-3.5 3.9l1.8 2.1h-2.3l-1.6-2H10.6l-1.6 2H6.7l1.8-2.1C6.5 16.5 5 15 5 13V6c0-3 3.1-4 7-4zm-4 6h8V6H8v2zm0 4h8V10H8v2zm-1 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
        </svg>
        <span>${name}</span>
      `;
      card.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();
        selectedStation = name;

        document.querySelectorAll('.station-card').forEach(c => (c.style.outline = 'none'));
        card.style.outline = '3px solid #2563eb';

        continueBox.style.display = 'block';
      });
      list.appendChild(card);
    });
}

q?.addEventListener('input', renderStations);

continueBtn?.addEventListener('click', () => {
  if (selectedStation) {
    localStorage.setItem('currentStation', selectedStation);
    window.location.href = NAV_PAGE;
  }
});

renderLineChips();
renderGroupHead();
renderStations();
