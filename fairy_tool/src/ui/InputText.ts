/**
 * Created by lxz on 2018/5/8.
 */
module gui {
    export class InputText {
        private _text0: fairygui.GTextField;
        private _text1: fairygui.GTextField;

        /**
         *
         * @param {fairygui.GTextField} text0       提示文本
         * @param {fairygui.GTextField} text1       输入文本
         */
        public constructor(prompt_text: fairygui.GTextField, input_text: fairygui.GTextField) {
            this._text0 = prompt_text;
            this._text1 = input_text;
            this._text1.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
        }

        /******************************************************************/
        dispose() {
            this._text1.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this._text0 = null;
            this._text1 = null;
        }

        update(){
            this._text0.visible = this._text1.text == "";
        }
        /******************************************************************/
        private onTextChange() {
            this._text0.visible = this._text1.text == "";
        }
    }
}