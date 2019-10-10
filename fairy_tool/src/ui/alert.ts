/**
 * Created by lxz on 2017/10/17.
 */
///<reference path="gui.ts" />
module alert {
    export class Alert extends gui.BaseWindow {
        static OK: number = 1;
        static CANCEL: number = 2;
        static OK_CANCEL: number = 3;
        private _message: string;
        private _buttons: number = 0;
        private _callback: FunctionInfo;
        private _content: fairygui.GTextField;
        private _buttonNumController: fairygui.Controller;

        constructor(message: string, buttons: number = 1, callback: (...args) => void = null, context: any = null, ...args) {
            super();
            this._message = message;
            this._buttons = buttons;
            if (callback != null) {
                this._callback = gameTool.poolList.getInstance(FunctionInfo);
                this._callback.fun = callback;
                this._callback.context = context;
                this._callback.args = args;
            }
            if (this._content) {
                this._content.text = this._message;
            }
        }
        /******************************************************************/
        protected initView() {
            this._ui = fairygui.UIPackage.createObject("common", "alerView").asCom;
            this.addChild(this._ui);
            this._buttonNumController = this._ui.getController("select");
            this._content = this._ui.getChild("txt").asTextField;
            if (this._buttons == Alert.OK) {
                this._buttonNumController.selectedPage = "1";
            }
            else {
                this._buttonNumController.selectedPage = "2";
            }
            this._content.text = this._message;
        }


        protected onClick(e: egret.TouchEvent) {
            super.onClick(e);
            switch (e.currentTarget.name) {
                case "okBtn" :
                case "okBtn1" : {
                    if (this._callback != null) {
                        this._callback.args = [Alert.OK].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
                }
                case "cancelBtn" : {
                    if (this._callback != null) {
                        this._callback.args = [Alert.CANCEL].concat(this._callback.args);
                        this._callback.call();
                    }
                    this.dispose();
                    break;
                }
            }
        }

        public dispose() {
            if (this._callback != null) {
                gameTool.poolList.remove(this._callback);
                this._callback = null;
            }
            super.dispose();
        }
    }

    export function createAlert(message: string, buttons: number = 1, callback: (...args) => void = null, context: any = null, ...args) {
        var alert: Alert = new Alert(message, buttons, callback, context, ...args);
        gui.addBox(alert);
        return alert;
    }
}