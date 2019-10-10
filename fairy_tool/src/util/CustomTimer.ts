/**
 * Created by lxz on 2017/9/1.
 */
module gameTool {
    export class CustomTimer extends egret.Timer{
        private _runFun: FunctionInfo;
        private _completeFun: FunctionInfo;

        public constructor(delay: number, repeatCount?: number) {
            super(delay , repeatCount);
            this._runFun = new FunctionInfo();
            this._completeFun = new FunctionInfo();
        }

        dispose() {
            this.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
            this.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
            this.reset();
            this._runFun.dispose();
            this._completeFun.dispose();
            this._runFun = null;
            this._completeFun = null;
        }
        /******************************************************************/
        restart() {
            this.reset();
            this.start();
        }

        setRunCall(fun: (...args) => any, context: any, ...args) {
            this._runFun.fun = fun;
            this._runFun.context = context;
            this._runFun.args = args;
            this.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        }

        setRunArgs(...args) {
            this._runFun.args = args;
        }

        setCompleteCall(fun: (...args) => any, context: any, ...args) {
            this._completeFun.fun = fun;
            this._completeFun.context = context;
            this._completeFun.args = args;
            this.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onTimerComplete, this);
        }

        setCompleteArgs(...args) {
            this._completeFun.args = args;
        }

        /******************************************************************/
        private onTimer() {
            this._runFun.call();
        }

        private onTimerComplete() {
            this._completeFun.call();
        }
        /******************************************************************/
        get surplus():number{
            return this.repeatCount - this.currentCount;
        }
    }
}