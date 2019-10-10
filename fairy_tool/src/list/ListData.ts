/**
 *
 * @author 
 *
 */
module gameTool {
    export class ListData {
        // 键值
        private _key: string;
        // 类名
        private _cl: any;
        // 初始化数据
        private _initObj: Object;

        public constructor(cl: any,initObj: Object = null) {
            this._key = cl.prototype["__class__"];
            this._cl = cl;
            this._initObj = initObj;
        }

        public getKey(): string {
            return this._key;
        }

        public setKey(key: string) {
            this._key = key;
        }

        public getCl(): any {
            return this._cl;
        }

        public set setCl(cl: any){
            this._cl = cl;
        }

        public getInitObj(): Object {
            return this._initObj;
        }

        public setInitObj(initObj: Object) {
            this._initObj = initObj;
        }

    }
}

