"use strict";

importScripts("..\\default_var.js")


// 启动设置 ==================================================================

// 在这里初始化 避免有 undefined
function initStorage() {
    chrome.storage.sync.get(["is_not_first"], (result) => {
        if (!result.is_not_first) {
            chrome.storage.sync.set(default_var);
            console.log("setting:",default_var);
        }
    });
    
    // 自动开启组件
    chrome.storage.sync.set({
        "on_off_opt": true
    });

    console.log("change finished");
}
initStorage();

// 修改图标
// background.js

// 初始读取存储并设置图标
function updateIconFromStorage() {
    chrome.storage.sync.get(['on_off_opt'], (result) => {
        const enabled = result.enabled === true; // 默认为启用
        setIcon(enabled);
    });
}
  
// 根据启用状态设置图标
function setIcon(enabled) {
    const path = enabled ? {
        16: '../icons/enabled16.png',
        32: '../icons/enabled32.png',
        48: '../icons/enabled48.png',
        64: '../icons/enabled64.png',
        128: '../icons/enabled128.png'
    } : {
        16: '../icons/disabled16.png',
        32: '../icons/disabled32.png',
        48: '../icons/disabled48.png',
        64: '../icons/disabled64.png',
        128: '../icons/disabled128.png'
    };
    chrome.action.setIcon({ path });
}
  
// 监听存储变化（当 popup 中修改开关时触发）
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.enabled) {
        const enabled = changes.enabled.newValue;
        setIcon(enabled);
    }
});

// 启动时执行一次
// updateIconFromStorage();


// 监听广播 ==================================================================
/**
 * 广播格式
 * @param {*} title 广播标题/内容
 * @param {*} message 具体内容(可有可无)
 * ...
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.title === "changeStatus") {
        chrome.storage.sync.get(["now_icon"], (result) => {
            console.log("changeStatus:",message.message);
            console.log("now_icon:",result.now_icon);
            if (result.now_icon !== message.message) {
                setIcon(message.message);
                chrome.storage.sync.set({
                    "now_icon": message.message
                });
            }
        });
    }
});
