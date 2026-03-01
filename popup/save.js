'use strict';

// 等待 DOM 加载完成后绑定保存按钮事件
document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', save);
    }
});

function save() {
    // 获取所有开关按钮
    document.querySelectorAll('.btn_on_off').forEach(btn => {
        const isOn = getButtonState(btn);  // getButtonState 定义在 button_ani.js 中
        const name = btn.classList[1];      // 例如 'show_baidu_ai'
        
        chrome.storage.sync.set({
                [name] : isOn 
            }, () => {
                // console.log(`保存 ${name}: ${isOn}`);
                chrome.storage.sync.get(["show_log"], (result) => {
                    if (result.show_log) {
                        document.querySelector("div.log")
                            .insertAdjacentHTML("afterEnd",`<p>save: ${name}:${isOn}</p>`);
                    }
                });
            }
        );
    });

    // 单独查看 插件状态
    const on_off_opt=document.querySelector(".on_off_opt");
    chrome.runtime.sendMessage({
        title: "changeStatus",
        message: getButtonState(on_off_opt)
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clear);
    }
});

function clear() {
    chrome.storage.sync.clear(() => {
        // console.log(`清空所有数据`);
        chrome.storage.sync.get(["show_log"], (result) => {
            if (result.show_log) {
                document.querySelector("div.log")
                    .insertAdjacentHTML("afterEnd",`<p>clear: 所有数据已清空</p>`);
            }
        });
    });
    chrome.storage.sync.set(default_var).then(() => {
        window.location.reload();
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const jumpBtn = document.getElementById('jump');
    if (jumpBtn) {
        jumpBtn.addEventListener('click', jump);
    }
});

function jump() {
    chrome.runtime.openOptionsPage();
}