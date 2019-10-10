/**
 * Created by lxz on 2017/8/22.
 */
module tick {
    export var running:boolean = false;
    export class TickManager {
        private _ticks: any;
        private _removeTicks: any;
        private _time: number = 0;

        public constructor() {
            this._ticks = {};
            this._removeTicks = {};
        }

        /* 开始进程运作*/
        start() {
            egret.startTick(this.onTicker, this);
            running = true;
        }

        /* 停止进程运作*/
        stop() {
            egret.stopTick(this.onTicker, this);
            running = false;
        }

        startTick(fun: (...args) => any, context: any) {
            let id = gameTool.getTypeId(context);
            let info = gameTool.poolList.getInstance(FunctionInfo);
            info.context = context;
            info.fun = fun;
            info.sleep = false;
            if (this._ticks.hasOwnProperty(id)) {
                mathTool.addValueByArray(info, this._ticks[id]);
            } else {
                this._ticks[id] = [info];
            }
        }

        stopTick(fun: (...args) => any, context: any) {
            let id = gameTool.getTypeId(context);
            let arr = this._ticks[id];
            let len = arr.length;
            for (let i = 0; i < len; i++) {
                if (arr[i].fun == fun) {
                    arr[i].sleep = true;
                    this.getRemoveTicks(id).push(arr[i]);
                    return;
                }
            }
        }

        stopTickByContext(context: any) {
            let id = gameTool.getTypeId(context);
            let arr = this._ticks[id];
            if (arr == null) {
                return;
            }
            let len = arr.length;
            let removes = this.getRemoveTicks(id);
            for (let i = 0; i < len; i++) {
                arr[i].sleep = true;
                removes.push(arr[i]);
            }
        }

        /************************************************************************************************************************/
        private onTicker(time: number) {
            if (this._time == 0) {
                this._time = time;
                return;
            }
            let interval = time - this._time;
            for (let id in this._ticks) {
                let arr = this._ticks[id];
                let len = arr.length;
                for (let i = 0; i < len; i++) {
                    arr[i].args = [interval];
                    arr[i].call();
                }
            }
            this.removeTicks();
            this._time = time;
            return false;
        }

        private getRemoveTicks(id: string): any[] {
            if(this._removeTicks[id] == null){
                this._removeTicks[id] = [];
            }
            return  this._removeTicks[id];
        }

        private removeTicks() {
            for (let id in this._removeTicks) {
                let arr = this._removeTicks[id];
                let len = arr.length;
                let infos = this._ticks[id];
                for (let i = 0; i < len; i++) {
                    gameTool.poolList.remove(arr[i]);
                    mathTool.cutValueByArray(arr[i], infos);
                }
                if (infos.length == 0) {
                    this._ticks[id] = null;
                    delete this._ticks[id];
                }
            }
            this._removeTicks = {};
        }

    }
    /************************************************************************************************************************/

    /* 开始进程运作*/
    export function start() {
        gameTool.singleton(TickManager).start();
    }

    /* 停止进程运作*/
    export function stop() {
        gameTool.singleton(TickManager).stop();
    }

    export function startTick(fun: (...args) => any, context: any) {
        gameTool.singleton(TickManager).startTick(fun, context);
    }

    export function stopTick(fun: (...args) => any, context: any) {
        gameTool.singleton(TickManager).stopTick(fun, context);
    }

    export function stopTickByContext(context: any) {
        gameTool.singleton(TickManager).stopTickByContext(context);
    }
}