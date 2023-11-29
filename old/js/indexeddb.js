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
	return fmt;
};

// 打开并创建数据库
function openDB(dbName, version = 1) {
	return new Promise((resolve, reject) => {
		let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		let db;
		// 打开并创建数据库
		let request = indexedDB.open(dbName, version);
		// 成功回调
		request.onsuccess = function(event) {
			// 数据库对象
			db = event.target.result;
			console.log("打开成功");
			resolve(db);
		};
		// 失败回调
		request.onerror = function(event) {
			console.log("打开失败");
		};
		// 更新数据
		request.onupgradeneeded = function(event) {
			console.log("onupgradeneeded");
			// 数据库对象
			db = event.target.result;
			let objectStore;
			// 创建数据库
			objectStore = db.createObjectStore("users", {
				// 设置主键
				keyPath: "uuid"
				// 实现自增
				// autoIncrement:true
			});
			// 创建索引
			objectStore.createIndex("uuid", "uuid", {
				unique: true
			});
			objectStore.createIndex("name", "name", {
				unique: false
			});
			objectStore.createIndex("age", "age", {
				unique: false
			});
		};
	});
}

// 插入数据
function addDate(db, storeName, data) {
	let request = db
		// 指定操作模式
		.transaction([storeName], "readwrite")
		// 创建数据库
		.objectStore(storeName)
		.add(data);
	request.onsuccess = function(event) {
		console.log("数据写入成功");
	}
	request.onerror = function(event) {
		console.log("数据写入失败");
	}
}

// 通过主键查询数据
function getDataByKey(db, storeName, key) {
	return new Promise((resolve, reject) => {
		// 事务
		let transaction = db.transaction([storeName]);
		// 创建对象
		let objectStore = transaction.objectStore(storeName);
		// 通过主键获取数据
		let request = objectStore.get(key);
		request.onerror = function(event) {
			console.log("事务失败");
		};
		request.onsuccess = function(event) {
			console.log("主键查询结果：", request.result);
		};
	});
}

// 通过游标查询数据
function cursorGetBata(db, storeName) {
	let list = [];
	let store = db
		// 事务
		.transaction(storeName, "readwrite")
		// 仓库对象
		.objectStore(storeName);
	// 指针对象
	let request = store.openCursor();
	// 游标开启成功,逐行读数据
	request.onsuccess = function(e) {
		let cursor = e.target.result;
		if (cursor) {
			// 必须要检查
			list.push(cursor.value);
			// 遍历了存储对象中的所有内容
			cursor.continue();
		} else {
			console.log("游标读取的数据：", list);
		}
	}
}

// 通过索引查询数据
function getDataByIndex(db, storeName, indexName, indexValue) {
	let store = db
		.transaction(storeName, "readwrite")
		.objectStore(storeName);
	let request = store.index(indexName).get(indexValue);
	request.onerror = function() {
		console.log("事务失败");
	};
	request.onsuccess = function(e) {
		let result = e.target.result;
		console.log("索引查询结果：", result);
	};
}

// 通过索引和游标查询数据
function cursorGetDataByIndex(db, storeName, indexName, indexValue) {
	let list = [];
	let store = db
		// 仓库对象
		.transaction(storeName, "readwrite")
		.objectStore(storeName);
	let request = store
		// 索引对象
		.index(indexName)
		// 指针对象
		.openCursor(IDBKeyRange.only(indexValue));
	request.onsuccess = function(e) {
		let cursor = e.target.result;
		if (cursor) {
			// 必须要检查
			list.push(cursor.value);
			// 遍历储存对象中的所有内容
			cursor.continue();
		} else {
			console.log("游标查询结果：", list);
		}
	};
	request.onerror = function(e) {};
}

// 通过索引和游标分页查询
function cursorGetDataByIndexAndPage(db, storeName, indexName, indexValue, page, pageSize) {
	let list = [];
	// 计数器
	let counter = 0;
	// 是否跳过多少条查询
	let advanced = true;
	// 仓库对象
	let store = db.transaction(storeName, "readwrite")
		.objectStore(storeName);
	let request = store
		// 索引对象
		.index(indexName)
		// 指针对象
		.openCursor(IDBKeyRange.only(indexValue));
	request.onsuccess = function(e) {
		let cursor = e.target.result;
		if (page > 1 && advanced) {
			advanced = false;
			// 跳过多少条
			cursor.advance((page - 1) * pageSize);
			return;
		}
		if (cursor) {
			// 必须要检查
			list.push(cursor.value);
			counter++;
			if (counter < pageSize) {
				// 遍历储存对象中的所有内容
				cursor.continue();
			} else {
				cursor = null;
				console.log("分页查询结果：", list);
			}
		} else {
			console.log("分页查询结果：", list);
		}
	};
	request.onerror = function(e) {}
}

// 更新数据
function updateDB(db, storeName, data) {
	let request = db
		// 事务对象
		.transaction([storeName], "readwrite")
		// 仓库对象
		.objectStore(storeName)
		.put(data);
	request.onsuccess = function() {
		console.log("数据更新成功");
	};
	request.onerror = function() {
		console.log("数据更新失败");
	};
}

// 通过主键删除数据
function deleteDB(db, storeName, id) {
	let request = db
		.transaction([storeName], "readwrite")
		.objectStore(storeName)
		.delete(id);
	request.onsuccess = function() {
		console.log("数据删除成功");
	};
	request.onerror = function() {
		console.log("数据删除失败");
	}
}

// 通过索引和游标删除数据
function cursorDelete(db, storeName, indexName, indexValue) {
	let store = db.transaction(storeName, "readwrite").objectStore(storeName);
	let request = store
		// 索引对象
		.index(indexName)
		// 指针对象
		.openCursor(IDBKeyRange.only(indexValue));
	request.onsuccess = function(e) {
		let cursor = e.target.result;
		let deleteRequest;
		if (cursor) {
			// 请求删除当前项
			deleteRequest = cursor.delete();
			deleteRequest.onerror = function() {
				console.log("游标删除失败");
			};
			deleteRequest.onsuccess = function() {
				console.log("游标删除成功");
			};
			cursor.continue();
		}
	};
}


// 关闭数据库
function closeDB(db) {
	db.close();
	console.log("数据库已关闭");
}

// 删除数据库
function deleteDBAll(dbName) {
	console.log(dbName);
	let deleteRequest = window.indexedDB.deleteDatabase(dbName);
	deleteRequest.onerror = function(event) {
		console.log("删除失败");
	};
	deleteRequest.onsuccess = function(event) {
		console.log("删除成功");
	}
}
