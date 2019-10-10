module gui {
    export class NumSelect {
        private _com: fairygui.GComponent;
        private _reduceBtn: fairygui.GButton;
        private _addBtn: fairygui.GButton;
        private _minBtn: fairygui.GButton;
        private _maxBtn: fairygui.GButton;
        private _num: number = 0;
        private _totalNum: number = 0;
        private _numText: fairygui.GTextField;
        private _onChangeHandler: () => void;
        private _min: number = 0;
        private _callThisObj: any;

        constructor(com: fairygui.GComponent, onChangeHandler: () => void, callThisObj: any) {
            this._com = com;
            this._numText = this._com.getChild("num").asTextField;
            this._numText.addEventListener(egret.Event.CHANGE, this.onTextChange, this);
            this.num = 0;
            this._onChangeHandler = onChangeHandler;
            this._callThisObj = callThisObj;
        }

        dispose() {
            if (this._reduceBtn) {
                this._reduceBtn.removeClickListener(this.onPre, this);
                this._addBtn.removeClickListener(this.onNext, this);
            }
            this._numText.removeEventListener(egret.Event.CHANGE, this.onTextChange, this);

            if (this._maxBtn) {
                this._maxBtn.removeClickListener(this.onMax, this);
            }
            if (this._minBtn) {
                this._minBtn.removeClickListener(this.onMin, this);
            }
            this._com.dispose();
            this._com = null;
            this._callThisObj = null;
            this._minBtn = null;
            this._maxBtn = null;
            this._reduceBtn = null;
            this._addBtn = null;
            this._onChangeHandler = null;
        }

        /******************************************************************/
        private onTextChange(event: egret.Event) {
            if (this._numText.text == "") {
                this._num = 0;
                this.onNumChange();
                return;
            }
            this.num = parseInt(this._numText.text);
        }

        private onNumChange() {
            if (this._reduceBtn) {
                this._reduceBtn.enabled = this._num > 0;
                this._addBtn.enabled = this._num < this._totalNum;
            }
            if (this._onChangeHandler) {
                this._onChangeHandler.call(this._callThisObj);
            }
        }

        private onPre() {
            this.num--;
        }

        private onNext() {
            this.num++;
        }

        private onMax() {
            this.num = this._totalNum;
        }

        private onMin() {
            this.num = this._min;
        }

        /******************************************************************/
        set oneChange(value: boolean) {
            if (value) {
                this._reduceBtn = this._com.getChild("reduce").asButton;
                this._addBtn = this._com.getChild("add").asButton;
                this._reduceBtn.addClickListener(this.onPre, this);
                this._addBtn.addClickListener(this.onNext, this);
                this.onNumChange();
            }
        }

        set min(value: number) {
            this._min = value;
        }

        set minBtn(value: boolean) {
            if (value) {
                this._minBtn = this._com.getChild("min").asButton;
                this._minBtn.addClickListener(this.onMin, this);
            }
        }

        set maxBtn(value: boolean) {
            if (value) {
                this._maxBtn = this._com.getChild("max").asButton;
                this._maxBtn.addClickListener(this.onMax, this);
            }
        }


        set max(value: number) {
            this._totalNum = value;
            if (this._addBtn) {
                this._addBtn.enabled = this._num < this._totalNum;
            }
            if (this._num > this._totalNum) {
                this._num = this._totalNum;
            }
            if (this._num < this._min) {
                this._num = this._min;
            }
            this._numText.text = this._num.toString();
        }

        get num(): number {
            return this._num;
        }


        set num(value: number) {
            this._num = value;
            if (this._num < 0) {
                this._num = 0;
            }
            if (this._num > this._totalNum) {
                this._num = this._totalNum;
            }
            if (this._num < this._min) {
                this._num = this._min;
            }
            this.onNumChange();
            this._numText.text = String(this._num);
        }

        get max(): number {
            return this._totalNum;
        }

    }
}

