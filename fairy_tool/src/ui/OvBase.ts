///<reference path="gui.ts" />
module gui {
    /**
     * 资源格式 需要一个bg 和 ui
     */
    export class OvBase extends BaseWindow {
        protected _textList: fairygui.GTextField[];
        protected _ivs: ItemViewBase[];
        private _pkgName: string;
        private _resName: string;
        protected className:string;
        protected mainView:fairygui.GComponent;
        protected _bg:fairygui.GComponent;
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

        // /**
        //  * 设置设配
        //  */
       wxfullWindow(width: number = 750, height: number = 1334) {
            // let w = document.body.clientWidth;
            // let h = document.body.clientHeight;
            if(!this._ui){
                return ;
            }
            let clientHeight = height;
            let clientWidth  = width;
            let w            = gameTool.gameContentWH[0];      //游戏内容的长宽
            let h            = gameTool.gameContentWH[1];      //游戏内容的长宽
            let perw         = clientWidth/w;                  //宽的比例
            let tempH        = h*perw                       //根据宽的比例求对应的高
            let perH         = clientHeight/h;                 //高的比例
            let tempW        = w*perH;                      //根据高的比例求对应的宽
            if(tempH<=clientHeight && perw<perH){
                this._ui.setScale(perw,perw);
            }else if(tempW<=clientWidth && perH<perw){
                this._ui.setScale(perH,perH);
            }
            var sc = this._ui.scaleX;  //缩放比例
            if(sc*w!=clientWidth){
               this._ui.width = clientWidth/sc;
           }
           if(sc*h!=clientHeight){
               this._ui.height = clientHeight/sc; 
           }   
            this._bg.width = clientWidth;
            this._bg.height = clientHeight;
        }

        onInit(): void {
            if (fairygui.UIPackage.getByName(this._pkgName) == null || this._ui == null) {
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
        //    this.onResize();
            bindGuiProperty(this, this._ui);
            this.init();
            this.addChild(this.mainView);
        }


        onResize():void
        {
            if(!this._ui){
                return ;
            }
            this.mainView.x  = 0;
            this.mainView.y  = 0;
            let clientHeight = document.documentElement.clientHeight;
            let clientWidth  = document.documentElement.clientWidth;
            let useHeight    = clientHeight;                   //当前使用的高
            let useWidth     = clientWidth;                    //当前使用的宽
            let w            = gameTool.gameContentWH[0];      //游戏内容的长宽
            let h            = gameTool.gameContentWH[1];      //游戏内容的长宽
            
            if(gameTool.pToLand == 1){                       //长宽需要对调 (手机上)
                if(clientHeight>clientWidth){           //长宽对调了 则
                    useHeight = clientWidth;
                    useWidth = clientHeight;
                }
                //竖屏 显示横屏
                if(gameTool.gameRotate){   //旋转到横屏 则角度不变 (这时一般长宽不变)
                    this.mainView.rotation = 0;
                }else if(!gameTool.gameRotate && clientHeight>clientWidth){ //旋转到竖屏  则角度变化90°  (这时一般长宽对调)
                    this.mainView.rotation = 90;
                    this.mainView.x = useHeight;
                }else{ //特殊情况  （旋转到了竖屏 但 长宽木有变化 则以长宽为基础角度也不变）
                    this.mainView.rotation = 0;
                }
            }else if(gameTool.pToLand == 2 && !gameTool.isPc){
                //竖屏 显示成竖屏
                if(clientWidth>clientHeight){
                    useHeight = clientWidth;
                    useWidth = clientHeight;
                }
                if (!gameTool.gameRotate) {
                    this.mainView.rotation =  0;
                }else if(gameTool.gameRotate && clientWidth>clientHeight){
                     this.mainView.rotation = -90;
                     this.mainView.y = useWidth;
                }else{
                    this.mainView.rotation =  0;
                }
            }else{
                this.mainView.rotation = 0;
            }
            let perw         = useWidth/w;                  //宽的比例
            let tempH        = h*perw                       //根据宽的比例求对应的高
            let perH         = useHeight/h;                 //高的比例
            let tempW        = w*perH;                      //根据高的比例求对应的宽
            if(tempH<=useHeight){
                this._ui.setScale(perw,perw);
            }else if(tempW<=useWidth){
                this._ui.setScale(perH,perH);
            }
            var sc = this._ui.scaleX;  //缩放比例
            if(this._isCenter){
                this._ui.x = (useWidth - this._ui.width*sc) * .5;
                this._ui.y = (useHeight - this._ui.height*sc) * .5;
            }

            if(gameTool.isPc && gameTool.pToLand == 2){                   //是pc并且是竖屏 则不进行全屏
                this._bg.setScale(sc,sc);
                this._bg.x = (useWidth - this._bg.width*sc) * .5;
                this._bg.y = (useHeight - this._bg.height*sc) * .5;
            }else{
                this._bg.width = useWidth;
                this._bg.height = useHeight;
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