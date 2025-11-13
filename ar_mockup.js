/* * scripts/ar_mockup.js
 * 负责 ar_mockup.html 页面的分步导航逻辑。
 */
document.addEventListener('DOMContentLoaded', () => {
        
    // --- 1. 定义你的导航步骤 ---
    // (这只是一个示例，你需要创建这些图片)
    const navigationSteps = [
        {
            background: "assets/images/KL-Sentral.jpg", // 假设这是起点
            overlay: "assets/images/ar-arrow-straight.png", // (你需要创建这个)
            text: "Walk straight towards the main hall.",
            text_ms: "Jalan terus ke dewan utama.",
            text_zh: "朝主大厅直走。"
        },
        {
            background: "assets/images/ar-bg-example-2.jpg", // (你需要创建这个)
            overlay: "assets/images/ar-arrow-left.png",     // (你需要创建这个)
            text: "Turn left towards the escalator.",
            text_ms: "Belok kiri ke arah eskalator.",
            text_zh: "向左转，朝自动扶梯方向走。"
        },
        {
            background: "assets/images/ar-bg-example-3.jpg", // (你需要创建这个)
            overlay: "assets/images/ar-arrow-destination.png", // (你需要创建这个)
            text: "You have arrived at the escalator.",
            text_ms: "Anda telah tiba di eskalator.",
            text_zh: "您已到达自动扶梯。"
        }
    ];

    // --- 2. 获取 DOM 元素 ---
    const bgImage = document.getElementById('station-background');
    const overlayImage = document.getElementById('overlay-arrow');
    const stepCounter = document.getElementById('step-counter');
    const stepText = document.getElementById('step-text');
    const prevBtn = document.getElementById('prev-step');
    const nextBtn = document.getElementById('next-step');

    // 检查元素是否存在，防止页面加载不完整时出错
    if (!bgImage || !overlayImage || !stepCounter || !stepText || !prevBtn || !nextBtn) {
        console.error("AR Mock-up elements not found. Stopping script.");
        return;
    }

    let currentStepIndex = 0;

    // --- 3. 核心更新函数 ---
    function updateStep(index) {
        // 获取当前语言 (来自 i18n.js)
        // 确保 i18n.js 已经加载
        const lang = (typeof window.currentLang !== 'undefined') ? window.currentLang : 'en';
        
        const step = navigationSteps[index];

        // 平滑过渡效果
        bgImage.style.opacity = 0;
        overlayImage.style.opacity = 0;
        
        setTimeout(() => {
            // 更新图片源
            bgImage.src = step.background;
            overlayImage.src = step.overlay;

            // 更新文本 (支持多语言)
            if (lang === 'ms' && step.text_ms) {
                stepText.textContent = step.text_ms;
            } else if (lang === 'zh' && step.text_zh) {
                stepText.textContent = step.text_zh;
            } else {
                stepText.textContent = step.text;
            }
            
            // 更新步骤计数器
            stepCounter.textContent = `Step ${index + 1} / ${navigationSteps.length}`;
            
            // 图片加载后淡入
            bgImage.onload = () => (bgImage.style.opacity = 1);
            overlayImage.onload = () => (overlayImage.style.opacity = 1);
        }, 300); // 300ms 延迟以匹配 CSS 过渡

        // --- 4. 管理按钮状态 ---
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === navigationSteps.length - 1;
    }

    // --- 5. 绑定事件监听器 ---
    nextBtn.addEventListener('click', () => {
        if (currentStepIndex < navigationSteps.length - 1) {
            currentStepIndex++;
            updateStep(currentStepIndex);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            updateStep(currentStepIndex);
        }
    });
    
    // (可选) 监听 i18n.js 的语言切换事件，以便动态更新文本
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
        langSelect.addEventListener('change', () => {
            // 语言更改后，用当前步骤索引重新运行更新函数
            // (需要确保 i18n.js 已经更新了 window.currentLang)
            setTimeout(() => updateStep(currentStepIndex), 50);
        });
    }

    // --- 6. 页面加载时，立即加载第一步 ---
    updateStep(currentStepIndex);
});