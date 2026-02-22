'use strict';

/**
 * 根据状态更新单个按钮的 UI
 * @param {HTMLElement} btn - 按钮容器元素
 * @param {boolean} isOn - true 表示 ON，false 表示 OFF
 */
function updateButtonUI(btn, isOn) {
    const circle = btn.querySelector('.btn-on-circle');
    const text = btn.querySelector('.btn-on-text');

    // 确保内部元素存在（避免错误）
    if (!circle || !text) return;

    if (!isOn) {
        // OFF 状态：灰色背景，圆点右移，文字变为 OFF 且灰色
        btn.style.backgroundColor = '#ccc';
        circle.style.left = '40px';
        circle.style.backgroundColor = '#888';
        circle.style.boxShadow = '0 0 10px #888';
        text.style.right = '30px';
        text.style.color = '#888';
        text.innerText = 'OFF';
    } else {
        // ON 状态：恢复默认样式（清除内联样式，由 CSS 定义）
        btn.style.backgroundColor = '';       // 恢复为 #12B090
        circle.style.left = '';
        circle.style.backgroundColor = '';
        circle.style.boxShadow = '';
        text.style.right = '';
        text.style.color = '';
        text.innerText = 'ON';
    }
}

var setButtonState = updateButtonUI;

/**
 * 查看状态
 * @param {HTMLElement} btn - 按钮容器元素
 * @returns {boolean} - true 表示 ON，false 表示 OFF
 */
function getButtonState(btn) {
    return btn.dataset.state === 'on';
}