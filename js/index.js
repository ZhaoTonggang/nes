// 页面载入设置
document.onreadystatechange = function() {
	if (document.readyState === "interactive") {
		document.body.classList.remove("is-loading");
	}
}
// 数据加载
function intdata() {
	fetch('./list.json', {
			methods: 'GET',
			cache: 'no-cache'
		})
		.then(response => {
			return response.json();
		})
		.then(datas => {
			let item = "";
			let app = document.getElementById('app');
			let search = document.getElementById('search').value.replace(/(^\s*)|(\s*$)/g, '');
			if (search === '') {
				data = datas;
			} else {
				data = datas.filter(array => array.n.match(search) || array.v.match(search) || array.c.match(
					search));
				if (data.length === 0) {
					app.classList.add('sapp');
					app.innerHTML = '<h1>什么东东都没有，换个词试试丫！</h1>';
					return;
				}
			}
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
//打开游戏页面
function opgame(i) {
	window.open('./play.html?=' + i, '_self');
}
//网站标题自动判断
let title = document.title;

function istitle() {
	let isHidden = document.hidden;
	if (isHidden) {
		//当窗口不可见
		document.title = '(つ ェ ⊂)我藏好了哦~';
	} else {
		//当窗口可见
		document.title = '(*゜ロ゜)ノ被发现了~';
		setTimeout("document.title=title", 3000);
	}
};
document.addEventListener('visibilitychange', istitle);
