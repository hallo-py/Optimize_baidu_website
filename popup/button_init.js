'use strict';

var defualt_var = {
    "show_baidu_ai": true,
    "guanwang_first": true,
    "show_downloder": false,
    "show_video": false,
    "show_notee": false,
}

// 等待 DOM 加载完成后初始化所有开关按钮
document.addEventListener('DOMContentLoaded', function() {
    initToggleButtons();
});

/**
 * 初始化所有类名为 'btn_on_off' 的按钮
 * 每个按钮独立维护状态，点击时切换 ON/OFF
 */
function initToggleButtons() {
    const buttons = document.querySelectorAll('.btn_on_off');
    buttons.forEach(btn => {
        const name = btn.classList[1];
        
        // 先设为默认 off（避免异步期间无状态）
        btn.dataset.state = 'off';
        updateButtonUI(btn, false);

        // 读取存储值
        chrome.storage.sync.get([name], (result) => {
            const savedValue = result[name];
            const isOn = (savedValue??defualt_var[name]);
            // isOn: (isOn 为 undefined [取 defualt] ) ? true->on : false:off
            btn.dataset.state = isOn ? 'on' : 'off';
            updateButtonUI(btn, isOn);
            //调试输出
            document.querySelector("div.log").insertAdjacentHTML("beforeEnd", `<p>load: ${name}:${savedValue}</p>`);
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