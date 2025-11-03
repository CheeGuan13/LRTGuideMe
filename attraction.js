// attraction.js – helper to apply i18n and dynamic translations on attraction detail pages.

// This script relies on i18n.js being loaded first. It applies static translations to elements
// with `data-i18n-key` and uses LibreTranslate (translateExternal) to translate longer
// paragraphs marked with `data-translate="1"` when the selected language is not English.

document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('langSelect');
  // Helper to apply translations and handle paragraph translation
  async function applyLang(lang) {
    if (typeof applyTranslations === 'function') {
      applyTranslations(lang);
    }
    // Translate longer paragraphs only for non-English languages
    if (lang !== 'en' && typeof window.translateExternal === 'function') {
      const elements = document.querySelectorAll('[data-translate="1"]');
      for (const el of elements) {
        // Save original text
        if (!el.hasAttribute('data-original-text')) {
          el.setAttribute('data-original-text', el.textContent.trim());
        }
        const original = el.getAttribute('data-original-text');
        try {
          const translated = await window.translateExternal(original, lang);
          el.textContent = translated;
        } catch (err) {
          console.warn('Failed to translate paragraph', err);
          el.textContent = original;
        }
      }
    } else {
      // Restore original text for English or unsupported languages
      document.querySelectorAll('[data-translate="1"]').forEach(el => {
        const orig = el.getAttribute('data-original-text');
        if (orig) el.textContent = orig;
      });
    }
  }
  if (!langSelect) {
    return;
  }
  // On load: set value from storage and apply
  const stored = localStorage.getItem('preferredLang');
  if (stored && translations[stored]) {
    langSelect.value = stored;
  }
  applyLang(langSelect.value || 'en');
  langSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    localStorage.setItem('preferredLang', lang);
    applyLang(lang);
  });

  // Handle navigation: assign click handler to buttons that navigate into a station.
  // Each button should have class "navigate-btn" and a data-station attribute specifying
  // the target station. When clicked, we store the chosen station in localStorage
  // under "currentStation", clear any previous level selection, and then redirect
  // to the navigation page. This ensures that navigating from an attraction page
  // leads to the appropriate station map rather than defaulting to KL Sentral.
  document.querySelectorAll('.navigate-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const station = btn.getAttribute('data-station');
      if (station) {
        localStorage.setItem('currentStation', station);
      }
      localStorage.removeItem('currentLevel');
      window.location.href = 'navigation.html';
    });
  });
});