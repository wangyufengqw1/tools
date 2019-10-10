module gui{
   export class ItemViewBase {
        protected _com: fairygui.GComponent;
        protected _buttonList: fairygui.GButton[];
        protected _textList: fairygui.GTextField[];
        protected _winList: OvBase[];

        public constructor(com: fairygui.GComponent) {
            this._com = com;
            bindGuiProperty(this , com);
            this._buttonList = [];
            this._textList = [];
            this._winList = [];
            this.registerButtons(this._com);
            this.registerTexts(this._com);
        }

        public dispose() {
            removeBindGuiProperty(this);
            notification.removeNotificationByObject(this);
            var len = this._buttonList.length;
            for (let i = 0; i < len; i++) {
                this._buttonList[i].removeClickListener(this.onClick, this);
                this._buttonList[i].dispose();
            }
            len = this._textList.length;
            for (let i = 0; i < len; i++) {
                this._textList[i].dispose();
            }
            len = this._winList.length;
            for (let i = 0; i < len; i++) {
                this._winList[0].dispose();
            }
            this._com.dispose();
            this._com = null;
            this._buttonList = null;
            this._textList = null;
            this._winList = null;
        }

        update(...args) {
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

        /******************************************************************/
        protected clickByName(name: string) {
        }

        protected getComponent(resName: string): fairygui.GObject {
            return this._com.getChild(resName);
        }

        protected onClick(e: egret.TouchEvent) {
            e.stopImmediatePropagation();
            this.clickByName(e.target.name);
            var name: string = e.currentTarget.name;
            var pre: string = "btn";
            var index: number = name.indexOf(pre);
            if (index < 0) {
                return;
            }
            index = parseInt(name.substr(pre.length));
            this.clickHandler(index);
        }

        protected clickHandler(index: number) {
        }

        /******************************************************************/
        private registerButtons(container: fairygui.GComponent) {
            var childLen: number = container.numChildren;
            for (let i: number = 0; i < childLen; i++) {
                var child: fairygui.GObject = container.getChildAt(i);
                if (child instanceof fairygui.GButton) {
                    this.getButton(child.name);
                }
            }
        }

        private registerTexts(container: fairygui.GComponent) {
            if (container == null) {
                throw new Error("窗口不存在，不能注册文本").message;
            }
            var childLen: number = container.numChildren;
            for (let i: number = 0; i < childLen; i++) {
                var child: fairygui.GObject = container.getChildAt(i);
                if (child instanceof fairygui.GTextField) {
                    if (child.name.indexOf("text") > -1) {
                        this._textList.push(child);
                    }
                }
            }
            this._textList.sort(this.onTextSort);
        }

        private getButton(resName: string): fairygui.GButton {
            var btn: fairygui.GButton;
            btn = this.getComponent(resName) as  fairygui.GButton;
            if (this._buttonList.indexOf(btn) >= 0) {
                return btn;
            }
            this._buttonList.push(btn);
            btn.addClickListener(this.onClick, this);
            return btn;
        }

        private onTextSort(t1: fairygui.GTextField, t2: fairygui.GTextField): number {
            var index1: number = parseInt(t1["name"].substr(4));
            var index2: number = parseInt(t2["name"].substr(4));
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
