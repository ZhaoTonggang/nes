//获取游戏信息
let gameInfo = null;
fetch('./list.json', {
		methods: 'GET',
		cache: 'no-cache'
	})
	//回调函数
	.then(response => {
		return response.json();
	})
	//处理服务器数据
	.then(data => {
		//获取id
		let id = location.search.substring(2);
		//数据化获取的1d
		id = decodeURI(id);
		//获取游戏信息
		gameInfo = data.filter(function(gameobj) {
			return gameobj.i == id;
		});
		// 判断数据是否存在
		if (id != "") {
			if (gameInfo == "") {
				nodata();
			}
		} else {
			nodata();
		}
		// 载入游戏
		let nes = null;
		if (gameInfo[0]) {
			//加载游戏
			let showload = document.getElementById('btn_load');
			let req = new XMLHttpRequest();
			req.open("GET", "./roms/" + gameInfo[0].i + ".nes");
			req.overrideMimeType("text/plain; charset=x-user-defined");
			req.onerror = (e) => console.error('这个错误发生在游戏加载环节', e);
			req.onload = function() {
				if (this.status === 200) {
					nes = req.responseText;
					showload.innerHTML = '加载完成';
					showload.classList.add("btnload");
					showload.classList.remove("showload");
					showload.innerHTML = '点击开始游戏';
					//监听加载按钮
					document.getElementById('btn_load').onclick = function() {
						nes_boot(nes);
						nes_init();
						//浏览器全屏
						let de = document.documentElement;
						if (de.requestFullscreen) {
							de.requestFullscreen();
						} else if (de.mozRequestFullScreen) {
							de.mozRequestFullScreen();
						} else if (de.webkitRequestFullScreen) {
							de.webkitRequestFullScreen();
						}
						this.style.display = 'none';
						// 隐藏标题
						document.getElementById('name').style.display = 'none';
					}
				} else if (this.status === 0) {
					req.onerror(e);
					showload.innerHTML = '请求数据失败';
				} else {
					req.onerror(e);
					showload.innerHTML = 'ROM加载失败';
				}
			};
			req.onprogress = function(e) {
				// 显示加载进度
				showload.innerHTML = '加载中(' + (e.loaded / e.total * 100).toFixed(0) + '%)';
			};
			req.send();
		} else {
			nodata();
		}
		//展示游戏名称
		document.getElementById('name').innerHTML = gameInfo[0].n + gameInfo[0].v;
		// 修改title
		document.title = gameInfo[0].n + gameInfo[0].v + ' - ' + '红白机游戏盒';
	})
	.catch(err => console.error('获取游戏信息失败'))
//实例化摇杆信息
let joystick = new Joystick({
	//容器
	el: "#direction",
	//摇杆颜色
	color: 'red',
	//摇杆大小
	size: 100,
	//绑定 上下左右 到 WSAD键
	keyCodes: [87, 83, 65, 68],
	//页面强制横屏时使用90
	rotate: 0,
	//按下时的回调
	btn_down_fn: (event) => {
		keyboard(nes.buttonDown, event)
	},
	//释放时的回调
	btn_up_fn: (event) => {
		keyboard(nes.buttonUp, event)
	},
})
//实例化NES按钮
let nesBtn = new VirtualNesBtn({
	//容器
	el: "#user_btn_box",
	//虚拟按钮按下时的回调 参数evt
	btn_down_fn: (event) => {
		keyboard(nes.buttonDown, event)
	},
	//虚拟按钮弹起时的回调 参数evt
	btn_up_fn: (event) => {
		keyboard(nes.buttonUp, event)
	},
	//按顺序分别是 select start b a
	keyCodes: [32, 13, 86, 66]
})
// 设置按钮状态
if (navigator.share) {
	document.getElementById("share").style.display = "inline";
} else {
	console.log("分享功能禁用")
}
// 数据异常处理
function nodata() {
	alert("403访问被拒绝！");
	window.location.href = "/";
	return;
}
//获取设备类型
let isMobile = /(iPhone|iPod|Android|ios|iOS|iPad|WebOS|Symbian|Windows Phone|Phone)/i.test(navigator.userAgent);
//设置操作方式
function mobile() {
	let dire = document.getElementById("direction");
	let btne = document.getElementById("user_btn_box");
	let play1 = document.getElementById("player1");
	let play2 = document.getElementById("player2");
	let qhimg = document.getElementById("qhimg");
	let qhp = document.getElementById("qhp");
	if (isMobile) {
		qhimg.src = "./image/button/key.png";
		qhp.innerHTML = "键盘";
		play1.style.display = "none";
		play2.style.display = "none";
		dire.style.display = "block";
		btne.style.display = "block";
		isMobile = false;
	} else {
		qhimg.src = "./image/button/gmb.png";
		qhp.innerHTML = "触屏";
		dire.style.display = "none";
		btne.style.display = "none";
		play1.style.display = "block";
		play2.style.display = "block";
		isMobile = true;
	}
}
mobile();
//重置游戏配置
function chongzai() {
	window.location.reload();
}
// 分享
function share() {
	navigator.share({
		title: '在线玩《' + gameInfo[0].n + '》',
		url: window.location.href,
		text: '推荐使用电脑，运行更加流畅！在线免费畅玩或下载红白机游戏，包括魂斗罗，超级玛丽，坦克大战等小霸王经典游戏，让我们一同找回童年的快乐！玩红白机游戏，就认准红白机游戏盒！'
	});
}
window.onload = function() {
	//禁止双击缩放
	document.addEventListener('dblclick', function(e) {
		e.preventDefault()
	}, {
		passive: false
	})
	// 下载rom按钮
	document.getElementById('drom').onclick = function() {
		window.open('./roms/' + gameInfo[0].i + '.nes')
	}
	// 初始化存档
	document.getElementById('hnbut').onclick = function() {
		let savesh = document.getElementById("btn_load").style.display;
		if (savesh == "none") {
			let hnbut = document.getElementById("hnbut");
			let hnul = document.getElementById("hnul");
			if (sbts) {
				sbts = false;
				let code = gameInfo[0].i.toString();
				HDB.initDB().then(() => {
					HDB.getDataListByCode(code).then((data) => {
						let result = "";
						for (let j = 0; j < data.length; j++) {
							result += '<li class="hnli"><div class="hnimg"><img src="' + data[j]
								.pic +
								'"></div><div class="hndiv"><p>存档【' + Number(j + 1) +
								'】</p><p>' + data[j]
								.time +
								'</p><button type="button" class="hnsbut" onclick="nessave(\'a\',\'' +
								data[j].code + '\', this, ' + data[j].id +
								')">覆盖</button><button type="button" class="hndbut" onclick="nessave(\'c\',\'' +
								data[j].code + '\' ,this,' + data[j].id +
								')">删除</button><button type="button" class="hnlbut" onclick="nessave(\'b\',\'' +
								data[j].code + '\',this,' + data[j].id +
								')">读取</button></div></li>';
						}
						for (let j = 0; j < 5 - data.length; j++) {
							result +=
								'<li class="hnli"><div class="hnimg"></div><div class="hndiv"><p>存档【' +
								Number(data.length + j + 1) +
								'】</p><p>无记录</p><button type="button" class="hnsbut" onclick="nessave(\'a\',\'' +
								code + '\',this)">保存</button></div></li>';
						}
						//获取存档列表
						hnul.innerHTML = result;
						hnul.style.display = "inline";
					})
				})
			} else {
				sbts = true;
				hnul.style.display = "none";
			}
		} else {
			cocoMessage.warning("请先开始游戏！", 2000);
		}
	}
	// 初始化遥感信息
	joystick.init();
	//NES按钮实例初始化
	nesBtn.init();
	// 移除遮罩
	document.body.classList.remove('is-loading');
}
