'use strict';

console.log("in main.js");

var right_html = `
    <div class="output">
    </div>
    <div class="baidu_ai">
        <!-- 百度 AI 模块 -->
        <!-- 填 -->
        <hr/>
    </div>
    <div class="extract">
        <!-- 提取摘要模块 -->
        <h3>从搜索结果中提取信息:</h3>
        <p>官网:<span class="extract_guanwang">未找到</span></p>    <!-- 填 -->
        <p>翻译:<span class="extract_translate">未找到</span></p>   <!-- 填 -->
        <p>百度百科:<span class="extract_baike">未找到</span></p>   <!-- 填 <a href=javascript:void(0);/> 或 <a/>直接跳转-->
        <hr/>
    </div>
`;

// ================== 广告删除函数 ==================
function delete_ad() {
    var search_list = document.querySelectorAll("._3rqxpq2");
    search_list.forEach(function(item) {
        if (item.querySelector(".ec-tuiguang.ecfc-tuiguang.m12mvnb")) {
            if (item.querySelector(".ec-tuiguang.ecfc-tuiguang.m12mvnb").textContent == "广告") {
                item.remove();
            }
        }
    });

    search_list = document.querySelectorAll(".result");
    search_list.forEach(function(item) {
        if (item.querySelector(".m.c-gap-left") != null) {
            if (item.querySelector(".m.c-gap-left").textContent == "广告") {
                item.remove();
            }
        }
    });

    document.querySelectorAll('#content_left > div').forEach((item) => {
        if (item?.classList?.length === 0) {
            item.remove();
        }
    });

    // 翻译中的 精彩视频
    document.querySelector(".video-wrap_312kw")?.parentElement?.remove();
    // 翻译中的 第二方广告
    document.querySelector(".daoliu-con_3XOTP")?.remove();
}



// ================== 初始化右侧栏 ==================
function setupRightBar() {
    const rightCol = document.querySelector('#content_right');
    if (!rightCol) return;
    rightCol.innerHTML = right_html;
    // moveAIToRight(); // 会触发折叠
}

// ================== 删除其他烦人元素 ==================
function delete_annoy() {
    // 删除“标签栏”
    document.querySelector('#searchTag')?.remove();

    // 打开“搜索工具”（取消折叠）
    const outer = document.querySelector('.outer_wqJjM');
    if (outer?.classList.contains('new-outer_1rAy8')) {
        outer.classList.remove('new-outer_1rAy8');
    }
    document.querySelector('#tsn_inner')?.style ? (document.querySelector('#tsn_inner').style.top = '0px') : null;

    // 删除“大家还在搜”
    document.querySelector('div[m-name="aladdin-san/app/recommend_list/result_bd1d926"]')?.remove();
    document.querySelector('div.c-color-t.rs-label_ihUhK')?.parentElement?.remove();

    // 删除 ai_ask 模块（用户指定删除）
    document.querySelector('div[tpl="ai_ask"]')?.remove();

    // 删除“听”按钮
    // document.querySelector("div[rl-type='stop']")?.remove();
    // document.querySelector("div.tts-video-continue")?.remove();
}

// ================== 初始化 ==================
console.log('开始篡改...');

let finished = false;
delete_ad();
delete_annoy();
setupRightBar(); // 只调用一次


// 监听动态变化
const observer = new MutationObserver(() => {
    delete_ad();
    moveAIToRight(); // 内部已包含折叠
    // if (finished) document.querySelector(".output").insertAdjacentHTML("afterbegin", `<p>篡改完毕</p>\n<br>`);
});
observer.observe(document.body, { childList: true, subtree: true });

// 输出
finished = true;
document.dispatchEvent(new CustomEvent('finished'));
console.log('篡改完毕...');
