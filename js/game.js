//全局保存游戏信息
let gameInfo = null
//获取游戏列表，并init页面
getGameList(pageInit)
window.onload = function() {
	//禁止双击缩放
	document.addEventListener('dblclick', function(e) {
		e.preventDefault()
	})

	//监听加载按钮
	document.querySelector('#btn_load').onclick = function() {
		//如果游戏信息为空 则return
		if (!gameInfo) return
		//fullScreen(document.querySelector('#wrap'))
		//加载游戏
		nes_load_url("nes-canvas", "./roms/" + gameInfo.name + ".nes")
		//隐藏加载按钮
		this.style.display = 'none'
	}
	//重置游戏配置
	document.querySelector('#chongzhi').onclick = function() {
		window.location.reload()
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
//初次加载判断横竖屏
handleDirection()
//监听横竖屏切换
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", handleDirection, false);
//获取游戏信息
function getGameList(cb) {
	//异步操作
	axios.get('./game_list.json').then(function(res) {
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
	// alert(id)
	gameInfo = gameList[id - 1]
	// alert(gameInfo)
	//展示游戏名称
	document.querySelector('#name').innerHTML = gameInfo.name
	// 修改title
	document.title = gameInfo.name + ' - ' + '红白之家'
	//根据游戏信息配置摇杆
	let isFourBtn = gameInfo.isFourBtn
	let color = isFourBtn ? 'lightcoral' : 'royalblue'
	//实例化摇杆 摇杆配置依赖游戏信息
	let joystick = new Joystick({
		//容器
		el: "#direction",
		//摇杆颜色
		color: 'red',
		//摇杆大小
		size: 120,
		//8键模式
		// isFourBtn: isFourBtn,
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
//判断手机的横竖屏状态
function handleDirection() {
	//alert(0)
	if (window.orientation == 180 || window.orientation == 0) {
		//竖屏状态
		setClass('normal')
	}
	if (window.orientation == 90 || window.orientation == -90) {
		//横屏状态
		setClass('transverse')
	}
}
//根据手机屏幕方向设置class类
function setClass(direction) {
	let wrap = document.querySelector("#wrap")
	if (direction === 'normal') {
		//竖屏状态
		wrap.setAttribute('class', 'normal')
	} else {
		//横屏状态
		wrap.setAttribute('class', 'transverse')
	}
}
// 封装进入全屏的函数
function fullScreen(node) {
	// 判断浏览器是否支持全屏api
	if (document.fullscreenEnabled || document.msFullscreenEnabled) {
		// 判断是标准浏览器还是IE
		if (node.requestFullscreen) {
			// chrome和火狐
			node.requestFullscreen()
		} else if (node.msRequestFullscreen) {
			// IE11
			node.msRequestFullscreen()
		}
	} else {
		console.log("当前浏览器不支持全屏模式")
	}
}
// 封装退出全屏的函数（直接esc键最简单）
function exitfullScreen() {
	//判断是否已经进入全屏模式
	let fullscreenElement = document.fullscreenElement || document.msFullscreenElement
	if (!fullscreenElement) {
		//console.log("不是全屏状态")
		return
	}
	// 确保在非全屏状态才调用下面的代码，不然会弹警告
	if (document.exitFullscreen) {
		//标准浏览器
		document.exitFullscreen()
	} else if (document.msExitFullscreen) {
		//IE浏览器
		document.msExitFullscreen()
	}
}

//密钥
document.addEventListener("DOMContentLoaded", function(e) {
	let Session = sessionStorage.getItem("nesHeheda") || 0
	if (Session != 1) {
		window.location.href = "/"
	}
})
