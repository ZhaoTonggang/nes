//密钥
let Session = sessionStorage.getItem("nesHeheda") || 0
if (Session != 1) {
	window.location.href = "/"
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
		dire.style.display = "block";
		btne.style.display = "flex";
		play1.style.display = "none";
		play2.style.display = "none";
		isMobile = false;
	} else {
		qhimg.src = "./image/button/gmb.png";
		qhp.innerHTML = "触屏";
		play1.style.display = "block";
		play2.style.display = "block";
		dire.style.display = "none";
		btne.style.display = "none";
		isMobile = true;
	}
}
mobile();
// 设置按钮状态
if (navigator.share) {
	document.getElementById("share").style.display = "inline";
} else {
	console.log("分享功能禁用")
}
//全局保存游戏信息
let gameInfo = null
//获取游戏列表，并init页面
getGameList(pageInit)
//重置游戏配置
function chongzai() {
	window.location.reload()
}
// 分享
function share() {
	navigator.share({
		title: '红白机游戏盒',
		url: window.location.href,
		text: '在线免费畅玩或下载红白机游戏，包括魂斗罗，超级玛丽，坦克大战等小霸王经典游戏，让我们一同找回童年的快乐！玩红白机游戏，就认准红白机游戏盒！'
	});
}
//获取游戏信息
function getGameList(cb) {
	//异步操作
	axios.get('./list.json').then(function(res) {
		cb && cb(res.data)
	}).catch(function(err) {
		console.log(err)
	})
}

function pageInit(gameList) {
	//获取id
	//index就是id-1
	let id = location.search.substring(2) || 1
	//数据化获取的1d
	id = decodeURI(id)
	//获取游戏信息
	gameInfo = gameList[id - 1]
	//展示游戏名称
	document.querySelector('#name').innerHTML = gameInfo.name + gameInfo.Version
	// 修改title
	document.title = gameInfo.name + gameInfo.Version + ' - ' + '红白机游戏盒'
	//实例化摇杆 摇杆配置依赖游戏信息
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
	joystick.init()
}
window.onload = function() {
	//禁止双击缩放
	document.addEventListener('dblclick', function(e) {
		e.preventDefault()
	})
	// 下载rom按钮
	document.getElementById('drom').onclick = function() {
		window.open('./roms/' + gameInfo.id + '.nes')
	}
	//监听加载按钮
	document.querySelector('#btn_load').onclick = function() {
		if (gameInfo) {
			//加载游戏
			nes_load_url("nes-canvas", "./roms/" + gameInfo.id + ".nes")
			//隐藏加载按钮
			this.style.display = 'none'
			// 隐藏标题
			document.getElementById('name').style.display = 'none'
			//浏览器全屏
			let de = document.querySelector('body') || document.documentElement;
			if (de.requestFullscreen) {
				de.requestFullscreen();
			} else if (de.mozRequestFullScreen) {
				de.mozRequestFullScreen();
			} else if (de.webkitRequestFullScreen) {
				de.webkitRequestFullScreen();
			}
		} else {
			alert("数据获取失败！")
			//如果游戏信息为空 则return
			return
		}
	}
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
	//NES按钮实例初始化
	nesBtn.init()
}
