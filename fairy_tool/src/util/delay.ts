/**
 * Created by lxz on 2017/11/15.
 */
module delay {
    export class DelayTransactManager {
        private _delayMainList: __Map;
        private _delayTransactList: { [key: string]: FunctionInfo[] };

        public constructor() {
            this._delayMainList = {};
            this._delayTransactList = {};
        }

        /**
         * 创建延迟事务主体
         */
        createDelayMain(context: any) {
            let id = gameTool.getTypeId(context);
            if (this._delayMainList[id] == null) {
                this._delayMainList[id] = context;
            }
        }

        /**
         * 是否拥有事务主体
         */
        hasDelayMain(context):boolean {
            let id = gameTool.getTypeId(context);
            return this._delayMainList[id] != null;
        }

        /**
         * 创建延迟事务
         */
        addDelayTransact(context, fun: __Function, ...args) {
            let info = gameTool.poolList.getInstance(FunctionInfo);
            info.context = context;
            info.fun = fun;
            info.args = args;
            let id = gameTool.getTypeId(context);
            if (this._delayTransactList[id] == null) {
                this._delayTransactList[id] = [info];
            } else {
                this._delayTransactList[id].push(info);
            }
        }

        /**
         * 执行所有延迟事务
         */
        executeAllTransact(context) {
            let id = gameTool.getTypeId(context);
            this._delayMainList[id] = null;
            delete this._delayMainList[id];
            if(this._delayTransactList[id]){
                let len = this._delayTransactList[id].length;
                for (let i = 0; i < len; i++) {
                    this._delayTransactList[id][i].onceCall();
                }
                this._delayTransactList[id] = null;
                delete this._delayTransactList[id];
            }
        }

        /**
         * 是否拥有延迟事务
         */
        hasTransact(context) {
            let id = gameTool.getTypeId(context);
            if(this._delayTransactList[id]){
                return this._delayTransactList[id].length > 0;
            }
            return false;
        }
    }
    /******************************************************************/
    /******************************************************************/
    /******************************************************************/
    /**
     * 创建延迟事务主体
     */
    export function createDelayMain(context) {
        gameTool.singleton(DelayTransactManager).createDelayMain(context);
    }

    /**
     * 是否拥有事务主体
     */
    export function hasDelayMain(context):boolean {
        return gameTool.singleton(DelayTransactManager).hasDelayMain(context);
    }

    /**
     * 创建延迟事务
     */
    export function addDelayTransact(context, fun: __Function, ...args) {
        gameTool.singleton(DelayTransactManager).addDelayTransact(context, fun, ...args);
    }

    /**
     * 执行所有延迟事务
     */
    export function executeAllTransact(context) {
        gameTool.singleton(DelayTransactManager).executeAllTransact(context);
    }

    /**
     * 是否拥有延迟事务
     */
    export function hasTransact(context) {
        gameTool.singleton(DelayTransactManager).hasTransact(context);
    }
}