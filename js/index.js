// 加载
const {
	createApp
} = Vue
createApp({
	data() {
		return {
			game_list: []
		}
	},
	created() {
		//获取游戏列表
		this.getGameList()
	},
	methods: {
		startGame(id) {
			window.open('./game.html?=' + id, '_self')
		},
		getGameList: async function() {
			try {
				let result = await axios.get('./game_list.json')
				this.game_list = result.data
			} catch (err) {
				console.log(err)
			}
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
//密钥
sessionStorage.setItem("nesHeheda", "1")
