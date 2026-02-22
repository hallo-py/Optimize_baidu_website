'use strict';
document.addEventListener('finished', () => {


// start code here ----------------

const right_col = document.querySelector('#content_right');
if (!right_col) return;
// if (right_col.querySelector('.output')?.textContent === "") return;

const left = document.querySelector("#content_left");
const guanwang = left?.querySelector('a[href="https://aiqicha.baidu.com/feedback/official?from=baidu&type=gw"]')?.closest(".c-container");
if (guanwang) {
    chrome.storage.sync.get(["guanwang_first"], (result) => {
        if (result.guanwang_first) {
            left?.insertAdjacentElement("afterbegin", guanwang);
        }
    });
}

// 删除下崽器

const downloder = left?.querySelector(".pc-down_1c6jp")?.closest(".c-container");
if (downloder) {
    chrome.storage.sync.get(["show_downloder"], (result) => {
        if (!result.show_downloder??defualt_var["show_downloder"]) {
            downloder.remove();
        }
    });
}

// 删除视频 --- “传统浏览器的‘缺点’”

const video = left?.querySelector(".more_1iY_B")?.closest(".c-container");
if (video) {
    chrome.storage.sync.get(["show_video"], (result) => {
        if (!result.show_video??defualt_var["show_video"]) {
            video.remove();
        }
    });
}

const notee = left?.querySelector(".pc-footer_44G1E")?.closest(".c-container");
if (notee) {
    chrome.storage.sync.get(["show_notee"], (result) => {
        if (!result.show_notee??defualt_var["show_notee"]) {
            notee.remove();
        }
    });
}



// end code here ------------------


});