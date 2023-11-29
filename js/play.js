// 严格模式
"use strict";
//获取游戏信息
let gameInfo = {};
const url = window.location.href;
const urldata = decodeURI(url);
let setgame = false;
window.EJS_pathtodata = "https://other.heheda.top/gamelib/";
// 参数合法性
const urlerr = () => {
	alert('参数传入不合法');
	window.location.href = "/";
	return;
};
// 判断数据合法性
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open('https://nes.heheda.top', '_self');
} else if (urldata.indexOf('?') > -1 && urldata.indexOf('&') > -1 && urldata.indexOf('=') > -1) {
	const urlarr = urldata.split('?')[1];
	if (urldata.indexOf('index') > -1) {
		window.open('./?' + urlarr, '_self');
	} else {
		const urlarrs = urlarr.split('&');
		for (let i = 0; i < urlarrs.length; i++) {
			let data = urlarrs[i].split('=');
			if (data == "") {
				urlerr();
			}
			gameInfo[data[0]] = data[1];
			// 初始化
			window.EJS_language = "zh-CN";
			window.EJS_player = "#nesgame";
			window.EJS_biosUrl = "";
			window.EJS_core = "nes";
			// 音量
			window.EJS_volume = 1;
			// 是否启用线程
			window.EJS_thread = true;
			// 开始按钮位置
			window.EJS_alignStartButton = "center";
			// 背景颜色
			window.EJS_backgroundColor = "#ffffff00";
			// 背景模糊
			window.EJS_backgroundBlur = true;
			window.EJS_onGameStart = () => {
				cocoMessage.success("启动游戏引擎！", 2000);
				showload.style.display = 'none';
				//隐藏鼠标和工具栏
				const hhtml = document.getElementsByTagName("html")[0];
				const pl1 = document.getElementById("player1");
				const pl2 = document.getElementById("player2");
				const gname = document.getElementById("name");
				const titler = document.getElementsByClassName("titler")[0];
				const titlel = document.getElementsByClassName("titlel")[0];
				let timer = null;
				let isshow = false;
				document.onmousemove = () => {
					if (isshow) {
						isshow = false;
						hhtml.style.cursor = "default";
						pl2.style.right = "20px";
						pl1.style.left = "20px";
						gname.style.top = "20px";
						titler.style.left = "20px";
						titlel.style.right = "20px";
					} else {
						if (timer) {
							clearTimeout(timer);
						};
						timer = setTimeout(() => {
							isshow = true;
							hhtml.style.cursor = "none";
							pl2.style.right = "-200px";
							pl1.style.left = "-200px";
							gname.style.top = "-120px";
							titler.style.left = "-220px";
							titlel.style.right = "-220px";
						}, 3000)
					};
				};
				setgame = true;
			};
			// 移除遮罩
			document.body.classList.remove('is-loading');
		};
	}
} else {
	urlerr();
};
// 获取封面
window.EJS_backgroundImage = '../imgs/' + gameInfo.i + '.png';
// 加载提示
const showload = document.getElementById('btn_load');
const showtext = () => {
	showload.onclick = null;
	cocoMessage.error("初始化失败！", 2000);
	showload.classList.remove("btnload");
	showload.classList.add("showload");
	showload.innerHTML = '初始化失败';
};
// 载入游戏
const req = new XMLHttpRequest();
req.open("GET", "../roms/" + gameInfo.i + ".zip");
req.overrideMimeType("application/zip;charset=x-user-defined");
req.onerror = (e) => console.error('这个错误发生在游戏加载环节', e);
req.onprogress = (e) => {
	// 显示加载进度
	showload.innerHTML = '加载中(' + (e.loaded / e.total * 100).toFixed(0) + '%)';
};
req.onloadstart = () => {
	cocoMessage.warning("ROM载入中！", 2000);
};
req.onload = () => {
	if (req.status === 200) {
		const nzip = new JSZip();
		cocoMessage.success("ROM载入成功！", 2000);
		nzip.loadAsync(req.responseText)
			.then(zip => {
				if (!zip) {
					showtext();
				} else {
					cocoMessage.warning("释放资源中！", 2000);
					zip.file(gameInfo.i + ".nes").async("blob")
						.then(res => {
							window.EJS_gameUrl = res;
							cocoMessage.success("资源配置完成！", 2000);
							showload.innerHTML = '加载完成';
							showload.style.display = 'none';
						});
				}
			})
		//监听加载按钮
		showload.onclick = () => {};
	} else if (req.status === 0) {
		req.onerror();
		showload.innerHTML = '请求数据失败';
		cocoMessage.error("请求数据失败！", 2000);
	} else {
		req.onerror();
		showload.innerHTML = 'ROM加载失败';
		cocoMessage.error("ROM加载失败！", 2000);
	};
};
req.send();
//展示游戏名称
let gnm = gameInfo.v;
if (gnm != 'false') {
	gnm = '(' + gnm + ')';
} else {
	gnm = '';
}
window.EJS_gameName = gameInfo.n + gnm;
document.getElementById('name').innerHTML = gameInfo.n + gnm;
// 修改title
document.title = gameInfo.n + gnm + ' - ' + '红白机游戏盒';
// 设置按钮状态
if (navigator.share) {
	document.getElementById("share").style.display = "inline";
} else {
	console.log("分享功能禁用");
};
//获取设备类型
let isMobile = /(iPhone|iPod|Android|ios|iOS|iPad|WebOS|Symbian|Windows Phone|Phone)/i.test(navigator.userAgent);
//设置操作方式
const mobile = () => {
	const player1 = document.getElementById("player1");
	const player2 = document.getElementById("player2");
	if (isMobile) {
		player1.style.display = "none";
		player2.style.display = "none";
		isMobile = false;
	} else {
		player1.style.display = "block";
		player2.style.display = "block";
		isMobile = true;
	}

}
mobile();
//重置游戏配置
const chongzai = () => {
	window.location.reload();
}
// 分享
const share = () => {
	navigator.share({
		title: '在线玩《' + gameInfo.n + '》',
		url: url,
		text: '推荐使用电脑，运行更加流畅！在线免费畅玩或下载红白机游戏，包括魂斗罗，超级玛丽，坦克大战等小霸王经典游戏，让我们一同找回童年的快乐！玩红白机游戏，就认准红白机游戏盒！'
	});
}
// 下载rom按钮
const dowrom = () => {
	const dorom = confirm('您要下载此游戏的ROM文件吗？');
	if (dorom == true) {
		cocoMessage.warning("即将开始下载！", 2000);
		window.open('../roms/' + gameInfo.i + '.zip');
	} else {
		cocoMessage.warning("您取消了下载！", 2000);
	}
};
// 截屏
const screenshot = () => {
	if (setgame) {
		const canvas = document.getElementsByClassName("ejs_canvas")[0];
		let data = canvas.toDataURL('image/png');
		let image = new Image();
		image.src = data;
		let w = window.open("", "_blank");
		w.document.write(image.outerHTML);
	} else {
		cocoMessage.warning("请先开始游戏！", 2000);
	}
}
// 初始化存档
// const savedata = () => {
// 	const savesh = document.getElementById("btn_load").style.display;
// 	if (savesh == "none") {
// 		const hnbut = document.getElementById("hnbut");
// 		const hnul = document.getElementById("hnul");
// 		if (sbts) {
// 			sbts = false;
// 			let code = gameInfo.i.toString();
// 			HDB.initDB().then(() => {
// 				HDB.getDataListByCode(code).then((data) => {
// 					let result = "";
// 					for (let j = 0; j < data.length; j++) {
// 						result += '<li class="hnli"><div class="hnimg"><img src="' + data[j]
// 							.pic +
// 							'"></div><div class="hndiv"><p>存档【' + Number(j + 1) +
// 							'】</p><p>' + data[j]
// 							.time +
// 							'</p><button type="button" class="hnsbut" onclick="nessave(\'a\',\'' +
// 							data[j].code + '\',this,' + data[j].id +
// 							')">覆盖</button><button type="button" class="hndbut" onclick="nessave(\'c\',\'' +
// 							data[j].code + '\',this,' + data[j].id +
// 							')">删除</button><button type="button" class="hnlbut" onclick="nessave(\'b\',\'' +
// 							data[j].code + '\',this,' + data[j].id +
// 							')">读取</button></div></li>';
// 					}
// 					for (let k = 0; k < 5 - data.length; k++) {
// 						result +=
// 							'<li class="hnli"><div class="hnimg"></div><div class="hndiv"><p>存档【' +
// 							Number(data.length + k + 1) +
// 							'】</p><p>无记录</p><button type="button" class="hnsbut" onclick="nessave(\'a\',\'' +
// 							code + '\',this)">保存</button></div></li>';
// 					}
// 					//获取存档列表
// 					hnul.innerHTML = result;
// 					hnul.style.display = "inline";
// 				})
// 			})
// 		} else {
// 			document.onclick = () => {
// 				let cobj = event.srcElement;
// 				if (cobj.id === "hnul") {
// 					sbts = false;
// 				} else {
// 					hnul.style.display = "none";
// 					sbts = true;
// 				}
// 			}
// 		}
// 	} else {
// 		cocoMessage.warning("请先开始游戏！", 2000);
// 	}
// }
//禁止双击缩放
document.addEventListener('dblclick', (e) => {
	e.preventDefault()
}, {
	passive: false
});