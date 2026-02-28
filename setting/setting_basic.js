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

/**
 * 初始化所有类名为 'btn_on_off' 的按钮
 * 每个按钮独立维护状态，点击时切换 ON/OFF
 */
var initToggleButtons=function() {
    const buttons = document.querySelectorAll('.btn_on_off');
    buttons.forEach(btn => {
        const name = btn.classList[1];
        
        // 先设为默认 off（避免异步期间无状态）
        btn.dataset.state = 'off';
        updateButtonUI(btn, false);

        // 读取存储值
        chrome.storage.sync.get([name], (result) => {
            const savedValue = result[name];
            // const isOn = (savedValue??default_var[name]);
            const isOn = savedValue;
            // isOn: (isOn 为 undefined [取 default] ) ? true->on : false:off
            btn.dataset.state = isOn ? 'on' : 'off';
            updateButtonUI(btn, isOn);
            //调试输出
            // chrome.storage.sync.get(["show_log"], (result) => {
            //     if (result.show_log) {
                    document.querySelector("div.log").insertAdjacentHTML("beforeEnd", `<p>load: ${name}:${savedValue}</p>`);
            //     } else {
            //         document.querySelector("div.log")?.remove();
            //     }
            // });
        });

        // 绑定点击事件（仅切换 UI 状态，保存由保存按钮负责）
        btn.addEventListener('click', ()=>{
            const isOn = btn.dataset.state === 'on';
            const newState = !isOn;
            btn.dataset.state = newState ? 'on' : 'off';
            updateButtonUI(btn, newState);
        });
    });
}

// 等待 DOM 加载完成后初始化所有开关按钮
document.addEventListener('DOMContentLoaded', function() {
    initToggleButtons();
});