/**
 * Created by lxz on 2017/11/21.
 */
module gui {
    /**
     * 滚动面板
     */
    export class ScrollPanel {
        /* 显示的滚动条目*/
        private _show_num: number = 2;
        /* 总的长度*/
        private _length: number = 0;
        /* 渲染器*/
        private _render: ScrollRender;
        /* 滚动位置开始索引(容器位置)*/
        private _sIndex: number = 0;
        /* 滚动边界索引(下一个的item位置)*/
        private _lIndex: number = 0;
        /* item列表*/
        private _types: ScrollItem[];
        private _container: fairygui.GComponent;
        private _com: fairygui.GComponent;
        private _running: boolean;
        private _pkgName: string;
        private _resName: string;
        private _time: number;

        public constructor(com: fairygui.GComponent, show_num: number, pkgName: string, resName: string, typeClass: { new (): ScrollItem }, time: number = 1000) {
            this._com = com;
            this._pkgName = pkgName;
            this._resName = resName;
            this._show_num = show_num;
            this._container = new fairygui.GComponent();
            this._com.addChild(this._container);
            fairygui.UIObjectFactory.setPackageItemExtension(fairygui.UIPackage.getItemURL(pkgName, resName), typeClass);
            this._render = new ScrollRender();
            this._time = time;
        }

        dispose() {
            this._running = false;
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, this.dispose);
                return;
            }
            this.clearTypes();
            this._com = null;
            this._render = null;
            this._container = null;
        }

        /******************************************************************/
        private clearTypes() {
            if (this._types) {
                let len = this._types.length;
                for (let i = 0; i < len; i++) {
                    this._types[i].dispose();
                }
                this._types = null;
            }
        }

        private draw() {
            this._types = [];
            if (this._length > this._show_num) {
                let len = this._show_num + 1;
                for (let i = 0; i < len; i++) {
                    let obj = fairygui.UIPackage.createObject(this._pkgName, this._resName) as ScrollItem;
                    this._container.addChild(obj);
                    let position = this._render.getPosition(i);
                    obj.x = position.x;
                    obj.y = position.y;
                    obj.setListIndex(i);
                    this._types.push(obj);
                }
                this._sIndex = 0;
                this._lIndex = this._show_num;
                this._running = true;
                this.startScroll();
            } else {
                let len = this._length;
                for (let i = 0; i < len; i++) {
                    let obj = fairygui.UIPackage.createObject(this._pkgName, this._resName) as ScrollItem;
                    this._container.addChild(obj);
                    let position = this._render.getPosition(i);
                    obj.x = position.x;
                    obj.y = position.y;
                    obj.setListIndex(i);
                    this._types.push(obj);
                }
            }
        }

        private start() {
            this._running = true;
            this.next();
        }

        private stop() {
            this._running = false;
        }

        private startScroll() {
            this._sIndex--;
            delay.createDelayMain(this);
            let position = this._render.getPosition(this._sIndex);
            egret.Tween.get(this._container).to(position, this._time).call(this.next, this);
        }

        private next() {
            this._lIndex++;
            let obj = this._types.shift();
            let positon = this._render.getPosition(this._lIndex);
            obj.x = positon.x;
            obj.y = positon.y;
            let index = ++this._types[this._types.length - 1].listIndex;
            if (index >= this._length) {
                index = 0;
            }
            obj.setListIndex(index);
            this._types.push(obj);
            delay.executeAllTransact(this);
            if (!this._running) {
                return;
            }
            this.startScroll();
        }

        /******************************************************************/
        set length(value: number) {
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, "length", value);
                return;
            }
            if (this._length == value) {
                return;
            }
            if (this._length == 0) {
                this._length = value;
                this.draw();
            } else {
                if (this._length <= this._show_num) { //在之前的长度就小于显示数
                    this.clearTypes();
                    this._length = value;
                    this.draw();
                } else {
                    this._length = value;
                    if (this._length <= this._show_num) { //长度小于显示数
                        this.clearTypes();
                        this.draw();
                    }
                }
            }
        }

        get render(): gui.ScrollRender {
            return this._render;
        }
    }
    export class ScrollItem extends fairygui.GComponent {
        listIndex: number;

        public constructor() {
            super();
            delay.createDelayMain(this);
        }

        dispose(): void {
            super.dispose();
        }

        constructFromResource(): void {
            super.constructFromResource();
            delay.executeAllTransact(this);
        }

        setListIndex(index): void {
            this.listIndex = index;
            if (delay.hasDelayMain(this)) {
                delay.addDelayTransact(this, this.change);
                return;
            }
            this.change();
        }

        change() {

        }
    }

    export class ScrollRender {
        /* 间隔*/
        tap: number;
        /**
         * 获取位置
         */
        getPosition(index: number): { x: number, y: number } {
            return {x: 0, y: this.tap * index};
        }
    }
}