const params = new URLSearchParams(window.location.search);

// https://www.baidu.com/s?wd=python&pn=10&ie=utf-8
// 仅保留 wd , pn , ie  参数

let newParams = new URLSearchParams();

if (params.has('wd')) {
    newParams.set('wd', params.get('wd'));
}
if (params.has('ie')) {
    newParams.set('ie', params.get('ie'));
}
if (params.has('pn') && params.get('pn') !== '0') {
    newParams.set('pn', params.get('pn'));
}

let newURL = `https://www.baidu.com/s?${newParams.toString()}#`;
if (window.location.href !== newURL) {
    window.location.href = newURL;
}