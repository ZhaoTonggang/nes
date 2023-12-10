// 严格模式
"use strict";
// 页面载入
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open('https://nes.heheda.top', '_self');
} else if (window.location.href.indexOf('index') > -1) {
	window.open('./', '_self');
};
// 数据容器
let data;
let timeout = null;
// 取得资源
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
			let item = "";
			const app = document.getElementById('app');
			const searchV = search.value.replace(/(^\s*)|(\s*$)/g, '');
			if (searchV === '') {
				data = datas;
			} else {
				data = datas.filter(array => array.n.match(searchV) || array.v.match(searchV) || array.c.match(
					searchV));
				if (data.length === 0) {
					app.classList.add('sapp');
					app.innerHTML = '<h1>什么东东都没有，换个词试试丫！</h1>';
					return;
				};
			};
			for (let j = 0; j < data.length; j++) {
				let span1 = data[j].v != '' ? '<span class="p2">' + data[j].v + '</span>' : '';
				let span2 = data[j].c != '' ? '<span class="p3">' + data[j].c + '</span>' : '';
				let opgamev = data[j].v != '' ? "'" + data[j].v + "'" : false;
				item +=
					'<div class="item" onclick="opgame(' + opgamev + ',\'' + data[j].n + '\',\'' + data[j].i +
					'\')">' +
					'<div class="img_box"><img src="./imgs/' + data[j].i + '.png" title="' + data[j].n +
					'" alt="' +
					data[j].n + '">' + span1 + span2 + '</div><p class="p1">' + data[j].n + '</p></div>';
			};
			app.classList.remove('sapp');
			app.innerHTML = item;
		})
		.catch(err => {
			document.getElementById('apph').innerHTML = '获取数据失败<br />请尝试“异常修复”<br />[错误代码:404]';
			console.error('[404]错误日志：', err);
		})
};
intdata();
//打开游戏
const opgame = (v, n, i) => {
	window.open(encodeURI('./play/?v=' + v + '&n=' + n + '&i=' + i), '_self');
};
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
	};
});
//返回顶部
const cdTop = () => {
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
};
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
});
// 回车搜索
window.onkeydown = () => {
	if (window.event && window.event.keyCode == 13 && search == document.activeElement) {
		intdata();
	};
};
// 程序修复
const fixsys = () => {
	const yesfix = confirm('确认运行修复程序吗？系统将向云端请求最新的数据包，这将有效应对绝大多数异常情况。');
	if (yesfix == true) {
		window.location.replace(window.location.href);
	}
}
// 移除遮罩
document.onreadystatechange = () => {
	if (document.readyState === "interactive") {
		document.body.classList.remove("is-loading");
	};
};
// 通知
let olddate = new Date().getDate();
const newdate = 21 - olddate;
alert(
	"至亲爱的玩家：\n\n各位玩家你们好，红白机游戏盒新版已推出，经过多轮测试，其稳定性已达到相关要求，为了减少服务器资源占用，我们将于【" + newdate +
	"】日后移除旧版入口并删除相应数据。\n届时旧版存档等相关数据将无法使用，在旧版中有存档数据的玩家，请尽快完成游戏！\n\n红白机游戏盒，特此通知！")