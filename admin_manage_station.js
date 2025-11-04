document.addEventListener('DOMContentLoaded', () => {
    
    // --- 全局变量 ---
    const urlParams = new URLSearchParams(window.location.search);
    const STATION_ID = urlParams.get('id');
    let CURRENT_LEVEL_ID = null; // 当前正在编辑的楼层 ID
    
    // --- DOM 引用 ---
    const stationNameTitle = document.getElementById('stationNameTitle');
    const levelNameTitle = document.getElementById('levelNameTitle');
    const levelTabs = document.getElementById('levelTabs');
    const mapCanvas = document.getElementById('editorMapCanvas');
    const clickMarker = document.getElementById('clickMarker');
    const coordDisplay = document.getElementById('coordDisplay');
    
    // 表单
    const poiForm = document.getElementById('poiForm');
    const floorplanUploader = document.getElementById('floorplanUploader');
    const addLevelForm = document.getElementById('addLevelForm');
    
    // 列表
    const poiList = document.getElementById('poiList').querySelector('ul');
    
    // --- 检查登录和 Station ID ---
    if (!STATION_ID) {
        alert('No station ID specified.');
        window.location.href = 'admin_dashboard.html';
        return;
    }
    // 填充隐藏的 station_id
    document.getElementById('station_id').value = STATION_ID;
    
    fetch('session_check_admin.php')
        .then(res => res.json())
        .then(data => {
            if (!data.logged_in) window.location.href = 'login-admin.html';
        })
        .catch(err => {
            alert('Session check failed: ' + err);
            window.location.href = 'login-admin.html';
        });

    // ============================
    // 核心函数：加载一个楼层的所
    // ============================
    function loadLevelDetails(levelId) {
        if (!levelId) return;
        CURRENT_LEVEL_ID = levelId;
        
        // 更新隐藏表单
        document.getElementById('level_id').value = levelId;
        
        fetch(`admin_api.php?action=get_level_details&level_id=${levelId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert('Error loading level details: ' + data.error);
                    return;
                }
                
                // 1. 更新标题和底图
                const levelInfo = data.level_info;
                levelNameTitle.textContent = `Edit Level: ${levelInfo.level_name}`;
                
                // 清理旧的 POI 和标记
                poiList.innerHTML = '';
                mapCanvas.querySelectorAll('.editor-poi').forEach(el => el.remove());
                
                if (levelInfo.background_image) {
                    const img = new Image();
                    img.onload = function() {
                        mapCanvas.style.aspectRatio = `${this.width} / ${this.height}`;
                        mapCanvas.style.minHeight = 'auto'; 
                        mapCanvas.style.backgroundImage = `url('${levelInfo.background_image}')`;
                    }
                    img.src = levelInfo.background_image;
                } else {
                    mapCanvas.style.backgroundImage = 'none';
                    mapCanvas.style.aspectRatio = '1000 / 540'; 
                    mapCanvas.style.minHeight = '540px';
                    mapCanvas.innerHTML = '<p style="text-align:center; padding-top: 50px;">No floor plan. Please upload one.</p>';
                }
                
                // 2. 绘制新的 POI
                data.pois.forEach(poi => {
                    drawPoiOnMap(poi);
                    addPoiToList(poi);
                });

                // 3. 重新添加 clickMarker
                mapCanvas.appendChild(clickMarker);
            })
            .catch(err => {
                alert('Fatal Error loading level details. Check API. ' + err);
            });
    }

    // --- 绘制函数 ---
    
    // 在地图上绘制一个红点
    function drawPoiOnMap(poi) {
        const poiEl = document.createElement('div');
        poiEl.className = 'editor-poi';
        
        const mapNaturalWidth = parseFloat(mapCanvas.style.aspectRatio.split(' / ')[0]) || 1000;
        const mapNaturalHeight = parseFloat(mapCanvas.style.aspectRatio.split(' / ')[1]) || 540;
        
        poiEl.style.left = `${(poi.x_coord / mapNaturalWidth) * 100}%`;
        poiEl.style.top = `${(poi.y_coord / mapNaturalHeight) * 100}%`;
        
        poiEl.title = `${poi.name} (ID: ${poi.poi_id_string}) \nCoords: ${poi.x_coord}, ${poi.y_coord}`;
        poiEl.dataset.poiId = poi.id;
        mapCanvas.appendChild(poiEl);
    }
    
    // 在右侧列表中添加一个条目
    function addPoiToList(poi) {
        const li = document.createElement('li');
        li.dataset.poiId = poi.id;
        li.innerHTML = `
            <span><strong>${poi.name}</strong> (${poi.type})</span>
            <button class="delete-btn" data-id="${poi.id}">Delete</button>
        `;
        poiList.appendChild(li);
    }
    
    // --- 加载初始数据 (楼层标签) ---
    function loadLevelTabs() {
        fetch(`admin_api.php?action=get_station_levels&station_id=${STATION_ID}`)
            .then(res => res.json())
            .then(data => { // 'data' now contains {station_name: "...", levels: []}
                if (data.error) {
                    alert('Error loading station data: ' + data.error);
                    return;
                }

                stationNameTitle.textContent = `Manage Station: ${data.station_name}`;
                
                const levels = data.levels;

                if (levels.length === 0) {
                    levelTabs.innerHTML = "<p>No levels found. Add one below.</p>";
                    document.getElementById('poiForm').style.display = 'none';
                    levelNameTitle.textContent = 'No levels exist for this station.';
                    mapCanvas.innerHTML = '<p style="text-align:center; padding-top: 50px;">Please add a level on the right to begin.</p>';
                    return;
                }
                
                document.getElementById('poiForm').style.display = 'flex';
                
                levelTabs.innerHTML = '';
                levels.forEach((level, index) => {
                    const tab = document.createElement('button');
                    tab.className = 'btn tab';
                    tab.dataset.levelId = level.id;
                    tab.textContent = level.level_name;
                    
                    if (index === 0) {
                        tab.classList.add('active');
                        loadLevelDetails(level.id); 
                    }
                    levelTabs.appendChild(tab);
                });
            })
            .catch(err => {
                // 【【【 修复：添加了 CATCH 块 】】】
                alert('Fatal Error loading station/levels. Check API. ' + err);
                stationNameTitle.textContent = 'Error loading station.';
                levelTabs.innerHTML = `<p style="color:red;">Failed to load levels.</p>`;
            });
    }
    
    // 立即加载楼层标签
    loadLevelTabs();


    // ============================
    // 事件监听器
    // ============================
    
    // 1. 【【【 核心：点击地图获取坐标 】】】
    mapCanvas.addEventListener('click', (e) => {
        if (e.target.classList.contains('editor-poi')) return;
        
        const rect = mapCanvas.getBoundingClientRect(); 
        const xPercent = (e.clientX - rect.left) / rect.width;
        const yPercent = (e.clientY - rect.top) / rect.height;
        
        const aspectRatio = mapCanvas.style.aspectRatio;
        let naturalWidth = 1000;
        let naturalHeight = 540;
        
        if (aspectRatio && aspectRatio.includes(' / ')) {
             const parts = aspectRatio.split(' / ');
             naturalWidth = parseFloat(parts[0]) || 1000;
             naturalHeight = parseFloat(parts[1]) || 540;
        }
        
        const x = Math.round(xPercent * naturalWidth);
        const y = Math.round(yPercent * naturalHeight);

        document.getElementById('x_coord').value = x;
        document.getElementById('y_coord').value = y;
        coordDisplay.textContent = `X: ${x}, Y: ${y}`;
        
        clickMarker.style.left = `${xPercent * 100}%`;
        clickMarker.style.top = `${yPercent * 100}%`;
        clickMarker.style.display = 'block';
    });

    // 2. 切换楼层
    levelTabs.addEventListener('click', (e) => {
        const tab = e.target.closest('[data-level-id]');
        if (!tab) return;
        const levelId = tab.dataset.levelId;
        levelTabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        loadLevelDetails(levelId);
    });
    
    // 3. 提交 POI 表单
    poiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(poiForm);
        formData.append('action', 'add_poi');
        
        fetch('admin_api.php', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('POI added!');
                const newPoi = {
                    id: data.id,
                    level_id: formData.get('level_id'),
                    poi_id_string: formData.get('poi_id_string'),
                    name: formData.get('name'),
                    type: formData.get('type'),
                    x_coord: formData.get('x_coord'),
                    y_coord: formData.get('y_coord')
                };
                drawPoiOnMap(newPoi);
                addPoiToList(newPoi);
                poiForm.reset();
                coordDisplay.textContent = 'Click map...';
                clickMarker.style.display = 'none';
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(err => {
            alert('Fatal Error saving POI: ' + err);
        });
    });
    
    // 4. 点击删除 POI
    poiList.addEventListener('click', (e) => {
        if (!e.target.classList.contains('delete-btn')) return;
        
        const btn = e.target;
        const poiId = btn.dataset.id;
        const li = btn.closest('li');
        
        if (!confirm(`Are you sure you want to delete this POI? (ID: ${poiId})`)) {
            return;
        }
        
        fetch('admin_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ action: 'delete_poi', poi_id: poiId })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                li.remove();
                const poiEl = mapCanvas.querySelector(`.editor-poi[data-poi-id="${poiId}"]`);
                if (poiEl) poiEl.remove();
            } else {
                alert('Error: ' + data.error); // <-- 修复了这里的拼写错误
            }
        })
        .catch(err => {
            alert('Fatal Error deleting POI: ' + err);
        });
    });
    
    // 5. 上传底图
    floorplanUploader.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('floorplanFile');
        if (fileInput.files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }
        
        const formData = new FormData();
        formData.append('action', 'upload_floorplan');
        formData.append('level_id', CURRENT_LEVEL_ID);
        formData.append('floorplan', fileInput.files[0]);
        
        fetch('admin_api.php', {
            method: 'POST',
            body: formData 
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Floor plan uploaded!');
                const newImageUrl = `${data.path}?t=${new Date().getTime()}`;
                
                const img = new Image();
                img.onload = function() {
                    mapCanvas.style.aspectRatio = `${this.width} / ${this.height}`;
                    mapCanvas.style.minHeight = 'auto';
                    mapCanvas.style.backgroundImage = `url('${newImageUrl}')`;
                }
                img.src = newImageUrl;
                
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(err => {
            alert('Fatal Error uploading file: ' + err);
        });
    });

    // 6. 添加新楼层
    addLevelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const levelName = document.getElementById('newLevelName').value;
        
        fetch('admin_api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'add_level',
                station_id: STATION_ID,
                level_name: levelName
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Level added!');
                loadLevelTabs(); // 重新加载楼层标签
                document.getElementById('newLevelName').value = '';
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(err => {
            alert('Fatal Error adding level: ' + err);
        });
    });
    
});