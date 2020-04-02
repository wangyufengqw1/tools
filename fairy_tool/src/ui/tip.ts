/**
 * Created by lxz on 2017/10/17.
 */
///<reference path="container.ts" />
module tip {
    import singleton = gameTool.singleton;
    export class TipItem extends extendsUI.BaseContainer {
        private _message: string;
        private _ui: fairygui.GComponent;
        private _content: fairygui.GTextField;

        public constructor(message: string) {
            super();
            this._message = message;
            this.initView();
            this.touchEnabled = false;
        }

        private initView() {
            this._ui = fairygui.UIPackage.createObject("common", "tip").asCom;
            this.addChild(this._ui.displayObject);
            this._content = this._ui.getChild("content").asTextField;
            this._content.text = this._message;
        }

        public startScroll() {
         //   this._ui.getTransition("appear").play(this.dispose, this);
            setTimeout(this.dispose.bind(this), 1000);
        }

        public dispose() {
            this.dispatchEvent(new egret.Event(egret.Event.CLOSE));
            super.dispose();
        }
    }

    export class TipManager {
        private GAME_TIP_START_Y: number = 150;
        public _textTipCurrentY: number;
        public _itemList: TipItem[];

        constructor() {
            // this._textTipCurrentY = gameTool.stage.stageHeight / 2 - this.GAME_TIP_START_Y;
            this._itemList = [];
            this._textTipCurrentY = gameTool.gameContentWH[1] / 2 - this.GAME_TIP_START_Y;
        }

        showTextTip(message: string,v:egret.DisplayObjectContainer=null) {
            var item: TipItem = <any>new TipItem(message);
             if(item.width>gameTool.gameContentWH[0]){    //tip的资源过大 在资源大于宽的情况下 资源缩小至一样的大小并且位置为0
                item.scaleX = item.scaleY = gameTool.gameContentWH[0]/item.width;
                item.x = 0;
            }else{
                item.x = (gameTool.gameContentWH[0] - item.width) / 2; //长度够的游戏则居中处理
            }   
            item.y = this._textTipCurrentY;
            if(v == null){
               gui.addDisplayToStage(item, define.WindowType.TIP_LAYER);  
            }else{
               v.addChild(item);
            }
            item.startScroll();
            this._textTipCurrentY += 80;
            this._itemList.push(item);
            item.addEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
        }

        /******************************************************************/
        private onGameTipClose(event: egret.Event) {
            var item: TipItem = event.currentTarget as TipItem;
            var index: number = this._itemList.indexOf(item);
            item.removeEventListener(egret.Event.CLOSE, this.onGameTipClose, this);
            if (index >= 0) {
                this._itemList.splice(index, 1);
            }
            if (this._itemList.length == 0) {
                this._textTipCurrentY = gameTool.gameContentWH[1] / 2 - this.GAME_TIP_START_Y;   //游戏的大小不同则根据获取的调整大小
            }
        }
    }

    export function showTextTip(message: string,v:egret.DisplayObjectContainer=null) {
        singleton(TipManager).showTextTip(message,v);
    }
}