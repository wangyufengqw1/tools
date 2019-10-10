module base {
	export class BaseTip extends fairygui.GComponent {
        private _message: string;
        protected _ui: fairygui.GComponent;
        private _content: fairygui.GTextField;
        private _animationType: number;
        private _skinName: string;
        private _animation: TipAnimationBase;

        public constructor(skin: string, message: string) {
            super();
            this._skinName = skin;
            this._message = message;
            this.initView();
            this.touchable = false;
            gui.addGComponentToStage(this,define.WindowType.TIP_LAYER);
            this.start();
        }

        dispose() {
            this._animation = null;
            this._ui.dispose();
            this._ui = null;
            this._content = null;
            this.dispatchEvent(new egret.Event(egret.Event.CLOSE));
            super.dispose();
        }

        /**
         * 开始飘窗
         */
        start() {
            if (this._animation) {
                this._animation.start(this.dispose, this);
            } else {
                this.dispose();
            }
        }

        /******************************************************************/
        protected initView() {
            this._ui = fairygui.UIPackage.createObject("common","tip").asCom;
            this.addChild(this._ui);
            this._content = this._ui.getChild("content").asTextField;
            this._content.text = this._message;
        }

        get animationType(): number {
            return this._animationType;
        }

        set animationType(value: number) {
            if (this._animationType == value) {
                return;
            }
            if (this._animation) {
                this._animation.dispose();
            }
            this._animationType = value;
            this._animation = gameTool.singleton(TipManagers).getAnimationClass(value);
            this._animation.component = this;
        }

        get realHeight() {
            return this._ui.height;
        }

        get realWidth() {
            return this._ui.width;
        }
    }

	/************************tip动画*************************/
    /******************************************************************/
    export class TipAnimationBase {
        component: BaseTip;
        constructor() {
        }

        start(callback: any, context: any, ...args): void {
            this.component.addEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            let info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            info.itemList.push(this.component);
        }

        dispose() {
            this.component.removeEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            this.component = null;
        }

        /******************************************************************/
        protected onGameTipClose(event: egret.Event) {
            var item: BaseTip = event.currentTarget as BaseTip;
            let info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            var index: number = info.itemList.indexOf(item);
            item.removeEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            if (index >= 0) {
                info.itemList.splice(index, 1);
            }
            if (info.itemList.length == 0) {
                this.resetInfo(info);
            }
        }

        protected resetInfo(info: ManagerInfo) {
            info.textTipCurrentY = info.startY;
        }
    }


	export class TipManagers {
        private _infos: { [key: string]: ManagerInfo };

        constructor() {
            this._infos = {};
            this._infos[ANIMATION1] = new ManagerInfo(NormalTipAnimation , gameTool.stage.stageHeight / 4);
            this._infos[ANIMATION2] = new ManagerInfo(SystemTipAnimation , gameTool.stage.stageHeight / 4);
        }

        getInfo(type) {
            return this._infos[type];
        }

        getAnimationClass(type): TipAnimationBase {
            return new this._infos[type].animationClass;
        }

        /******************************************************************/
    }

	/******************************************************************/
    /********************管理信息*******************************/
    /******************************************************************/
    export class ManagerInfo {
        itemList: BaseTip[];
        textTipCurrentY: number;
        startY: number;
        animationClass:any;

        public constructor(animationClass , startY) {
            this.animationClass = animationClass;
            this.startY = startY;
            this.textTipCurrentY = startY;
            this.itemList = [];
        }
    }

	export class NormalTipAnimation extends TipAnimationBase {
        public constructor() {
            super();
        }

        start(callback: any, context: any, ...args): void {
            super.start(callback, context, ...args);
            let info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            this.component.alpha = 0;
            this.component.x = gameTool.stage.stageWidth / 2 - 200;
            this.component.y = info.textTipCurrentY;
            egret.Tween.get(this.component).to({y: info.textTipCurrentY - 50,alpha:1}, 200).wait(2000).to({alpha: 0,y:info.textTipCurrentY-100}, 200).call(callback, context, args);
            if(info.textTipCurrentY > (gameTool.stage.stageHeight + 300)){
                this.resetInfo(info);
            }else{
                info.textTipCurrentY += this.component.realHeight + 5;
            }
        }
    }

    export class SystemTipAnimation extends TipAnimationBase {
        public constructor() {
            super();
        }

        start(callback: any, context: any, ...args): void {
            super.start(callback, context, ...args);
            let info = gameTool.singleton(TipManagers).getInfo(this.component.animationType);
            this.component.alpha = 1;
            this.component.x = gameTool.stage.stageWidth / 2;
            this.component.y = info.textTipCurrentY;
            info.textTipCurrentY += this.component.realHeight + 5;
            egret.Tween.get(this.component).wait(1000).to({
                y: this.component.y - 300,
                alpha: 0
            }, 1000).call(callback, context, args);
        }
    }

	export function showTextTips(message: string) {
        new TipItems(message);
    }

	export class TipItems extends BaseTip {
        public constructor(message: string) {
            super("normalTipSkin", message);
        }

        protected initView() {
            super.initView();
            this.animationType = ANIMATION1;
        }
    }

	export var ANIMATION1: number = 1;
    export var ANIMATION2: number = 2;
}