function VirtualNesBtn(opt) {
	//接收容器的标识
	this.el = opt.el
	//接收回调
	this.btn_down_fn = opt.btn_down_fn //fn
	this.btn_up_fn = opt.btn_up_fn //fn

	//保存按钮信息
	this.btns_info = []

	//为5个按钮添加带数字后缀的 id
	this.btns_info = [{}, {}, {}, {}, {}]
	this.btns_info[0].id = 'btn_select_' + Math.floor(Math.random() * 100000)
	this.btns_info[1].id = 'btn_start_' + Math.floor(Math.random() * 100000)
	this.btns_info[2].id = 'btn_c_' + Math.floor(Math.random() * 100000)
	this.btns_info[3].id = 'btn_b_' + Math.floor(Math.random() * 100000)
	this.btns_info[4].id = 'btn_a_' + Math.floor(Math.random() * 100000)

	//设定5个按钮的文本名称 "name"
	this.btns_info[0].name = 'SELECT'
	this.btns_info[1].name = 'START'
	this.btns_info[2].name = 'c'
	this.btns_info[3].name = 'B'
	this.btns_info[4].name = 'A'

	//配置5个按钮的 keycode 默认为 空格 回车 J K 
	this.btns_info[0].keyCode = opt.keyCodes && opt.keyCodes[0] || 32
	this.btns_info[1].keyCode = opt.keyCodes && opt.keyCodes[1] || 13
	this.btns_info[2].keyCode = 'macro_key'
	this.btns_info[3].keyCode = opt.keyCodes && opt.keyCodes[2] || 74
	this.btns_info[4].keyCode = opt.keyCodes && opt.keyCodes[3] || 75

}

//初始化 创建虚拟按钮
VirtualNesBtn.prototype.init = function(opt) {
	let me = this
	//创建5个按键
	let btn_select = document.createElement('span')
	let btn_start = document.createElement('span')
	let btn_c = document.createElement('span')
	let btn_b = document.createElement('span')
	let btn_a = document.createElement('span')

	//为5个按键设置css类名
	btn_select.classList.add('btn', 'btn-select')
	btn_start.classList.add('btn', 'btn-start')
	btn_c.classList.add('btn', 'btn-ab')
	btn_b.classList.add('btn', 'btn-b')
	btn_a.classList.add('btn', 'btn-a')

	//为5个按键设置id
	btn_select.id = me.btns_info[0].id
	btn_start.id = me.btns_info[1].id
	btn_c.id = me.btns_info[2].id
	btn_b.id = me.btns_info[3].id
	btn_a.id = me.btns_info[4].id

	//为5个按键设置 文本
	btn_select.innerText = me.btns_info[0].name
	btn_start.innerText = me.btns_info[1].name
	btn_c.innerText = me.btns_info[2].name
	btn_b.innerText = me.btns_info[3].name
	btn_a.innerText = me.btns_info[4].name

	//创建容器，并将5个按钮插入其中
	let nes_btn_box = document.createElement('div')
	nes_btn_box.classList.add('nes_btn_box')
	nes_btn_box.appendChild(btn_select)
	nes_btn_box.appendChild(btn_start)
	nes_btn_box.appendChild(btn_c)
	nes_btn_box.appendChild(btn_b)
	nes_btn_box.appendChild(btn_a)

	//插入到目标容器中
	let target = document.querySelector(me.el)
	target.appendChild(nes_btn_box)

	//设置touch事件监听
	target.addEventListener('touchstart', (evt) => {
		//阻止默认事件，防止快速点击时页面放大
		evt.preventDefault()
		//判断点中的是否是虚拟按钮
		let is_nes_btn = me.btns_info.some(function(item) {
			return item.id === evt.target.id
		})

		if (is_nes_btn) {
			//添加高亮
			evt.target.classList.add('isTouch')
			//处理此次点击
			me.handleBtn(evt, 'btn_down')
		}
	}, {
		passive: true
	});

	target.addEventListener('touchend', (evt) => {
		//判断点中的是否是虚拟按钮
		let is_nes_btn = me.btns_info.some(function(item) {
			return item.id === evt.target.id
		})

		if (is_nes_btn) {
			//移除高亮
			evt.target.classList.remove('isTouch')
			//处理此次点击
			me.handleBtn(evt, 'btn_up')
		}
	})
}

//对虚拟按键的id进行判断，返回要绑定的 keyCode
VirtualNesBtn.prototype.getCode = function(id) {
	let me = this
	//1.根据id查到按钮信息在数组中的下标
	let index = me.btns_info.findIndex(function(item) {
		return item.id === id
	})
	//2.根据下标找到对应的keyCode
	return me.btns_info[index].keyCode
}

//对按键进行处理
VirtualNesBtn.prototype.handleBtn = function(evt, type) {
	let me = this
	//1.找到keycode
	let keyCode = me.getCode(evt.target.id)
	//2.根据keycode判是否是宏按键
	if (keyCode === 'macro_key') {
		//要触发2个按键
		let evt_tem = {}
		let evt_tem2 = {}
		evt_tem.keyCode = me.btns_info[3].keyCode
		evt_tem2.keyCode = me.btns_info[4].keyCode
		if (type === 'btn_down') {
			me.btn_down_fn && me.btn_down_fn(evt_tem)
			me.btn_down_fn && me.btn_down_fn(evt_tem2)
		} else {
			me.btn_up_fn && me.btn_up_fn(evt_tem)
			me.btn_up_fn && me.btn_up_fn(evt_tem2)
		}
	} else {
		//添加keyCode属性
		evt.keyCode = keyCode
		//不是宏按键则执行相应的回调
		if (type === 'btn_down') {
			me.btn_down_fn && me.btn_down_fn(evt)
		} else {
			me.btn_up_fn && me.btn_up_fn(evt)
		}
	}
}
