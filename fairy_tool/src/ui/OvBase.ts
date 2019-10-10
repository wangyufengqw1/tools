///<reference path="gui.ts" />
module gui {
    export class OvBase extends BaseWindow {
        protected _textList: fairygui.GTextField[];
        protected _ivs: ItemViewBase[];
        private _pkgName: string;
        private _resName: string;
        protected className:string;
        public constructor(pkgName: string, resName: string, modal: boolean = true, center: boolean = true, loadingView: {
            new(): loadUI.BaseLoadingUI;
        } = null) {
            super(modal, center);
            this._pkgName = pkgName;
            this._resName = resName;
            this.className = pkgName+"_"+resName;
            if (fairygui.UIPackage.getByName(pkgName) == null) {
                if (RES.getRes(pkgName) || RES.getRes(pkgName + "_fui")) {
                    fairygui.UIPackage.addPackage(pkgName);
                    this.initUI(pkgName, resName);
                } else { //加载资源
                    if (RES.getGroupByName(pkgName)) { //有资源组
                        loadUtil.loadGroup(pkgName, loadingView, this.loadResComplete, this);
                    } else {
                        throw new Error(`没有对应的${pkgName}资源组`);
                    }
                }
            } else {
                this.initUI(pkgName, resName);
            }
        }

        dispose() {
            removeBindGuiProperty(this);
            if (this._textList) {
                let len = this._textList.length;
                for (let i = 0; i < len; i++) {
                    this._textList[i].dispose();
                }
                this._textList = null;
            }
            if (this._ivs) {
                let len = this._ivs.length;
                for (let i = 0; i < len; i++) {
                    this._ivs[i].dispose();
                }
                this._ivs = null;
            }
            super.dispose();
        }

        updateItemView(index, ...args) {
            this._ivs[index].update(...args);
        }

        setText(index: number, text: any) {
            this._textList[index].text = text.toString();
        }

        getText(index: number): string {
            return this._textList[index].text;
        }

        getTextFiled(index: number): fairygui.GTextField {
            return this._textList[index];
        }

        /**
         * 设置设配
         */
        fullWindow(width: number = 750, height: number = 1334) {
            // let w = document.body.clientWidth;
            // let h = document.body.clientHeight;
            let h = gameTool.stage.stageHeight;
            let w = gameTool.stage.stageWidth;
            let scaleX = width / w;
            let scaleY = height / h;
            if (scaleX < scaleY) {
                this._ui.setSize(width, h * scaleX);
            } else {
                this._ui.setSize(w * scaleY, height);
            }
            this._ui.setXY(0, 0);
        }
        onInit(): void {
            if (fairygui.UIPackage.getByName(this._pkgName) == null) {
                return;
            }
            super.onInit();
        }
        /******************************************************************/
        protected initView() {
            super.initView();
            this._textList = [];
            this._ivs = [];
            this.registerTexts(this._ui);
        }

        protected onClick(e: egret.TouchEvent) {
            var name: string = e.currentTarget.name;
            var pre: string = "btn";
            var index = name.indexOf(pre);
            if (index < 0) {
                return;
            }
            index = parseInt(name.substr(pre.length));
            switch (index) {
                case 0:
                    remove(this);
                    break;
            }
            this.clickHandler(index);
        }

        protected clickHandler(index: number) {

        }

        protected registerTexts(container: fairygui.GComponent) {
            if (container == null) {
                throw new Error("窗口不存在，不能注册按钮").message;
            }
            var childLen: number = container.numChildren;
            for (let i = 0; i < childLen; i++) {
                var child: fairygui.GObject = container.getChildAt(i);
                if (child instanceof fairygui.GTextField) {
                    if (child.name.indexOf("text") > -1) {
                        this._textList.push(child);
                    }
                }
            }
            this._textList.sort(this.onTextSort);
        }

        protected initUI(pkgName, resName) {
            this.mainView = fairygui.UIPackage.createObject(pkgName, resName).asCom;
            this._ui = this.mainView.getChild("ui").asCom;
            this._bg = this.mainView.getChild("bg").asCom;
         //   this.resize();
            this.onResize();
            bindGuiProperty(this, this._ui);
            this.init();
            this.addChild(this.mainView);
        }


        onResize():void
        {
            if(!this._ui){
                return ;
            }
            let clientHeight = document.documentElement.clientHeight;
            let clientWidth = document.documentElement.clientWidth;
            let h = gameTool.stage.stageHeight;
            let w = gameTool.stage.stageWidth;
            let scaleX = this.mainView.width / w;
            let scaleY = this.mainView.height / h;
            if (scaleX < scaleY) {
                this._ui.setScale(h / this.mainView.height, h / this.mainView.height);
            }
            if(this._ui.y>0){
                this._ui.setXY(this._ui.x,0);
            }
            if(this._ui.x>0){
                this._ui.setXY(0,this._ui.y);
            }           
        }

        /******************************************************************/
        private loadResComplete() {
            // 需要延迟处理gui包,res加载完组直接addPackage会再次调用res的加载导致报错
            let k = egret.setTimeout(() => {
                egret.clearTimeout(k);
                this._inited = false;
                fairygui.UIPackage.addPackage(this._pkgName);
                this.initUI(this._pkgName, this._resName);
            }, this, 100);
        }

        private onTextSort(t1: fairygui.GTextField, t2: fairygui.GTextField): number {
            var index1: number = parseInt(t1.name.substr(4));
            var index2: number = parseInt(t2.name.substr(4));
            if (index1 < index2) {
                return -1;
            }
            if (index1 > index2) {
                return 1;
            }
            return 0;
        }
    }
}