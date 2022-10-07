//密钥
sessionStorage.setItem("nesHeheda", "1")
// 加载
const {
	createApp
} = Vue
createApp({
	data() {
		return {
			list: []
		}
	},
	created() {
		//获取游戏列表
		this.getGameList()
	},
	methods: {
		startGame(id) {
			window.open('./play.html?=' + id, '_self')
		},
		getGameList: function() {
			fetch('./list.json')
				//回调函数
				.then(response => response.json())
				//处理服务器数据
				.then(data => this.list = data)
				.catch(err => console.log('获取游戏列表失败'))
		}
	}
}).mount('#app')
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
