"use strict";

importScripts("..\\default_var.js")


// 在这里初始化 避免有 undefined
function initStorage() {
    chrome.storage.sync.get(["is_not_first"], (result) => {
        if (!result.is_not_first) {
            chrome.storage.sync.set(default_var);
            console.log("setting:",default_var);
        }
    });
    console.log("change finished");
}
initStorage();