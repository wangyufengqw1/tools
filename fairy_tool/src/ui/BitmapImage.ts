/**
 * Created by lxz on 2017/11/13.
 */
module gui {
    /**
     * 图像
     */
    export class BitmapImage extends egret.Bitmap {
        private _imgLoader: egret.ImageLoader;
        private _complete: () => void;
        private _context: any;

        public constructor() {
            super();
            this._imgLoader = new egret.ImageLoader();
            this._imgLoader.crossOrigin = "anonymous";
            this._imgLoader.addEventListener(egret.Event.COMPLETE, this.imgLoadHandler, this);
        }

        dispose() {
            this._imgLoader.removeEventListener(egret.Event.COMPLETE, this.imgLoadHandler, this);
            this._imgLoader.data = null;
            this._imgLoader = null;
            this._complete = null;
            this._context = null;
        }

        getImgByUrl(url, complete ?: () => void, context ?: any) {
            if(url.indexOf("http") == -1){
                return;
            }
            this._imgLoader.load(url);
            this._complete = complete;
            this._context = context;
        }

        /******************************************************************/
        private imgLoadHandler(evt: egret.Event): void {
            var loader: egret.ImageLoader = evt.currentTarget;
            var bmd: egret.BitmapData = loader.data;
            this.bitmapData = bmd;
            if (this._complete) {
                this._complete.call(this._context);
            }
        }
    }
}