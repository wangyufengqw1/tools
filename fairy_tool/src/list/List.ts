/**
 *
 * @author
 *
 */
module gameTool {
    export class List {
        private _list: any;

        // 池列表
        constructor() {
            this._list = {};
        }

        /* 释放*/
        dispose() {
            for (var key in this._list) {
                (this._list[key] as gameTool.GamePool).dispose();
                this._list[key] = null;
                delete this._list[key];
            }
        }

        /**
         * 批量导入列表
         */
        addBatch(list: gameTool.ListData[]) {
            var len: number = list.length;
            var i: number = 0;
            for (i = 0; i < len; i++) {
                this.keyToCl(list[i]);
            }
        }

        /**
         * 添加单个定义
         */
        addSingal(data: gameTool.ListData) {
            this.keyToCl(data);
        }

        /*获取实例*/
        getInstance < T > (keyClass: {
            new(): T;
        }, ...args): T {
            let key = definiton.getNameByClass(keyClass);
            this.checkListData(keyClass);
            let obj = (this._list[key] as gameTool.GamePool).getFreeObj(...args);
            return <T > obj;
        }

        /*回收实例*/
        remove(obj: any): void {
            (this._list[definiton.getClassNameByObject(obj)] as gameTool.GamePool).retrieve(obj);
        }

        /*回收最早实例化的对象*/
        removeFrontObj(keyClass: any): void {
            let key = definiton.getNameByClass(keyClass);
            var pool: gameTool.GamePool = this._list[key] as gameTool.GamePool;
            if (pool.getList().length) {
                (this._list[key] as gameTool.GamePool).retrieve(pool.getList()[0]);
            }
        }

        /*回收最晚实例化的对象*/
        removeBackObj(keyClass: any): void {
            let key = definiton.getNameByClass(keyClass);
            var pool: gameTool.GamePool = this._list[key] as gameTool.GamePool;
            if (pool.getList().length) {
                (this._list[key] as gameTool.GamePool).retrieve(pool.getList()[pool.getList().length - 1]);
            }
        }

        /*获取未回收的所有对象*/
        getActivityObj < T > (keyClass: {
            new(): T;
        }): T[] {
            let key = definiton.getNameByClass(keyClass);
            this.checkListData(keyClass);
            return (this._list[key] as gameTool.GamePool).getList();
        }

        /*播放对应的IPlay*/
        play < T > (keyClass: {
            new(): T;
        }): void {
            this.checkListData(keyClass);
            this.playByMethod(definiton.getNameByClass(keyClass), "play");
        }

        /*
         * 播放对应的方法
         * key			键值
         * method		要执行的方法
         * args			方法参数
         * fun		    限制条件
         */
        playByMethod(key: string, method: __Function, args ? : any[], fun ? : (item) => boolean, context ? : any): void {
            var pool: gameTool.GamePool = this._list[key] as gameTool.GamePool;
            var list: any[] = pool.getList();
            let arr = fun ? mathTool.findList(list, fun, context) : list;
            for (var i in arr) {
                if (typeof method == "string") {
                    if (args && typeof args[0] == typeof arr[i][method]) { //赋值
                        arr[i][method] = args[0];
                    } else {
                        arr[i][method].apply(arr[i], args);
                    }
                } else {
                    method.apply(arr[i], args);
                }
            }
        }

        /*回收全部活动实例*/
        removeAll(keyClass: any): void {
            var arr: any[] = this.getActivityObj(keyClass);
            while (arr.length) {
                // 是为了让先出来的实例回收之后也是先出来
                this.remove(arr[arr.length - 1]);
            }
        }

        /* 销毁全部活动实例*/
        disposeAll(keyClass: any): void {
            var arr: any[] = this.getActivityObj(keyClass);
            while (arr.length) {
                // 是为了让先出来的实例回收之后也是先出来
                var obj: any = arr[arr.length - 1];
                this.remove(obj);
            }
            let key = definiton.getNameByClass(keyClass);
            (this._list[key] as gameTool.GamePool).clearPool();
        }

        /************************************************************************************************/
        /*生成池对象*/
        private keyToCl(listData: gameTool.ListData): void {
            if (!this._list[listData.getKey()]) {
                this._list[listData.getKey()] = new gameTool.GamePool(listData.getCl(), listData.getInitObj());
            }
        }

        private checkListData < T > (keyClass: {
            new(): T;
        }) {
            let key = definiton.getNameByClass(keyClass);
            if (this._list[key] == null) {
                this.keyToCl(new ListData(keyClass));
            }
        }
        /************************************************************************************************/
    }
}