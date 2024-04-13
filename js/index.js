// 严格模式
"use strict";
// 页面载入
const url = window.location.href;
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open(url, '_self');
} else if (url.indexOf('index') > -1) {
	window.open('./', '_self');
}
// 取得资源
let timeout = null;
const search = document.getElementById('search');
const cdtopbt = document.getElementById("cd-top");
const title = document.title;
// 数据加载
const intdata = () => {
	fetch('./list.json', {
			methods: 'GET',
			cache: 'force-cache',
			mode: 'same-origin'
		})
		.then(response => {
			return response.json();
		})
		.then(datas => {
			// 数据容器
			let data;
			let item = "";
			const app = document.getElementById('app');
			const searchV = search.value.replace(/(^\s*)|(\s*$)/g, '');
			if (searchV === '') {
				data = datas;
			} else {
				data = datas.filter(array => array.n.match(searchV));
				if (data.length === 0) {
					app.innerHTML = '<h1 id="apph">什么东东都没有，换个词试试丫!</h1>';
					return;
				}
			}
			for (let j = 0; j < data.length; j++) {
				let span1 = data[j].v ? '<span class="item_p2">' + data[j].v + '</span>' : '';
				let span2 = data[j].c ? '<span class="item_p3">' + data[j].c + '</span>' : '';
				let opgamev = data[j].v ? '(' + data[j].v + ')' : '';
				let purl = encodeURI('./play/?n=' + data[j].n + opgamev + '&i=' + data[j].i);
				item += '<a href="' + purl + '" title="' + data[j].n + opgamev +
					'" target="_self"><div class="item">' +
					'<div class="img_box"><img src="./imgs/' + data[j].i + '.png" alt="' + data[j].n + opgamev +
					'">' +
					span1 + span2 + '</div><p class="item_p1">' + data[j].n + '</p></div></a>';
			}
			app.innerHTML = item;
		})
		.catch(err => {
			document.getElementById('apph').innerHTML = '获取数据失败<br />请尝试“异常修复”<br />[错误代码:404]';
			console.error('[404]错误日志：', err);
		})
}
intdata();
//标题判断
window.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		//窗口不可见
		document.title = '(つ ェ ⊂)我藏好了哦~';
	} else {
		//窗口可见
		document.title = '(*゜ロ゜)ノ被发现了~';
		setTimeout(() => {
			document.title = title;
		}, 3000);
	}
})
//返回顶部
const cdTop = () => {
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}
// 监听屏幕滚动
window.addEventListener('scroll', () => {
	if (timeout !== null) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(() => {
		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		// 返回顶部
		if (scrollTop > 100) {
			cdtopbt.className = "cdtopVis";
		} else {
			cdtopbt.className = "cdtopHid";
		};
	}, 500);
})
// 回车搜索
window.onkeydown = () => {
	if (window.event && window.event.keyCode == 13 && search == document.activeElement) {
		intdata();
	}
}
// 程序修复
const fixsys = () => {
	const yesfix = confirm('确认运行修复程序吗？系统将清除本地缓存并向云端请求最新的数据包，这将有效应对绝大多数异常情况。');
	if (yesfix == true) {
		localStorage.clear();
		sessionStorage.clear();
		window.location.reload(true);
	}
}
// 移除遮罩
document.onreadystatechange = () => {
	if (document.readyState === "interactive") {
		document.body.classList.remove("is-loading");
	}
}