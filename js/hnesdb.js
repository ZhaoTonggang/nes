// 格式化时间
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
			"00" + o[k]).substr(("" + o[k]).length)));
	return fmt
};
// 创建indexedDB
class hehedaDB {
	constructor() {
		this.DBName = "HnesDB";
		this.DBStore = "HnesDBs";
		this.DB = {};
		this.cIndex = "HEHEDA";
	}
	initDB() {
		let that = this;
		let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		let request = indexedDB.open(that.DBName);
		return new Promise(function(resovle, reject) {
			request.onerror = function(e) {
				console.log('open Error!');
				resovle();
			};
			request.onsuccess = function(e) {
				that.DB = e.target.result;
				resovle();
			};
			request.onupgradeneeded = function(e) {
				let db = e.target.result;
				if (!db.objectStoreNames.contains(that.DBStore)) {
					try {
						let store = db.createObjectStore(that.DBStore, {
							keyPath: 'id',
							autoIncrement: true
						});
						store.createIndex(that.cIndex, 'code', {
							unique: false
						})
					} catch (e) {
						console.log(e)
					}
				}
			}
		}).catch(error => {
			console.log('Error！');
		});
	}
	setData(data) {
		let that = this;
		return new Promise(function(resovle, reject) {
			let request = that.DB.transaction(that.DBStore, 'readwrite')
				.objectStore(that.DBStore)
				.put(data);
			request.onsuccess = function(event) {
				resovle(event.target.result);
			};
			request.onerror = function(event) {
				console.log('Error！');
			}
		});
	}
	getDataListByCode(code) {
		let that = this;
		return new Promise(function(resovle, reject) {
			let request = that.DB
				.transaction(that.DBStore)
				.objectStore(that.DBStore)
				.index(that.cIndex)
				.openCursor(IDBKeyRange.only(code));
			let dataList = [];
			request.onsuccess = function(event) {
				let cursor = event.target.result;
				let isEnd = true;
				if (cursor) {
					let cursorVal = cursor.value;
					let info = new Object();
					info.id = cursorVal.id;
					info.code = cursorVal.code;
					info.pic = cursorVal.pic;
					info.time = cursorVal.time;
					dataList.push(info);
					isEnd = false;
					cursor.continue()
				}
				if (isEnd) {
					resovle(dataList);
				}
			}

			request.onerror = function(event) {
				console.log('Error！');
			}
		});
	}
	getData(id) {
		let that = this;
		return new Promise(function(resovle, reject) {
			let request = that.DB.transaction(that.DBStore, 'readwrite')
				.objectStore(that.DBStore)
				.get(id);
			request.onsuccess = function(event) {
				resovle(event.target.result.data);
			};
			request.onerror = function(event) {
				console.log('Error！');
			}
		});
	}
}
let HDB = new hehedaDB();
let sbts = true;
// 存取操作
function nessave(type, code, dom, id) {
	let canvas = document.getElementById("nes-canvas");
	let nesInfo = new Object();
	nesInfo.code = code.toString();
	//获取图片
	nesInfo.pic = canvas.toDataURL("image/jpeg", 1);
	// 获取日期
	nesInfo.time = new Date().Format("yyyy年MM月dd日 hh:mm:ss");
	//获取进度
	nesInfo.data = nes.toJSON();
	if (typeof id != "undefined") {
		nesInfo.id = id;
	}
	HDB.initDB().then(() => {
		let hnbut = document.getElementById("hnbut");
		let hnul = document.getElementById("hnul");
		if (type) {
			HDB.setData(nesInfo).then(() => {
				sbts = true;
				hnul.style.display = "none";
				cocoMessage.success("保存成功！", 2000);
			});
		} else {
			HDB.getData(id).then((d) => {
				nes.fromJSON(d);
				sbts = true;
				hnul.style.display = "none";
				cocoMessage.success("读取成功！", 2000);
			});
		}
	})
}
// 菜单
function gsave() {
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
						result += ` <li class="hnli">
			            <div class="hnimg"><img src="${data[j].pic}"></div>
			            <div class="hndiv">
			            <p>存档【${j+1}】</p>
						<p>${data[j].time}</p>
						<button type="button" class="hnsbut" onclick="nessave(true,'${data[j].code}',this,${data[j].id})">保存</button>
			            <button type="button" class="hnlbut" onclick="nessave(false,'${data[j].code}',this,${data[j].id})" style="display: inline-block;">读取</button>
			            </div>
			            </li>`;
					}
					for (let j = 0; j < 5 - data.length; j++) {
						result += ` <li class="hnli">
						<div class="hnimg"></div>
			                    <div class="hndiv">
			                        <p>存档【${data.length+j+1}】</p>
									<p>无记录</p>
			                        <button type="button" class="hnsbut" onclick="nessave(true,'${code}',this)">保存</button>
			                    </div>
								</li>`;
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
