// 严格模式
"use strict"
// 页面载入
document.onreadystatechange = function() {
	if (document.readyState === "interactive") {
		document.body.classList.remove("is-loading");
	}
}
// 数据容器
let data;
// 取得资源
const search = document.getElementById('search');
const cdtopbt = document.getElementById("cd-top");
const title = document.title;
// 数据加载
function intdata() {
	fetch('./list.json', {
			methods: 'GET',
			cache: 'force-cache',
			mode: 'same-origin',
			integrity: 'sha256-61KQ7jxXtD+GotQw8ZcJDG4UP67whfRq8ThEsowFu18='
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
				}
			};
			for (let j = 0; j < data.length; j++) {
				let span1 = data[j].v != '' ? '<span class="p2">' + data[j].v + '</span>' : '';
				let span2 = data[j].c != '' ? '<span class="p3">' + data[j].c + '</span>' : '';
				item +=
					'<div class="item" onclick="opgame(\'' + data[j].i + '\')">' +
					'<div class="img_box"><img src="./imgs/' + data[j].i + '.png" title="' + data[j].n + '" alt="' +
					data[j].n + '">' + span1 + span2 + '</div><p class="p1">' + data[j].n + '</p></div>';
			}
			app.classList.remove('sapp');
			app.innerHTML = item;
		})
		.catch(err => {
			document.getElementById('apph').innerHTML = '获取列表失败[代码:404]';
			console.error('[404]错误日志：', err);
		})
}
intdata();
//打开游戏
function opgame(i) {
	window.open('./play.html?=' + i, '_self');
}
//标题判断
document.addEventListener('visibilitychange', function() {
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
window.onscroll = function() {
	if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
		cdtopbt.className = "cdtopVis";
	} else {
		cdtopbt.className = "cdtopHid";
	}
}

function cdTop() {
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

// 回车搜索
window.onkeydown = function() {
	if (window.event && window.event.keyCode == 13 && search == document.activeElement) {
		intdata();
	}
}