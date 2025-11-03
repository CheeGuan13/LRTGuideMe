// Global behaviors (language selection handled by i18n.js)

document.querySelector('#startNav')?.addEventListener('click', ()=>{
  // 检查在 index.html 中设置的全局登录状态
  if (window.isUserLoggedIn === true) {
    // 状态为 true (已登录)，正常跳转
    window.location.href = 'station-select.html';
  } else {
    // 状态为 false (未登录)，显示提示框
    
    // 从 i18n.js 获取翻译后的提示信息
    const lang = window.currentLang || 'en';
    const tDict = (window.translations && window.translations[lang]) || {};
    
    // (你需要把 'login_required' 这个 key 添加到 i18n.js 中)
    const msg = tDict.login_required || 'You must be logged in to use navigation. Please login first.';
    
    // 使用浏览器默认的 alert 弹窗
    alert(msg);
  }
});