'use strict';

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
    <div class="core_ai">
        <!-- 内置 AI 模块 -->
        <h3>问 百度AI助手:</h3>
        <div class="inp_bar">
            <select id="ai_model" name="ai_model">
                <option value="llm">普通问答</option>
                <option value="t2i">生成图片</option>
            </select>
            <input type="text" placeholder="输入问题或生成图片"> <!-- 填 '__' -->
            <button href="javascript:void(0);">发送</button>
        </div>
    </div>
`;

// ================== 移动 AI 模块到右侧栏（移动后折叠）==================
function moveAIToRight() {
    // 选择需要移动的模块（wenda_generate 和 new_baikan_index）
    const aiDiv = document.querySelector('div[tpl="wenda_generate"], div[tpl="new_baikan_index"]');

    if (!aiDiv) return;
    const baidu_ai_area = document.querySelector('.baidu_ai');
    if (!baidu_ai_area || baidu_ai_area.contains(aiDiv)) return;

    if (!aiDiv){
        baidu_ai_area.remove();
    }
    chrome.storage.sync.get(["show_baidu_ai"], (result) => {
        if (! (result?.show_baidu_ai)??default_var["show_baidu_ai"]) {
            aiDiv?.remove();
            baidu_ai_area.remove();
            return;
        }
    });


    baidu_ai_area.insertAdjacentElement('afterbegin', aiDiv);

    // 可选样式调整
    aiDiv.style.width = '100%';
    aiDiv.style.margin = '0';

    // 移动后立即折叠（根据 tpl 类型执行对应的折叠逻辑）
    foldAIModule(aiDiv);
}

// ================== 折叠 AI 模块（统一入口）==================
function foldAIModule(aiDiv) {
    if (!aiDiv) return;
    chrome.storage.sync.get(["show_baidu_ai"], (result) => {
        if (!result.show_baidu_ai) {
            aiDiv?.remove();
            return;
        }
    });
    // 防止重复处理
    if (aiDiv.dataset.foldProcessed) return;
    aiDiv.dataset.foldProcessed = 'true';

    const tpl = aiDiv.getAttribute('tpl');

    if (tpl === 'wenda_generate') {
        foldWendaGenerate(aiDiv);
    } else if (tpl === 'new_baikan_index') {
        foldNewBaikanIndex(aiDiv);
    }
    // 其他 tpl 暂不处理
}

// ----- wenda_generate 折叠逻辑（已有，稍作优化）-----
function foldWendaGenerate(aiDiv) {
    const header = aiDiv.querySelector('.header_620nA');
    const content = aiDiv.querySelector('.content-container_6NKPM');
    const funcArea = aiDiv.querySelector('.cosd-search-header-functional-area'); // 功能区域（包含“听”按钮）
    const interaction = aiDiv.querySelector('.interaction_1QalB');

    if (!header || !content || !funcArea) return;

    // 隐藏交互栏（可选）
    if (interaction) interaction.style.display = 'none';

    // 查找原生折叠按钮
    let foldBtn = aiDiv.querySelector('.wenda-general-fold-switch_7six0 .cosd-fold-switch');

    if (foldBtn) {
        // 将原生按钮移动到功能区域（作为最后一个子元素，即“听”按钮右侧）
        funcArea.appendChild(foldBtn);
        // 移除可能存在的旧监听（克隆替换以清除事件）
        const newBtn = foldBtn.cloneNode(true);
        foldBtn.parentNode.replaceChild(newBtn, foldBtn);
        foldBtn = newBtn;

        // 调整样式，使其与“听”按钮水平对齐
        foldBtn.style.marginLeft = '8px';
        foldBtn.style.display = 'inline-flex';
        foldBtn.style.alignItems = 'center';
    } else {
        // 如果没有原生按钮，创建自定义按钮
        foldBtn = createCustomFoldButton('展开');
        funcArea.appendChild(foldBtn);
    }

    // 初始状态：隐藏内容，按钮显示“展开”
    content.style.display = 'none';
    updateFoldButtonText(foldBtn, true);

    // 绑定点击事件
    foldBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? '' : 'none';
        updateFoldButtonText(foldBtn, !isHidden);
    });
}

// ----- new_baikan_index 折叠逻辑（新增）-----
function foldNewBaikanIndex(aiDiv) {
    // 定位标题行（包含“总结全网32篇结果”和“听”按钮）
    const header = aiDiv.querySelector('.cosd-search-header');
    // 定位主要内容区域（AI文本、视频、交互栏等）
    const content = aiDiv.querySelector('.content-container_64QCb');
    // 定位交互栏（点赞、分享等）
    const interaction = aiDiv.querySelector('.interact-container_440HL');

    if (!header || !content) return;

    // 隐藏内容区域和交互栏
    content.style.display = 'none';
    if (interaction) interaction.style.display = 'none';

    // 创建自定义折叠按钮（放在标题行右侧）
    const foldBtn = createCustomFoldButton('展开');
    // 将按钮添加到标题行的功能区域（“听”按钮旁边）
    const funcArea = header.querySelector('.cosd-search-header-functional-area');
    if (funcArea) {
        funcArea.appendChild(foldBtn);
    } else {
        // 如果找不到功能区域，就追加到标题行末尾
        header.appendChild(foldBtn);
    }

    // 绑定点击事件
    foldBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isHidden = content.style.display === 'none';
        content.style.display = isHidden ? '' : 'none';
        if (interaction) interaction.style.display = isHidden ? '' : 'none';
        foldBtn.textContent = isHidden ? '折叠' : '展开';
    });

    // 删除AI中的广告
    document.querySelectorAll('div.cos-space-mt-lg[disable-jump="true"][rl-type="stop"][data-show-ext="{}"]').forEach(ad => ad.remove());
}

// 辅助：创建自定义折叠按钮
function createCustomFoldButton(text) {
    const btn = document.createElement('span');
    btn.textContent = text;
    btn.style.cursor = 'pointer';
    btn.style.color = '#4e6ef2';
    btn.style.marginLeft = '10px';
    btn.style.fontSize = '14px';
    btn.style.userSelect = 'none';
    return btn;
}

// 辅助：更新百度原生折叠按钮的文字和图标
function updateFoldButtonText(btn, isHidden) {
    const textSpan = btn.querySelector('.cos-fold-switch-text');
    const icon = btn.querySelector('.cos-icon');
    if (textSpan) textSpan.textContent = isHidden ? '展开' : '折叠';
    if (icon) icon.className = isHidden ? 'cos-icon cos-icon-down' : 'cos-icon cos-icon-up';
}

// 监听 main.js 完成事件
document.addEventListener('finished', () => {

// start code here ----------------


const right_col = document.querySelector('#content_right');
const left_col = document.querySelector('#content_left');
const params = new URLSearchParams(window.location.search);
// if (!right_col || !left_col) return;

if (!right_col) return;
right_col.innerHTML = right_html;
moveAIToRight();

// 官网处理
const guanwang = left_col.querySelector('a[href="https://aiqicha.baidu.com/feedback/official?from=baidu&type=gw"]')?.closest(".c-container");
console.log("guanwang:", guanwang);
if (guanwang) {
    // console.log(");
    const link = guanwang.querySelector(".sc-link")?.href;
    if (link) {
        const target = right_col.querySelector('.extract_guanwang');
        if (target) target.innerHTML = `跳转:<a href="${link}">${guanwang.querySelector(".sc-link").textContent}</a>`;
    }
}

// 翻译处理
const translate = left_col.querySelector(".word-fy-card_604a5")?.closest(".c-container");
console.log("translate:", translate);
if (translate) {
    translate.style["scrollMarginTop"] = '80px';
    const target = right_col.querySelector('.extract_translate');
    if (target) {
        target.innerHTML = `定位:<a href="javascript:void(0);">${translate.querySelector(".cosc-title-slot").textContent}</a>`;
        target.onclick = () => translate.scrollIntoView({ behavior: 'smooth' });
    }
}

// 百度百科
const baike = left_col.querySelector(".is-entry_4m0sD")?.closest(".c-container");
console.log("baike:", baike);
if (baike) {
    baike.style["scrollMarginTop"] = '80px';

    const link = baike.querySelector(".sc-link");
    const text = link?.textContent;
    if (link) {
        const target = right_col.querySelector('.extract_baike');
        if (target){
            target.innerHTML = `定位:<a class="baike_pos" href="javascript:void(0);">${text}</a>&nbsp;或&nbsp;<a href="${link.href}">直接跳转</a>`;
            target.querySelector(".baike_pos").onclick = () => baike.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// 问 百度 AI 助手
const ai_ask = right_col.querySelector('.core_ai');
ai_ask.querySelector("input").placeholder = `输入问题或生成图片`;
ai_ask.querySelector("button").addEventListener("click", () => {
    let model = ai_ask.querySelector("#ai_model").value;
    let prompt = ai_ask.querySelector("input").value;

    if (!prompt) prompt = decodeURIComponent(params.get('wd'));
    
    if (model === 'llm') {
        // 普通问答
        window.open(`https://chat.baidu.com/search?word=${prompt}&extParams=%7B%22aPageWord%22%3A%22${params.get('wd')}%22%2C%22enter_type%22%3A%22a_62112%22%2C%22sa%22%3A%22a_62112_doudi%22%7D`, '_blank');
    } else if (model === 't2i') {
        // 生成图片
        window.open(`https://chat.baidu.com/search?enter_type=a_4&extParams=%7B%22openInputMode%22%3A%228%22%2C%22inputPanelExt%22%3A%7B%22showPrompt%22%3Afalse%2C%22showPanel%22%3Afalse%7D%7D&word=${prompt}&sa=re_dl_4`, '_blank');
    }
});

right_col.dataset.finished = 'true';

// end code here ------------------

});
