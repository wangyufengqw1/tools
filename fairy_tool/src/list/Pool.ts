/**
 *
 * @author
 *
 */
module gameTool {
    export class GamePool {
        // 记录所有未回收的实例
        private _list: any[];
        // 记录已回收的实例
        private _arr: any[];
        // 实例类型
        private _classRef: any;
        // 初始参数
        private _initObj: Object;

        public constructor(classRef: any, initObj: Object = null) {
            this._arr = [];
            this._list = [];
            this._classRef = classRef;
            this._initObj = initObj;
        }

        /* 释放*/
        dispose(): void {
            this._list = null;
            this._arr = null;
            this._classRef = null;
            this._initObj = null;
        }

        /**
         * 获取一个空闲
         * @return
         *
         */
        getFreeObj(...args): any {
            var o: any;
            if (this._arr.length <= 0) {
                o = new this._classRef;
                this._arr.push(o);
            }
            o = this._arr.pop();
            this._list.push(o);
            if (definiton.hasProperty(o, "initData")) {
                o.initData.apply(o, args);
                o.hasInit = true;
            } else {
                //trace.error("该类型不是池回收对象要实现IPoolObject",[this._classRef]);
            }
            return o;
        }

        /**
         * 回收
         * @param ro
         *
         */
        retrieve(ro: any): void {
            var index: number = this._list.indexOf(ro);
            if (-1 != index) {
                this._list.splice(index, 1);
            }
            index = this._arr.indexOf(ro);
            if (-1 == index) {
                if (definiton.hasProperty(ro, "retrieve")) {
                    ro.retrieve();
                    ro.hasInit = false;
                } else {
                    //trace.error("该类型不是池回收对象要实现IPoolObject",[this._classRef]);
                }
                this._arr.push(ro);
            }
        }

        /************************************************************************************************************************/
        /**
         * 返回未回收的所有实例
         */
        getList(): any[] {
            return this._list;
        }

        getClassRef(): any {
            return this._classRef;
        }

        /**
         * 回收池里未回收的所有实例
         */
        removePool(): void {
            while (this._list.length) {
                this.retrieve(this._list.pop());
            }
        }

        /**
         * 回收池里未回收的所有实例并释放掉回收池里的所有实例
         */
        clearPool(): void {
            this.removePool();
            while (this._arr.length) {
                var object: Object = this._arr.pop();
                if (definiton.hasProperty(object, "dispose")) {
                    object["dispose"]();
                }
            }
        }
    }
}

