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
            this._textTipCurrentY = gameTool.stage.stageHeight / 2 - this.GAME_TIP_START_Y;
            this._itemList = [];
        }

        showTextTip(message: string,v:egret.DisplayObjectContainer=null) {
            var item: TipItem = <any>new TipItem(message);
            item.x = (gameTool.stage.stageWidth - item.width) / 2;
            item.y = this._textTipCurrentY;
            if(v == null){
               gui.addDisplayToStage(item, define.WindowType.TIP_LAYER);  
            }else{
               item.x = 0;
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
                this._textTipCurrentY = gameTool.stage.stageHeight / 2 - this.GAME_TIP_START_Y;
            }
        }
    }

    export function showTextTip(message: string,v:egret.DisplayObjectContainer=null) {
        singleton(TipManager).showTextTip(message,v);
    }
}