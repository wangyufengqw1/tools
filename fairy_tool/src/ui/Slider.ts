/**
 * Created by lxz on 2017/11/17.
 */
module gui {
    export class Slider {
        private _com: fairygui.GComponent;
        private _slider: fairygui.GSlider;
        private _prevBtn: fairygui.GButton;
        private _nextBtn: fairygui.GButton;
        private _text: fairygui.GTextField;
        private _changeFun: () => void;
        private _changeContext: any;
        private _minNum:number = 0;
        private _maxNum:number = 0;
        private _rate:number = 1;
        private _showRate:number = 1;


        public constructor(com: fairygui.GComponent, changeFun?: () => void, changeContext?: any) {
            this._com = com;
            this._slider = this._com.getChild("slider").asSlider;
            this._prevBtn = this._com.getChild("prev").asButton;
            this._nextBtn = this._com.getChild("next").asButton;
            if (this._com.getChild("text").asTextField) {
                this._text = this._com.getChild("text").asTextField;
                this._text.text = this._slider.value.toString();
            }
            this._prevBtn.addClickListener(this.onPrev, this);
            this._nextBtn.addClickListener(this.onNext, this);
            this._slider.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onChange, this);
            this._changeFun = changeFun;
            this._changeContext = changeContext;
            //this.onChange();
        }

        dispose() {
            this._slider.removeEventListener(fairygui.StateChangeEvent.CHANGED, this.onChange, this);
            this._prevBtn.removeClickListener(this.onPrev, this);
            this._nextBtn.removeClickListener(this.onNext, this);
            this._com = null;
            this._slider = null;
            this._prevBtn = null;
            this._nextBtn = null;
            this._text = null;
            this._changeFun = null;
            this._changeContext = null;
        }

        /******************************************************************/
        private onPrev() {
            if (this._slider.value > 0) {
                this._slider.value--;
                this._slider.update();
                this.onChange();
            }
        }

        private onNext() {
            if (this._slider.value < this._slider.max) {
                this._slider.value++;
                this._slider.update();
                this.onChange();
            }
        }

        private onChange() {
            if(this._changeFun){
                this._changeFun.apply(this._changeContext);
            }
            this.refreshText();
        }

        private mathValues(){
            this._slider.max = (this._maxNum - this._minNum) / this.rate;
        }

        private refreshText(){
            if(this._text){
                this._text.text = (this._slider.value * this.rate / this.showRate + this._minNum / this.showRate).toString();
            }
            this._prevBtn.enabled = this._slider.value > 0;
            this._nextBtn.enabled = this._slider.value < this._slider.max;
        }
        /******************************************************************/
        set max(num: number) {
            this.maxNum = num;
        }

        set value(num: number) {
            this._slider.value = (num - this._minNum) / this.rate;
            this.onChange();
        }

        get max():number{
            return this._slider.max;
        }

        get value():number{
            return this._slider.value * this.rate + this._minNum;
        }

        get minNum(): number {
            return this._minNum;
        }

        set minNum(value: number) {
            this._minNum = value;
            this.mathValues();
        }

        get maxNum(): number {
            return this._maxNum;
        }

        set maxNum(value: number) {
            this._maxNum = value;
            this.mathValues();
        }

        get rate(): number {
            return this._rate;
        }

        set rate(value: number) {
            this._rate = value;
            this.mathValues();
        }

        get showRate(): number {
            return this._showRate;
        }

        set showRate(value: number) {
            this._showRate = value;
            this.mathValues();
        }
    }
}