/**
 * 阿里大环线离线路书助手 - 主应用逻辑
 * Mobile-first H5, 离线优先, 微信兼容
 */
(function() {
  'use strict';

  const U = Utils;
  let currentTab = 'today';
  let currentDayIndex = 0;

  // ========================================
  // 初始化
  // ========================================
  function init() {
    currentDayIndex = U.date.getTripDay();
    loadSettings();
    renderApp();
    bindNavigation();
    bindGlobalEvents();
    showToday();
    checkWechat();
  }

  // ========================================
  // 加载/保存设置
  // ========================================
  function loadSettings() {
    window.appSettings = U.store.get('ali_settings_v3', { peopleCount: 2 });
  }

  function saveSettings() {
    U.store.set('ali_settings_v3', window.appSettings);
  }

  // ========================================
  // 渲染应用框架
  // ========================================
  function renderApp() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <header class="app-header">
        <div class="header-top">
          <h1 class="app-title">🏔️ 阿里大环线路书</h1>
          <span class="header-badge offline-badge" id="offlineBadge">📴 离线可用</span>
        </div>
        ${renderTripProgress()}
      </header>

      <nav class="tab-nav" id="tabNav">
        <button class="tab-btn active" data-tab="today">🏠 今日</button>
        <button class="tab-btn" data-tab="trip">📋 行程</button>
        <button class="tab-btn" data-tab="kora">🏔️ 转山</button>
        <button class="tab-btn" data-tab="checklist">✅ 准备</button>
        <button class="tab-btn" data-tab="altitude">📊 海拔</button>
        <button class="tab-btn" data-tab="expense">💰 记账</button>
        <button class="tab-btn" data-tab="maps">🗺️ 地图</button>
        <button class="tab-btn" data-tab="emergency">🆘 应急</button>
      </nav>

      <main class="app-main" id="mainContent"></main>

      <div class="wechat-tip" id="wechatTip" style="display:none">
        <span>📱 当前在微信内打开。核心行程可离线查看，建议出发前<span class="highlight">导出备份</span>并保存地图图片到手机相册。</span>
      </div>
    `;
  }

  function renderTripProgress() {
    const day = TRIP_DATA[currentDayIndex];
    const total = 16;
    const pct = Math.round((day.day / total) * 100);
    return `
      <div class="trip-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%"></div>
        </div>
        <span class="progress-text">${day.date} · Day ${day.day}/${total} · ${day.title}</span>
      </div>
    `;
  }

  // ========================================
  // 微信检测
  // ========================================
  function checkWechat() {
    if (U.isWechat) {
      document.getElementById('wechatTip').style.display = 'block';
    }
  }

  // ========================================
  // 导航绑定
  // ========================================
  function bindNavigation() {
    document.getElementById('tabNav').addEventListener('click', function(e) {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  }

  function bindGlobalEvents() {
    // 离线/在线状态
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
  }

  function updateOnlineStatus() {
    const badge = document.getElementById('offlineBadge');
    if (!badge) return;
    if (navigator.onLine) {
      badge.textContent = '🌐 在线';
      badge.className = 'header-badge online-badge';
    } else {
      badge.textContent = '📴 离线可用';
      badge.className = 'header-badge offline-badge';
    }
  }

  // ========================================
  // Tab 切换
  // ========================================
  function switchTab(tab) {
    currentTab = tab;
    // 更新导航按钮状态
    const btns = document.querySelectorAll('.tab-btn');
    btns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
    // 滚动到可见
    const activeBtn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
    if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

    // 根据 tab 渲染内容
    const main = document.getElementById('mainContent');
    switch (tab) {
      case 'today': main.innerHTML = renderToday(); break;
      case 'trip': main.innerHTML = renderTrip(); break;
      case 'kora': main.innerHTML = renderKora(); break;
      case 'checklist': main.innerHTML = renderChecklist(); break;
      case 'altitude': main.innerHTML = renderAltitude(); break;
      case 'expense': main.innerHTML = renderExpense(); break;
      case 'maps': main.innerHTML = renderMaps(); break;
      case 'emergency': main.innerHTML = renderEmergency(); break;
    }

    // 绑定各 tab 的事件
    bindTabEvents(tab);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindTabEvents(tab) {
    switch (tab) {
      case 'today': bindTodayEvents(); break;
      case 'trip': bindTripEvents(); break;
      case 'kora': bindKoraEvents(); break;
      case 'checklist': bindChecklistEvents(); break;
      case 'altitude': bindAltitudeEvents(); break;
      case 'expense': bindExpenseEvents(); break;
      case 'maps': bindMapsEvents(); break;
      case 'emergency': bindEmergencyEvents(); break;
    }
  }

  // ========================================
  // 1. 今日模块
  // ========================================
  function showToday() {
    const main = document.getElementById('mainContent');
    if (!main) return;
    main.innerHTML = renderToday();
    bindTodayEvents();
  }

  function renderToday() {
    const day = TRIP_DATA[currentDayIndex];
    const riskColor = U.riskLevel.color(day.riskLevel);
    const riskBg = U.riskLevel.bg(day.riskLevel);
    const riskBorder = U.riskLevel.border(day.riskLevel);

    // 计算完成状态
    const completed = U.store.get('ali_completed_days_v3', []);
    const isCompleted = completed.includes(day.id);

    let html = `
      <div class="today-page">
        <div class="today-card ${isCompleted ? 'completed' : ''}" style="border-left:4px solid ${riskBorder};">
          <div class="today-header" style="background:${riskBg};">
            <div class="today-date-row">
              <span class="today-date">📅 ${day.date}</span>
              <span class="today-day">Day ${day.day} / 16</span>
            </div>
            <h2 class="today-title">${isCompleted ? '✅ ' : ''}${day.title}</h2>
            <div class="today-badges">
              <span class="risk-badge" style="background:${riskColor};color:#fff;">${U.riskLevel.label(day.riskLevel)}</span>
              <span class="type-badge">${getTypeLabel(day.type)}</span>
            </div>
          </div>

          <div class="today-body">
            <div class="info-row">
              <span class="info-icon">📍</span>
              <span class="info-label">路线</span>
              <span class="info-value">${day.route}</span>
            </div>
            <div class="info-row">
              <span class="info-icon">📏</span>
              <span class="info-label">距离</span>
              <span class="info-value">${day.distance}</span>
            </div>
            <div class="info-row">
              <span class="info-icon">⏱️</span>
              <span class="info-label">用时</span>
              <span class="info-value">${day.duration}</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🚩</span>
              <span class="info-label">建议出发</span>
              <span class="info-value highlight">${day.startTime}</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🏨</span>
              <span class="info-label">住宿</span>
              <span class="info-value">${day.sleepPlace}</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🏔️</span>
              <span class="info-label">住宿海拔</span>
              <span class="info-value" style="color:${getAltitudeColor(day.sleepAltitude)}">${day.sleepAltitude} m</span>
            </div>
            <div class="info-row">
              <span class="info-icon">🔺</span>
              <span class="info-label">最高海拔</span>
              <span class="info-value ${day.maxAltitude >= 5000 ? 'altitude-warn' : ''}" style="color:${getAltitudeColor(day.maxAltitude)}">${day.maxAltitude} m</span>
            </div>
          </div>

          <div class="today-risks" style="border-top:1px solid ${riskBorder};">
            <h4>⚠️ 主要风险</h4>
            <ul class="risk-list">
              ${day.risks.map(r => `<li>⚠ ${r}</li>`).join('')}
            </ul>
          </div>

          <div class="today-must-do">
            <h4>✅ 今日必须做</h4>
            <ul>
              ${day.mustDo.map(m => `<li>${m}</li>`).join('')}
            </ul>
          </div>

          <div class="today-avoid">
            <h4>❌ 今日不要做</h4>
            <ul>
              ${day.avoid.map(a => `<li>${a}</li>`).join('')}
            </ul>
          </div>

          <div class="today-clothing">
            <h4>👔 穿衣建议</h4>
            <p>${day.clothing}</p>
          </div>

          <div class="today-fuel">
            <h4>⛽ 加油/补给</h4>
            <p>${day.fuelReminder}</p>
          </div>

          ${day.photoSpot ? `
          <div class="today-photo">
            <h4>📸 拍照点</h4>
            <p>${day.photoSpot}</p>
          </div>` : ''}

          ${day.backupPlan ? `
          <div class="today-backup">
            <h4>🔄 备用方案</h4>
            <p>${day.backupPlan}</p>
          </div>` : ''}
        </div>

        <div class="today-actions">
          <button class="btn btn-primary" id="btnToggleComplete" style="width:100%">
            ${isCompleted ? '↩️ 取消完成标记' : '✅ 标记今日完成'}
          </button>
          <div class="btn-row">
            <button class="btn btn-secondary" id="btnCopyToday">📋 复制今日行程</button>
            <button class="btn btn-secondary" id="btnPrevDay">◀ 前一天</button>
            <button class="btn btn-secondary" id="btnNextDay">后一天 ▶</button>
          </div>
          <div class="btn-row">
            <button class="btn btn-outline" id="btnGoEmergency">🆘 打开应急助手</button>
            <button class="btn btn-outline" id="btnGoChecklist">✅ 出发前检查</button>
          </div>
        </div>
      </div>
    `;
    return html;
  }

  function bindTodayEvents() {
    const btnCopy = document.getElementById('btnCopyToday');
    if (btnCopy) {
      btnCopy.addEventListener('click', copyTodayText);
    }
    const btnPrev = document.getElementById('btnPrevDay');
    if (btnPrev) {
      btnPrev.addEventListener('click', function() {
        if (currentDayIndex > 0) {
          currentDayIndex--;
          showToday();
        } else {
          U.toast('已是第一天');
        }
      });
    }
    const btnNext = document.getElementById('btnNextDay');
    if (btnNext) {
      btnNext.addEventListener('click', function() {
        if (currentDayIndex < TRIP_DATA.length - 1) {
          currentDayIndex++;
          showToday();
        } else {
          U.toast('已是最后一天');
        }
      });
    }
    const btnComplete = document.getElementById('btnToggleComplete');
    if (btnComplete) {
      btnComplete.addEventListener('click', toggleCompleteDay);
    }
    const btnEmergency = document.getElementById('btnGoEmergency');
    if (btnEmergency) {
      btnEmergency.addEventListener('click', function() { switchTab('emergency'); });
    }
    const btnChecklist = document.getElementById('btnGoChecklist');
    if (btnChecklist) {
      btnChecklist.addEventListener('click', function() { switchTab('checklist'); });
    }
  }

  function copyTodayText() {
    const day = TRIP_DATA[currentDayIndex];
    const text = `📅 ${day.date} · Day ${day.day}/16\n📍 ${day.title}\n━━━━━━━━━━━━\n📍 路线：${day.route}\n📏 距离：${day.distance}\n⏱️ 用时：${day.duration}\n🚩 出发：${day.startTime}\n🏨 住宿：${day.sleepPlace}（${day.sleepAltitude}m）\n🔺 最高海拔：${day.maxAltitude}m\n⚠️ 风险：${U.riskLevel.label(day.riskLevel)} — ${day.risks.join('、')}\n👔 穿衣：${day.clothing}\n✅ 必做：${day.mustDo.join('；')}\n❌ 不要：${day.avoid.join('；')}`;
    U.copyToClipboard(text).then(function(ok) {
      U.toast(ok ? '✅ 已复制！可粘贴到微信' : '❌ 复制失败，请手动选择文本');
    });
  }

  function toggleCompleteDay() {
    const day = TRIP_DATA[currentDayIndex];
    let completed = U.store.get('ali_completed_days_v3', []);
    const idx = completed.indexOf(day.id);
    if (idx >= 0) {
      completed.splice(idx, 1);
    } else {
      completed.push(day.id);
    }
    U.store.set('ali_completed_days_v3', completed);
    showToday();
  }

  // ========================================
  // 2. 行程模块
  // ========================================
  function renderTrip() {
    const completed = U.store.get('ali_completed_days_v3', []);
    let html = '<div class="trip-page"><h2 class="page-title">📋 全程 16 天行程</h2>';

    html += `<div class="trip-actions-top">
      <button class="btn btn-sm btn-outline" id="btnTripExpandAll">📖 展开全部</button>
      <button class="btn btn-sm btn-outline" id="btnTripCollapseAll">📕 收起全部</button>
      <button class="btn btn-sm btn-outline" id="btnTripGoToday">📍 回到今天</button>
    </div>`;

    TRIP_DATA.forEach(function(day, index) {
      const isCompleted = completed.includes(day.id);
      const riskColor = U.riskLevel.color(day.riskLevel);
      const isToday = (index === currentDayIndex);

      html += `
        <div class="trip-card ${isCompleted ? 'completed' : ''} ${isToday ? 'today-marker' : ''}" id="tripCard${index}">
          <div class="trip-card-header" data-index="${index}" style="border-left:4px solid ${riskColor};">
            <div class="trip-card-summary">
              <span class="trip-day-badge">Day ${day.day}</span>
              <span class="trip-date">${day.date}</span>
              <span class="trip-type">${getTypeLabel(day.type)}</span>
              ${isToday ? '<span class="today-indicator">📍 今天</span>' : ''}
              ${isCompleted ? '<span class="completed-indicator">✅</span>' : ''}
            </div>
            <div class="trip-card-title-row">
              <span class="trip-card-title">${day.title}</span>
              <span class="risk-badge-sm" style="background:${riskColor};color:#fff;">${U.riskLevel.label(day.riskLevel)}</span>
            </div>
            <div class="trip-card-route">📍 ${day.route}</div>
            <div class="trip-card-quick">
              <span>📏 ${day.distance}</span>
              <span>⏱️ ${day.duration}</span>
              <span>🏨 ${day.sleepAltitude}m</span>
              <span>🔺 ${day.maxAltitude}m</span>
              <span class="toggle-hint">展开 ▼</span>
            </div>
          </div>
          <div class="trip-card-body" style="display:none;">
            ${renderTripDetail(day)}
            <div class="trip-card-actions">
              <button class="btn btn-sm btn-primary mark-done-btn" data-day-id="${day.id}">
                ${isCompleted ? '↩️ 取消完成' : '✅ 标记完成'}
              </button>
              <button class="btn btn-sm btn-outline show-today-btn" data-index="${index}">📍 设为今日查看</button>
              <button class="btn btn-sm btn-outline copy-day-btn" data-index="${index}">📋 复制行程</button>
            </div>
            <div class="trip-notes-editor">
              <label>📝 备注：</label>
              <textarea class="notes-input" data-day-id="${day.id}" placeholder="添加你的备注...">${getDayNote(day.id)}</textarea>
              <button class="btn btn-sm btn-outline save-note-btn" data-day-id="${day.id}">💾 保存备注</button>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  }

  function renderTripDetail(day) {
    return `
      <table class="detail-table">
        <tr><td class="dt-label">路线</td><td>${day.route}</td></tr>
        <tr><td class="dt-label">距离</td><td>${day.distance}</td></tr>
        <tr><td class="dt-label">用时</td><td>${day.duration}</td></tr>
        <tr><td class="dt-label">出发</td><td><strong>${day.startTime}</strong></td></tr>
        <tr><td class="dt-label">住宿</td><td>${day.sleepPlace}</td></tr>
        <tr><td class="dt-label">住宿海拔</td><td style="color:${getAltitudeColor(day.sleepAltitude)}">${day.sleepAltitude} m</td></tr>
        <tr><td class="dt-label">最高海拔</td><td style="color:${getAltitudeColor(day.maxAltitude)}"><strong>${day.maxAltitude} m</strong></td></tr>
        <tr><td class="dt-label">风险</td><td>${day.risks.join('；')}</td></tr>
        <tr><td class="dt-label">必做</td><td>${day.mustDo.join('；')}</td></tr>
        <tr><td class="dt-label">不要</td><td>${day.avoid.join('；')}</td></tr>
        <tr><td class="dt-label">穿衣</td><td>${day.clothing}</td></tr>
        <tr><td class="dt-label">加油</td><td>${day.fuelReminder}</td></tr>
        ${day.photoSpot ? `<tr><td class="dt-label">拍照</td><td>${day.photoSpot}</td></tr>` : ''}
        ${day.backupPlan ? `<tr><td class="dt-label">备用</td><td>${day.backupPlan}</td></tr>` : ''}
      </table>
    `;
  }

  function getDayNote(dayId) {
    const notes = U.store.get('ali_trip_v3', {});
    return notes[dayId] || '';
  }

  function saveDayNote(dayId, note) {
    const notes = U.store.get('ali_trip_v3', {});
    notes[dayId] = note;
    U.store.set('ali_trip_v3', notes);
    U.toast('✅ 备注已保存');
  }

  function bindTripEvents() {
    // 展开/折叠卡片
    document.querySelectorAll('.trip-card-header').forEach(function(header) {
      header.addEventListener('click', function() {
        const body = header.nextElementSibling;
        if (body) {
          const isHidden = body.style.display === 'none';
          body.style.display = isHidden ? 'block' : 'none';
          header.querySelector('.toggle-hint').textContent = isHidden ? '收起 ▲' : '展开 ▼';
        }
      });
    });

    // 展开全部
    const expandBtn = document.getElementById('btnTripExpandAll');
    if (expandBtn) {
      expandBtn.addEventListener('click', function() {
        document.querySelectorAll('.trip-card-body').forEach(function(b) { b.style.display = 'block'; });
        document.querySelectorAll('.toggle-hint').forEach(function(h) { h.textContent = '收起 ▲'; });
      });
    }

    // 收起全部
    const collapseBtn = document.getElementById('btnTripCollapseAll');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', function() {
        document.querySelectorAll('.trip-card-body').forEach(function(b) { b.style.display = 'none'; });
        document.querySelectorAll('.toggle-hint').forEach(function(h) { h.textContent = '展开 ▼'; });
      });
    }

    // 回到今天
    const todayBtn = document.getElementById('btnTripGoToday');
    if (todayBtn) {
      todayBtn.addEventListener('click', function() {
        const card = document.getElementById('tripCard' + currentDayIndex);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const body = card.querySelector('.trip-card-body');
          if (body) body.style.display = 'block';
        }
      });
    }

    // 标记完成
    document.querySelectorAll('.mark-done-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const dayId = btn.dataset.dayId;
        let completed = U.store.get('ali_completed_days_v3', []);
        const idx = completed.indexOf(dayId);
        if (idx >= 0) completed.splice(idx, 1);
        else completed.push(dayId);
        U.store.set('ali_completed_days_v3', completed);
        switchTab('trip'); // 刷新行程视图
      });
    });

    // 设为今日
    document.querySelectorAll('.show-today-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentDayIndex = parseInt(btn.dataset.index, 10);
        switchTab('today');
      });
    });

    // 复制行程
    document.querySelectorAll('.copy-day-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.index, 10);
        const day = TRIP_DATA[idx];
        const text = `📅 ${day.date} Day ${day.day}\n📍 ${day.title}\n路线：${day.route}\n距离：${day.distance} | 用时：${day.duration}\n住宿：${day.sleepPlace}（${day.sleepAltitude}m）\n最高海拔：${day.maxAltitude}m | 风险：${U.riskLevel.label(day.riskLevel)}`;
        U.copyToClipboard(text).then(function(ok) {
          U.toast(ok ? '✅ 已复制' : '❌ 复制失败');
        });
      });
    });

    // 保存备注
    document.querySelectorAll('.save-note-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const dayId = btn.dataset.dayId;
        const textarea = document.querySelector('.notes-input[data-day-id="' + dayId + '"]');
        if (textarea) saveDayNote(dayId, textarea.value);
      });
    });
  }

  // ========================================
  // 3. 冈仁波齐转山模块
  // ========================================
  function renderKora() {
    const kd = KORA_DATA;
    const ov = kd.overview;
    const koraCheck = U.store.get('ali_kora_checklist_v3', {});

    let html = '<div class="kora-page"><h2 class="page-title">🏔️ 冈仁波齐转山</h2>';

    // 总览
    html += `
      <div class="kora-overview-card">
        <h3>${ov.title}</h3>
        <p class="kora-desc">${ov.description}</p>
        <table class="detail-table">
          <tr><td class="dt-label">方式</td><td>${ov.type}</td></tr>
          <tr><td class="dt-label">天数</td><td>${ov.suggestedDays}</td></tr>
          <tr><td class="dt-label">总距离</td><td>${ov.totalDistance}</td></tr>
          <tr><td class="dt-label">最高点</td><td style="color:#c0392b;"><strong>${ov.highestPoint}</strong></td></tr>
          <tr><td class="dt-label">起终点</td><td>${ov.startEnd}</td></tr>
          <tr><td class="dt-label">风险</td><td>${ov.risks.join('；')}</td></tr>
        </table>
      </div>
    `;

    // 三天详情
    kd.days.forEach(function(day, idx) {
      const isHardest = idx === 1;
      html += `
        <div class="kora-day-card ${isHardest ? 'kora-hardest' : ''}">
          <div class="kora-day-header">
            <h3>${isHardest ? '⚠️ ' : ''}${day.day}：${day.title}</h3>
            ${isHardest ? '<div class="hardest-banner">⚠️ 全程最难的一天！请务必仔细阅读</div>' : ''}
          </div>
          <table class="detail-table">
            <tr><td class="dt-label">距离</td><td>${day.distance}</td></tr>
            <tr><td class="dt-label">用时</td><td>${day.duration}</td></tr>
            <tr><td class="dt-label">住宿</td><td>${day.sleepPlace}（${day.sleepAltitude}m）</td></tr>
            <tr><td class="dt-label">最高海拔</td><td style="color:${getAltitudeColor(day.maxAltitude)}"><strong>${day.maxAltitude} m</strong></td></tr>
            <tr><td class="dt-label">补给</td><td>${day.supplies}</td></tr>
            <tr><td class="dt-label">风险</td><td style="color:#c0392b;">${day.risks.join('；')}</td></tr>
            <tr><td class="dt-label">装备</td><td>${day.gear.join('、')}</td></tr>
          </table>
          <div class="kora-notes">
            <h4>📌 注意事项</h4>
            <ul>${day.notes.map(n => `<li>${n}</li>`).join('')}</ul>
          </div>
        </div>
      `;
    });

    // 转山装备 CheckList
    html += `
      <div class="kora-gear-section">
        <h3>🎒 转山装备检查</h3>
        <div class="kora-gear-progress">
          <div class="gear-progress-bar">
            <div class="gear-progress-fill" id="koraGearProgress" style="width:0%"></div>
          </div>
          <span id="koraGearText">0/${kd.gearChecklist.length}</span>
        </div>
        <div class="checklist-items">
          ${kd.gearChecklist.map(g => `
            <label class="checklist-item" data-cid="${g.id}">
              <input type="checkbox" ${koraCheck[g.id] ? 'checked' : ''} data-cid="${g.id}" class="kora-check">
              <span class="check-label ${g.required ? 'required' : ''}">${g.required ? '🔴' : '⚪'} ${g.name}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    // 下撤判断
    const dw = kd.descentWarning;
    html += `
      <div class="kora-descent card-danger">
        <h3>🆘 ${dw.title}</h3>
        <p>${dw.intro}</p>
        <ul class="descent-symptoms">
          ${dw.symptoms.map(s => `<li><label><input type="checkbox" class="descent-check"> ${s}</label></li>`).join('')}
        </ul>
        <div class="descent-action" id="descentAction" style="display:none;">
          <p><strong>⚠️ ${dw.action}</strong></p>
        </div>
      </div>
    `;

    html += '</div>';
    return html;
  }

  function bindKoraEvents() {
    // 转山装备勾选
    document.querySelectorAll('.kora-check').forEach(function(cb) {
      cb.addEventListener('change', updateKoraGearProgress);
    });
    updateKoraGearProgress();

    // 下撤症状判断
    document.querySelectorAll('.descent-check').forEach(function(cb) {
      cb.addEventListener('change', function() {
        const anyChecked = document.querySelectorAll('.descent-check:checked').length > 0;
        document.getElementById('descentAction').style.display = anyChecked ? 'block' : 'none';
      });
    });
  }

  function updateKoraGearProgress() {
    const checks = document.querySelectorAll('.kora-check');
    const koraCheck = {};
    let count = 0;
    checks.forEach(function(cb) {
      koraCheck[cb.dataset.cid] = cb.checked;
      if (cb.checked) count++;
    });
    U.store.set('ali_kora_checklist_v3', koraCheck);
    const pct = checks.length ? Math.round((count / checks.length) * 100) : 0;
    const fill = document.getElementById('koraGearProgress');
    const text = document.getElementById('koraGearText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = count + '/' + checks.length;
  }

  // ========================================
  // 4. CheckList 准备模块
  // ========================================
  function renderChecklist() {
    const saved = U.store.get('ali_checklist_v3', {});
    const mode = currentChecklistMode || 'category';

    let html = '<div class="checklist-page"><h2 class="page-title">✅ 出发准备清单</h2>';

    // 模式切换
    html += `
      <div class="mode-switch">
        <button class="btn ${mode === 'category' ? 'btn-primary' : 'btn-outline'} mode-btn" data-mode="category">📂 按类别</button>
        <button class="btn ${mode === 'scene' ? 'btn-primary' : 'btn-outline'} mode-btn" data-mode="scene">🔍 按场景</button>
      </div>
    `;

    if (mode === 'category') {
      // 按类别
      CHECKLIST_DATA.byCategory.forEach(function(cat) {
        const total = cat.items.length;
        const checked = cat.items.filter(function(item) { return saved[item.id]; }).length;
        const pct = Math.round((checked / total) * 100);

        html += `
          <div class="checklist-category">
            <div class="cat-header">
              <h3>${cat.category}</h3>
              <span class="cat-progress">${checked}/${total}</span>
            </div>
            <div class="cat-progress-bar"><div class="cat-progress-fill" style="width:${pct}%"></div></div>
            <div class="checklist-items">
              ${cat.items.map(item => `
                <label class="checklist-item">
                  <input type="checkbox" ${saved[item.id] ? 'checked' : ''} data-clid="${item.id}">
                  <span class="check-label ${item.required ? 'required' : ''}">${item.required ? '🔴' : '⚪'} ${item.name}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      });
    } else {
      // 按场景
      CHECKLIST_DATA.byScene.forEach(function(scene) {
        const total = scene.items.length;
        const checked = scene.items.filter(function(item) { return saved[item.id]; }).length;
        const pct = Math.round((checked / total) * 100);

        html += `
          <div class="checklist-category">
            <div class="cat-header">
              <h3>🔍 ${scene.scene}</h3>
              <span class="cat-progress">${checked}/${total}</span>
            </div>
            <div class="cat-progress-bar"><div class="cat-progress-fill" style="width:${pct}%"></div></div>
            <div class="checklist-items">
              ${scene.items.map(item => `
                <label class="checklist-item">
                  <input type="checkbox" ${saved[item.id] ? 'checked' : ''} data-clid="${item.id}">
                  <span class="check-label"><small>[${item.category}]</small> ${item.name}</span>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      });
    }

    // 自定义项目
    const customItems = U.store.get('ali_checklist_custom_v3', []);
    html += `
      <div class="checklist-category">
        <div class="cat-header"><h3>✏️ 自定义项目</h3></div>
        <div class="checklist-items" id="customItemsList">
          ${customItems.map(function(item, idx) {
            return `<label class="checklist-item">
              <input type="checkbox" ${saved[item.id] ? 'checked' : ''} data-clid="${item.id}">
              <span class="check-label">${item.name}</span>
              <button class="btn-del-item" data-custom-idx="${idx}" data-custom-id="${item.id}">🗑️</button>
            </label>`;
          }).join('')}
        </div>
        <div class="add-item-row">
          <input type="text" id="newItemInput" placeholder="添加自定义项目..." class="add-item-input">
          <button class="btn btn-primary btn-sm" id="btnAddItem">＋ 添加</button>
        </div>
      </div>
    `;

    // 操作按钮
    html += `
      <div class="btn-row checklist-actions">
        <button class="btn btn-outline" id="btnResetChecklist">🔄 全部重置</button>
        <button class="btn btn-outline" id="btnExportChecklist">📤 导出数据</button>
      </div>
    `;

    html += '</div>';
    return html;
  }

  function bindChecklistEvents() {
    // 勾选保存
    document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(function(cb) {
      cb.addEventListener('change', function() {
        const saved = U.store.get('ali_checklist_v3', {});
        saved[cb.dataset.clid] = cb.checked;
        U.store.set('ali_checklist_v3', saved);
        // 就地更新进度
        switchTab('checklist');
      });
    });

    // 模式切换
    document.querySelectorAll('.mode-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        currentChecklistMode = btn.dataset.mode;
        switchTab('checklist');
      });
    });

    // 添加自定义项目
    const addBtn = document.getElementById('btnAddItem');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        const input = document.getElementById('newItemInput');
        if (!input || !input.value.trim()) {
          U.toast('请输入项目名称');
          return;
        }
        const customItems = U.store.get('ali_checklist_custom_v3', []);
        const newItem = { id: 'custom_' + U.uid(), name: input.value.trim() };
        customItems.push(newItem);
        U.store.set('ali_checklist_custom_v3', customItems);
        input.value = '';
        switchTab('checklist');
      });
    }

    // 删除自定义项目
    document.querySelectorAll('.btn-del-item').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const customItems = U.store.get('ali_checklist_custom_v3', []);
        const idx = parseInt(btn.dataset.customIdx, 10);
        const id = btn.dataset.customId;
        customItems.splice(idx, 1);
        U.store.set('ali_checklist_custom_v3', customItems);
        const saved = U.store.get('ali_checklist_v3', {});
        delete saved[id];
        U.store.set('ali_checklist_v3', saved);
        switchTab('checklist');
      });
    });

    // 重置
    const resetBtn = document.getElementById('btnResetChecklist');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        if (confirm('确定要清除所有勾选状态吗？此操作不可恢复。')) {
          U.store.set('ali_checklist_v3', {});
          U.store.set('ali_kora_checklist_v3', {});
          switchTab('checklist');
          U.toast('已全部重置');
        }
      });
    }

    // 导出
    const exportBtn = document.getElementById('btnExportChecklist');
    if (exportBtn) {
      exportBtn.addEventListener('click', function() {
        const data = U.export.allJSON();
        downloadFile('阿里环线备份_' + U.date.today() + '.json', data, 'application/json');
        U.toast('✅ 备份已下载');
      });
    }
  }

  // ========================================
  // 5. 海拔风险图表
  // ========================================
  function renderAltitude() {
    let html = '<div class="altitude-page"><h2 class="page-title">📊 海拔风险分析</h2>';

    // Canvas chart
    html += `
      <div class="altitude-chart-container">
        <h3>🏔️ 16 天海拔曲线</h3>
        <div class="chart-legend">
          <span><span class="legend-dot" style="background:#3498db;"></span>住宿海拔</span>
          <span><span class="legend-dot" style="background:#e74c3c;"></span>最高海拔</span>
        </div>
        <canvas id="altitudeChart" width="700" height="350"></canvas>
        <div class="chart-zones">
          <span><span class="zone-box" style="background:#27ae60;"></span> <4000m 安全</span>
          <span><span class="zone-box" style="background:#f39c12;"></span> 4000–5000m 注意</span>
          <span><span class="zone-box" style="background:#e74c3c;"></span> >5000m 高风险</span>
        </div>
      </div>
    `;

    // 每日海拔详情表
    html += `
      <div class="altitude-table-wrapper">
        <h3>📋 每日海拔详情</h3>
        <div class="table-scroll">
          <table class="altitude-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>日期</th>
                <th>行程</th>
                <th>住宿海拔</th>
                <th>最高海拔</th>
                <th>风险</th>
                <th>翻垭口</th>
                <th>穿衣</th>
              </tr>
            </thead>
            <tbody>
              ${TRIP_DATA.map(function(day, i) {
                const hasPass = day.maxAltitude >= 4900;
                const riskLabel = U.riskLevel.label(day.riskLevel);
                const riskColor = U.riskLevel.color(day.riskLevel);
                return `
                  <tr style="background:${U.riskLevel.bg(day.riskLevel)};">
                    <td><strong>D${day.day}</strong></td>
                    <td>${day.date.slice(5)}</td>
                    <td class="td-title">${day.title}</td>
                    <td style="color:${getAltitudeColor(day.sleepAltitude)}">${day.sleepAltitude}m</td>
                    <td style="color:${getAltitudeColor(day.maxAltitude)}"><strong>${day.maxAltitude}m</strong></td>
                    <td><span style="color:${riskColor};font-weight:bold;">${riskLabel}</span></td>
                    <td>${hasPass ? '⚠️ 是' : '—'}</td>
                    <td class="td-small">${day.clothing.substring(0, 20)}...</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    // 离线天气经验
    html += `
      <div class="weather-note card-info">
        <h3>🌤️ 离线天气经验</h3>
        <p>${WEATHER_NOTES.general}</p>
        <div class="weather-by-day">
          ${Object.keys(WEATHER_NOTES.byDay).map(function(d) {
            return `<p><strong>Day ${d}：</strong>${WEATHER_NOTES.byDay[d]}</p>`;
          }).join('')}
        </div>
      </div>
    `;

    // 在线天气（可选的 iframe）
    html += `
      <div class="online-weather card-info" id="onlineWeather">
        <h3>🌐 在线天气（需网络）</h3>
        <div class="weather-links">
          <a href="https://www.windy.com/?30.000,85.000,8" target="_blank" class="btn btn-outline">🌬️ Windy 阿里地区</a>
          <a href="https://weather.com/zh-CN/weather/today/l/Ali+Xizang+China" target="_blank" class="btn btn-outline">🌡️ Weather.com</a>
        </div>
        <p class="offline-note">⚠️ 当前实时天气需要网络。无网络时请参考上方离线海拔风险、穿衣建议和当天实际情况。</p>
      </div>
    `;

    html += '</div>';
    return html;
  }

  function bindAltitudeEvents() {
    // 绘制图表
    setTimeout(drawAltitudeChart, 100);
  }

  function drawAltitudeChart() {
    const canvas = document.getElementById('altitudeChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.min(rect.width - 16, 680);
    const h = 300;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const data = ALTITUDE_DATA;
    const padding = { top: 30, right: 20, bottom: 40, left: 55 };
    const plotW = w - padding.left - padding.right;
    const plotH = h - padding.top - padding.bottom;

    // 背景风险分区
    // 绿色 <4000 | 黄色 4000-5000 | 红色 >5000
    const yScale = (val) => padding.top + plotH - ((val - 3000) / 3000) * plotH;
    const y4000 = yScale(4000);
    const y5000 = yScale(5000);

    ctx.fillStyle = 'rgba(39,174,96,0.08)';
    ctx.fillRect(padding.left, yScale(6000), plotW, y4000 - yScale(6000));
    ctx.fillStyle = 'rgba(243,156,18,0.08)';
    ctx.fillRect(padding.left, y4000, plotW, y5000 - y4000);
    ctx.fillStyle = 'rgba(231,76,60,0.1)';
    ctx.fillRect(padding.left, y5000, plotW, yScale(3000) - y5000);

    // 网格线
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    for (let alt = 3000; alt <= 6000; alt += 500) {
      const y = padding.top + plotH - ((alt - 3000) / 3000) * plotH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + plotW, y);
      ctx.stroke();

      ctx.fillStyle = '#999';
      ctx.font = '11px -apple-system,BlinkMacSystemFont,sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(alt + 'm', padding.left - 5, y + 4);
    }

    // X 轴
    for (let i = 0; i < data.days.length; i++) {
      const x = padding.left + (i / (data.days.length - 1)) * plotW;
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(data.days[i], x, h - padding.bottom + 18);
    }

    // 折线1：住宿海拔
    drawLine(ctx, data.days.map(function(_, i) {
      return {
        x: padding.left + (i / (data.days.length - 1)) * plotW,
        y: yScale(data.sleepAltitude[i])
      };
    }), '#3498db', 2);

    // 折线2：最高海拔
    drawLine(ctx, data.days.map(function(_, i) {
      return {
        x: padding.left + (i / (data.days.length - 1)) * plotW,
        y: yScale(data.maxAltitude[i])
      };
    }), '#e74c3c', 2);

    // 数据点
    data.sleepAltitude.forEach(function(alt, i) {
      const x = padding.left + (i / (data.days.length - 1)) * plotW;
      const y = yScale(alt);
      ctx.fillStyle = '#3498db';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    data.maxAltitude.forEach(function(alt, i) {
      const x = padding.left + (i / (data.days.length - 1)) * plotW;
      const y = yScale(alt);
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // D8 特殊标注
    const d8x = padding.left + (7 / 15) * plotW;
    const d8y = yScale(data.maxAltitude[7]);
    ctx.fillStyle = '#8b0000';
    ctx.font = 'bold 12px -apple-system,BlinkMacSystemFont,sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚠ D8 卓玛拉山口 5630m', d8x, d8y - 10);
  }

  function drawLine(ctx, points, color, width) {
    if (points.length < 2) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  }

  // ========================================
  // 6. 记账模块
  // ========================================
  function renderExpense() {
    const expenses = U.store.get('ali_expenses_v3', []);
    const ppCount = window.appSettings.peopleCount || 2;

    // 按天分组
    const grouped = {};
    expenses.forEach(function(e) {
      if (!grouped[e.date]) grouped[e.date] = [];
      grouped[e.date].push(e);
    });

    const dates = Object.keys(grouped).sort().reverse();
    const totalAll = expenses.reduce(function(sum, e) { return sum + Number(e.amount); }, 0);
    const perPerson = Math.round(totalAll / ppCount);

    let html = '<div class="expense-page"><h2 class="page-title">💰 简易记账</h2>';

    // 汇总卡片
    html += `
      <div class="expense-summary">
        <div class="summary-card">
          <span class="summary-label">全程合计</span>
          <span class="summary-value">¥${totalAll.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">人均（${ppCount}人）</span>
          <span class="summary-value">¥${perPerson.toLocaleString()}</span>
        </div>
        <div class="summary-card">
          <span class="summary-label">总笔数</span>
          <span class="summary-value">${expenses.length} 笔</span>
        </div>
      </div>
    `;

    // 添加支出表单
    html += `
      <div class="expense-form card">
        <h3>➕ 添加支出</h3>
        <div class="form-row">
          <label>日期</label>
          <input type="date" id="expDate" value="${U.date.today()}" class="form-input">
        </div>
        <div class="form-row">
          <label>分类</label>
          <select id="expCategory" class="form-input">
            <option value="住宿">🏨 住宿</option>
            <option value="餐饮">🍜 餐饮</option>
            <option value="油费">⛽ 油费</option>
            <option value="过路/停车">🚧 过路/停车</option>
            <option value="门票">🎫 门票</option>
            <option value="购物">🛍️ 购物</option>
            <option value="药品">💊 药品</option>
            <option value="装备">🎒 装备</option>
            <option value="其他">📦 其他</option>
          </select>
        </div>
        <div class="form-row">
          <label>金额 ¥</label>
          <input type="number" id="expAmount" placeholder="0" class="form-input" inputmode="decimal">
        </div>
        <div class="form-row">
          <label>支付人</label>
          <input type="text" id="expPayer" placeholder="我/队友名" class="form-input" value="我">
        </div>
        <div class="form-row">
          <label>备注</label>
          <input type="text" id="expNote" placeholder="简要说明..." class="form-input">
        </div>
        <button class="btn btn-primary" id="btnAddExpense" style="width:100%">✅ 添加支出</button>
      </div>
    `;

    // 设置人数
    html += `
      <div class="settings-row card">
        <label>👥 同行人数：</label>
        <select id="ppCount" class="form-input" style="width:auto;display:inline-block;">
          <option value="2" ${ppCount === 2 ? 'selected' : ''}>2 人</option>
          <option value="3" ${ppCount === 3 ? 'selected' : ''}>3 人</option>
          <option value="4" ${ppCount === 4 ? 'selected' : ''}>4 人</option>
        </select>
      </div>
    `;

    // 支出列表
    html += '<div class="expense-list"><h3>📋 支出明细</h3>';

    if (dates.length === 0) {
      html += '<p class="empty-state">暂无支出记录，旅途中随时添加 ✏️</p>';
    } else {
      dates.forEach(function(date) {
        const dayExpenses = grouped[date];
        const dayTotal = dayExpenses.reduce(function(sum, e) { return sum + Number(e.amount); }, 0);
        const tripDay = TRIP_DATA.find(function(d) { return d.date === date; });
        const dayLabel = tripDay ? 'Day ' + tripDay.day + ' ' + tripDay.title.split('→')[0].trim() : date;

        html += `<div class="expense-day-group">
          <div class="expense-day-header">
            <strong>📅 ${date} · ${dayLabel}</strong>
            <span>日计 ¥${dayTotal.toLocaleString()}</span>
          </div>`;

        dayExpenses.forEach(function(e, idx) {
          html += `
            <div class="expense-item">
              <span class="exp-cat">${e.category}</span>
              <span class="exp-amount">¥${Number(e.amount).toLocaleString()}</span>
              <span class="exp-payer">${e.payer || '—'}</span>
              <span class="exp-note">${e.note || ''}</span>
              <button class="btn-del-exp" data-exp-id="${e.id}">🗑️</button>
            </div>
          `;
        });

        html += '</div>';
      });
    }

    html += '</div>';

    // 导出按钮
    html += `
      <div class="btn-row expense-export">
        <button class="btn btn-outline" id="btnExportCSV">📊 导出 CSV</button>
        <button class="btn btn-outline" id="btnExportJSON">📋 导出 JSON</button>
        <button class="btn btn-outline btn-danger" id="btnClearExpenses">🗑️ 清除全部</button>
      </div>
    `;

    html += '</div>';
    return html;
  }

  function bindExpenseEvents() {
    // 添加支出
    const addBtn = document.getElementById('btnAddExpense');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        const date = document.getElementById('expDate').value;
        const category = document.getElementById('expCategory').value;
        const amount = parseFloat(document.getElementById('expAmount').value);
        const payer = document.getElementById('expPayer').value.trim();
        const note = document.getElementById('expNote').value.trim();

        if (!amount || amount <= 0) {
          U.toast('请输入有效金额');
          return;
        }

        const expense = {
          id: U.uid(),
          date: date,
          category: category,
          amount: amount,
          payer: payer || '我',
          note: note,
          createdAt: new Date().toISOString()
        };

        const expenses = U.store.get('ali_expenses_v3', []);
        expenses.push(expense);
        U.store.set('ali_expenses_v3', expenses);
        switchTab('expense'); // 刷新
        U.toast('✅ 已记录');
      });
    }

    // 人数变更
    const ppSelect = document.getElementById('ppCount');
    if (ppSelect) {
      ppSelect.addEventListener('change', function() {
        window.appSettings.peopleCount = parseInt(ppSelect.value, 10);
        saveSettings();
        switchTab('expense');
        U.toast('✅ 人数已更新');
      });
    }

    // 删除单条
    document.querySelectorAll('.btn-del-exp').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (!confirm('确定删除这条支出？')) return;
        const expId = btn.dataset.expId;
        const expenses = U.store.get('ali_expenses_v3', []);
        const updated = expenses.filter(function(e) { return e.id !== expId; });
        U.store.set('ali_expenses_v3', updated);
        switchTab('expense');
        U.toast('已删除');
      });
    });

    // 导出 CSV
    const csvBtn = document.getElementById('btnExportCSV');
    if (csvBtn) {
      csvBtn.addEventListener('click', function() {
        downloadFile('阿里环线记账_' + U.date.today() + '.csv', U.export.expensesCSV(), 'text/csv;charset=utf-8');
        U.toast('✅ CSV 已下载');
      });
    }

    // 导出 JSON
    const jsonBtn = document.getElementById('btnExportJSON');
    if (jsonBtn) {
      jsonBtn.addEventListener('click', function() {
        downloadFile('阿里环线备份_' + U.date.today() + '.json', U.export.allJSON(), 'application/json');
        U.toast('✅ 备份已下载');
      });
    }

    // 清除全部
    const clearBtn = document.getElementById('btnClearExpenses');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        if (confirm('⚠️ 确定要清除所有记账数据吗？此操作不可恢复！')) {
          U.store.set('ali_expenses_v3', []);
          switchTab('expense');
          U.toast('已清除全部记账数据');
        }
      });
    }
  }

  // ========================================
  // 7. 地图模块
  // ========================================
  function renderMaps() {
    const mapList = [
      { id: 'overview', name: '阿里大环线总览图', file: 'ali-loop-overview.jpg', desc: '查看完整的阿里大环线路线规划' },
      { id: 'kora', name: '冈仁波齐转山路线图', file: 'kailash-kora-map.jpg', desc: '转山三天路线、住宿点和关键位置' },
      { id: 'day03', name: 'Day 3 拉萨—羊湖—日喀则', file: 'day03-lhasa-shigatse.jpg', desc: '羊湖路线、岗巴拉山口' },
      { id: 'day05', name: 'Day 5 萨嘎—玛旁雍错—塔钦', file: 'day05-saga-darchen.jpg', desc: '玛旁雍错、拉昂错、冈仁波齐远眺点' },
      { id: 'day07', name: 'Day 7 转山 D1', file: 'day07-kora-d1.jpg', desc: '塔钦→止热寺路线' },
      { id: 'day08', name: 'Day 8 转山 D2（最艰难）', file: 'day08-kora-d2.jpg', desc: '卓玛拉山口路线' },
      { id: 'day09', name: 'Day 9 转山 D3', file: 'day09-kora-d3.jpg', desc: '祖楚寺→塔钦路线' }
    ];

    let html = '<div class="maps-page"><h2 class="page-title">🗺️ 离线地图资料</h2>';

    html += `
      <div class="maps-notice card-info">
        <p>📌 <strong>使用提示：</strong></p>
        <ul>
          <li>地图为静态图片，适合弱网/离线环境</li>
          <li>点击可放大查看，双指可缩放</li>
          <li><strong>建议出发前长按保存到手机相册</strong></li>
          <li>请配合下载高德/百度离线地图包使用</li>
        </ul>
      </div>
    `;

    html += '<div class="maps-list">';

    mapList.forEach(function(map) {
      html += `
        <div class="map-card" id="mapCard_${map.id}">
          <h4>${map.name}</h4>
          <p class="map-desc">${map.desc}</p>
          <div class="map-img-container" id="mapImgContainer_${map.id}">
            <img
              src="maps/${map.file}"
              alt="${map.name}"
              class="map-img"
              id="mapImg_${map.id}"
              loading="lazy"
              onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
            >
            <div class="map-placeholder" style="display:none;">
              <span>🗺️</span>
              <p>地图图片尚未添加</p>
              <small>请将 ${map.file} 放入 maps/ 文件夹</small>
            </div>
          </div>
          <button class="btn btn-sm btn-outline btn-view-map" data-map-id="${map.id}">🔍 查看大图</button>
        </div>
      `;
    });

    html += '</div>';

    // 应急截图
    html += `
      <div class="maps-emergency card-info">
        <h3>🆘 应急信息截图</h3>
        <p>建议出发前截图保存以下信息到手机相册：</p>
        <ul>
          <li>沿途医院地址和电话</li>
          <li>租车/保险公司电话</li>
          <li>报警电话和报警信息模板</li>
          <li>关键路线 GPS 坐标</li>
        </ul>
      </div>
    `;

    html += '</div>';
    return html;
  }

  function bindMapsEvents() {
    // 查看大图（全屏预览）
    document.querySelectorAll('.btn-view-map').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const mapId = btn.dataset.mapId;
        const img = document.getElementById('mapImg_' + mapId);
        if (!img || img.style.display === 'none') {
          U.toast('地图图片尚未添加');
          return;
        }

        // 简易全屏预览
        let overlay = document.getElementById('mapOverlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.id = 'mapOverlay';
          overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;';
          overlay.addEventListener('click', function() {
            overlay.style.display = 'none';
          });
          document.body.appendChild(overlay);
        }

        overlay.innerHTML = `
          <img src="${img.src}" style="max-width:95%;max-height:85%;object-fit:contain;" onclick="event.stopPropagation();">
          <p style="color:#fff;margin-top:16px;font-size:14px;">点击任意处关闭 | 长按图片可保存</p>
        `;
        overlay.style.display = 'flex';
      });
    });
  }

  // ========================================
  // 8. 应急模块
  // ========================================
  function renderEmergency() {
    let html = '<div class="emergency-page"><h2 class="page-title">🆘 应急助手</h2>';

    // 大按钮首页
    html += '<div class="emergency-grid">';
    EMERGENCY_DATA.categories.forEach(function(cat) {
      html += `
        <button class="emergency-btn" style="border:2px solid ${cat.color};" data-em="${cat.id}">
          <span class="em-icon">${cat.icon}</span>
          <span class="em-label">${cat.name}</span>
        </button>
      `;
    });
    html += '</div>';

    // 高反判断（默认隐藏）
    html += `
      <div class="emergency-detail card" id="emDetail_ams" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🤢 ${EMERGENCY_DATA.ams.title}</h3>
        <p>${EMERGENCY_DATA.ams.intro}</p>
        <div class="symptom-list">
          ${EMERGENCY_DATA.ams.symptoms.map(function(s, i) {
            return `<label class="checklist-item symptom-item ${s.severe ? 'symptom-severe' : ''}">
              <input type="checkbox" class="ams-symptom" data-severe="${s.severe}">
              <span class="check-label">${s.text}</span>
            </label>`;
          }).join('')}
        </div>
        <div class="ams-result" id="amsResult" style="display:none;">
          <div class="ams-mild card-info" id="amsMild">
            <p>${EMERGENCY_DATA.ams.mildAdvice}</p>
          </div>
          <div class="ams-severe card-danger" id="amsSevere" style="display:none;">
            <p style="white-space:pre-line;">${EMERGENCY_DATA.ams.severeAdvice}</p>
          </div>
        </div>
      </div>
    `;

    // 车坏
    html += `
      <div class="emergency-detail card" id="emDetail_car" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🚗 ${EMERGENCY_DATA.car.title}</h3>
        <ol class="emergency-steps">
          ${EMERGENCY_DATA.car.steps.map(function(s) {
            return `<li><strong>步骤 ${s.step}：</strong><span style="white-space:pre-line;">${s.text}</span></li>`;
          }).join('')}
        </ol>
        <div class="card-info" style="margin-top:12px;">
          <h4>⚠️ 高海拔换胎注意事项</h4>
          <p>${EMERGENCY_DATA.car.tireChange}</p>
        </div>
      </div>
    `;

    // 失温
    html += `
      <div class="emergency-detail card" id="emDetail_hypothermia" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🥶 ${EMERGENCY_DATA.hypothermia.title}</h3>
        ${EMERGENCY_DATA.hypothermia.levels.map(function(l) {
          return `<div class="hypothermia-level">
            <h4>${l.level}</h4>
            <p><strong>症状：</strong>${l.symptoms}</p>
            <p><strong>处理：</strong>${l.action}</p>
          </div>`;
        }).join('')}
      </div>
    `;

    // 迷路
    html += `
      <div class="emergency-detail card" id="emDetail_lost" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🗺️ ${EMERGENCY_DATA.lost.title}</h3>
        <ol class="emergency-steps">
          ${EMERGENCY_DATA.lost.steps.map(function(s, i) { return `<li>${s}</li>`; }).join('')}
        </ol>
      </div>
    `;

    // 报警
    html += `
      <div class="emergency-detail card" id="emDetail_police" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🚨 ${EMERGENCY_DATA.police.title}</h3>
        <div class="emergency-numbers">
          ${EMERGENCY_DATA.police.numbers.map(function(n) {
            return `<div class="em-number-row">
              <span>${n.name}</span>
              <a href="tel:${n.number}" class="phone-link">📞 ${n.number}</a>
            </div>`;
          }).join('')}
        </div>
        <div class="card-info" style="margin-top:12px;">
          <h4>📋 报警信息模板（一键复制）</h4>
          <pre class="em-template">${EMERGENCY_DATA.police.template}</pre>
          <button class="btn btn-primary" id="btnCopyPolice">📋 复制报警模板</button>
        </div>
      </div>
    `;

    // 医院
    html += `
      <div class="emergency-detail card" id="emDetail_hospital" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🏥 ${EMERGENCY_DATA.hospital.title}</h3>
        <div class="hospital-list">
          ${EMERGENCY_DATA.hospital.facilities.map(function(f) {
            return `<div class="hospital-item">
              <strong>${f.name}</strong>
              <span>📍 ${f.location} | ${f.level}</span>
              ${f.phone !== '—' ? `<a href="tel:${f.phone}" class="phone-link">📞 ${f.phone}</a>` : ''}
            </div>`;
          }).join('')}
        </div>
        <p class="card-info" style="margin-top:12px;">${EMERGENCY_DATA.hospital.note}</p>
      </div>
    `;

    // 拖车
    html += `
      <div class="emergency-detail card" id="emDetail_tow" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🔧 需要拖车</h3>
        <div class="emergency-steps">
          <ol>
            <li>确保人员安全（撤到护栏/安全区域外）</li>
            <li>记录当前 GPS 坐标和路标</li>
            <li>联系租车公司或保险公司道路救援</li>
            <li>如无信号，走到高处或等待过往车辆</li>
            <li>阿里地区拖车费用较高，确认保险是否覆盖</li>
          </ol>
        </div>
        <div class="card-info" style="margin-top:12px;">
          <p>☎️ 建议出发前保存：租车公司电话、保险公司道路救援电话</p>
        </div>
      </div>
    `;

    // 同伴异常
    html += `
      <div class="emergency-detail card" id="emDetail_companion" style="display:none;">
        <button class="btn-back-em">◀ 返回应急首页</button>
        <h3>🆘 同伴情况异常</h3>
        <ol class="emergency-steps">
          <li>立即停止移动，让同伴坐下或躺下休息</li>
          <li>检查意识、呼吸、脉搏</li>
          <li>检查是否为高反（参考高反判断）</li>
          <li>检查是否为失温（参考失温判断）</li>
          <li>保暖、吸氧、补水</li>
          <li>如情况严重，立即拨打 120 或寻求救援</li>
          <li>记录症状开始时间和变化</li>
          <li>不要给意识模糊的人喂水喂药</li>
        </ol>
      </div>
    `;

    html += '</div>';
    return html;
  }

  function bindEmergencyEvents() {
    // 应急按钮点击
    document.querySelectorAll('.emergency-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const emId = btn.dataset.em;
        // 隐藏所有详情
        document.querySelectorAll('.emergency-detail').forEach(function(d) {
          d.style.display = 'none';
        });
        // 隐藏按钮网格
        document.querySelector('.emergency-grid').style.display = 'none';
        // 显示对应详情
        const detail = document.getElementById('emDetail_' + emId);
        if (detail) {
          detail.style.display = 'block';
          detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // 返回按钮
    document.querySelectorAll('.btn-back-em').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.emergency-detail').forEach(function(d) {
          d.style.display = 'none';
        });
        document.querySelector('.emergency-grid').style.display = 'grid';
      });
    });

    // 高反症状判断
    document.querySelectorAll('.ams-symptom').forEach(function(cb) {
      cb.addEventListener('change', updateAmsResult);
    });

    // 复制报警模板
    const copyPolice = document.getElementById('btnCopyPolice');
    if (copyPolice) {
      copyPolice.addEventListener('click', function() {
        U.copyToClipboard(EMERGENCY_DATA.police.template).then(function(ok) {
          U.toast(ok ? '✅ 报警模板已复制！可粘贴到微信/短信' : '❌ 复制失败');
        });
      });
    }
  }

  function updateAmsResult() {
    const result = document.getElementById('amsResult');
    const mild = document.getElementById('amsMild');
    const severe = document.getElementById('amsSevere');
    if (!result) return;

    let hasSevere = false;
    let anyChecked = false;
    document.querySelectorAll('.ams-symptom').forEach(function(cb) {
      if (cb.checked) {
        anyChecked = true;
        if (cb.dataset.severe === 'true') hasSevere = true;
      }
    });

    if (!anyChecked) {
      result.style.display = 'none';
      return;
    }

    result.style.display = 'block';
    mild.style.display = hasSevere ? 'none' : 'block';
    severe.style.display = hasSevere ? 'block' : 'none';
  }

  // ========================================
  // 辅助函数
  // ========================================
  function getTypeLabel(type) {
    const map = { driving: '🚗 驾车', trekking: '🚶 徒步', rest: '🏨 休整' };
    return map[type] || type;
  }

  function getAltitudeColor(alt) {
    if (alt >= 5000) return '#c0392b';
    if (alt >= 4000) return '#e67e22';
    return '#27ae60';
  }

  function downloadFile(filename, content, mimeType) {
    const blob = new Blob(['﻿' + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // ========================================
  // 全局变量
  // ========================================
  let currentChecklistMode = 'category';

  // ========================================
  // 启动应用
  // ========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
