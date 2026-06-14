/**
 * 阿里大环线离线路书助手 - 工具函数
 * localStorage 操作、数据导出/导入、微信检测
 */
(function() {
  'use strict';

  window.Utils = {
    // ========================================
    // localStorage 操作
    // ========================================
    store: {
      get(key, defaultValue) {
        try {
          const raw = localStorage.getItem(key);
          if (raw === null) return defaultValue;
          return JSON.parse(raw);
        } catch (e) {
          console.warn('localStorage read error:', key, e);
          return defaultValue;
        }
      },
      set(key, value) {
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (e) {
          console.warn('localStorage write error:', key, e);
          return false;
        }
      },
      remove(key) {
        try {
          localStorage.removeItem(key);
        } catch (e) {}
      }
    },

    // ========================================
    // 微信环境检测
    // ========================================
    isWechat: /MicroMessenger/i.test(navigator.userAgent),

    // ========================================
    // 日期工具
    // ========================================
    date: {
      today() {
        const d = new Date();
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
      },
      getTripDay() {
        const today = this.today();
        const trip = TRIP_DATA;
        for (let i = 0; i < trip.length; i++) {
          if (trip[i].date === today) return i; // return index
        }
        // Before trip → Day 1; After trip → Day 16
        if (today < trip[0].date) return 0;
        if (today > trip[trip.length - 1].date) return trip.length - 1;
        return 0; // fallback
      }
    },

    // ========================================
    // 数据导出
    // ========================================
    export: {
      allJSON() {
        const data = {
          version: 'v3.0',
          exportedAt: new Date().toISOString(),
          checklist: Utils.store.get('ali_checklist_v3', {}),
          expenses: Utils.store.get('ali_expenses_v3', []),
          completedDays: Utils.store.get('ali_completed_days_v3', []),
          tripNotes: Utils.store.get('ali_trip_v3', {}),
          settings: Utils.store.get('ali_settings_v3', { peopleCount: 2 })
        };
        return JSON.stringify(data, null, 2);
      },
      expensesCSV() {
        const expenses = Utils.store.get('ali_expenses_v3', []);
        if (expenses.length === 0) return '日期,分类,金额,支付人,备注\n(无数据)';
        let csv = '﻿日期,分类,金额,支付人,备注\n';
        expenses.forEach(e => {
          csv += `${e.date},${e.category},${e.amount},${e.payer || ''},${e.note || ''}\n`;
        });
        return csv;
      }
    },

    // ========================================
    // 数据导入
    // ========================================
    import: {
      fromJSON(jsonStr) {
        try {
          const data = JSON.parse(jsonStr);
          if (!data.version) throw new Error('无效的备份文件');
          if (data.checklist) Utils.store.set('ali_checklist_v3', data.checklist);
          if (data.expenses) Utils.store.set('ali_expenses_v3', data.expenses);
          if (data.completedDays) Utils.store.set('ali_completed_days_v3', data.completedDays);
          if (data.tripNotes) Utils.store.set('ali_trip_v3', data.tripNotes);
          if (data.settings) Utils.store.set('ali_settings_v3', data.settings);
          return true;
        } catch (e) {
          console.error('导入失败:', e);
          return false;
        }
      }
    },

    // ========================================
    // 风险等级映射
    // ========================================
    riskLevel: {
      label(level) {
        const map = { low: '低风险', medium: '中风险', high: '高风险', critical: '⚠ 极高风险' };
        return map[level] || level;
      },
      color(level) {
        const map = { low: '#27ae60', medium: '#f39c12', high: '#e74c3c', critical: '#8b0000' };
        return map[level] || '#333';
      },
      bg(level) {
        const map = { low: '#eafaf1', medium: '#fef9e7', high: '#fdedec', critical: '#ffe0e0' };
        return map[level] || '#f5f5f5';
      },
      border(level) {
        const map = { low: '#27ae60', medium: '#f39c12', high: '#e74c3c', critical: '#8b0000' };
        return map[level] || '#ccc';
      }
    },

    // ========================================
    // 复制到剪贴板
    // ========================================
    copyToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
      }
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        return Promise.resolve(true);
      } catch (e) {
        return Promise.resolve(false);
      } finally {
        document.body.removeChild(ta);
      }
    },

    // ========================================
    // Toast 提示
    // ========================================
    toast(msg, duration) {
      duration = duration || 2000;
      const el = document.getElementById('toast') || (function() {
        const div = document.createElement('div');
        div.id = 'toast';
        div.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.85);color:#fff;padding:10px 24px;border-radius:20px;font-size:14px;z-index:9999;pointer-events:none;transition:opacity 0.3s;white-space:nowrap;max-width:90vw;overflow:hidden;text-overflow:ellipsis;';
        document.body.appendChild(div);
        return div;
      })();
      el.textContent = msg;
      el.style.opacity = '1';
      clearTimeout(el._timeout);
      el._timeout = setTimeout(function() {
        el.style.opacity = '0';
      }, duration);
    },

    // ========================================
    // 生成唯一 ID
    // ========================================
    uid() {
      return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // ========================================
    // 防抖
    // ========================================
    debounce(fn, delay) {
      let timer;
      return function() {
        const ctx = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(ctx, args), delay);
      };
    }
  };
})();
