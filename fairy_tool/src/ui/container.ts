/**
 * Created by lxz on 2017/10/17.
 */
module extendsUI{
    export class BaseContainer extends egret.DisplayObjectContainer {
        protected _hitRect: egret.Rectangle;

        public constructor() {
            super();
            this._hitRect = new egret.Rectangle();
        }

        dispose() {
            notification.removeNotificationByObject(this);
            this.parent && this.parent.removeChild(this);
            this._hitRect = null;
        }

        /**
         * 是否与其他容器碰撞
         */
        intersectsByContainer(container: BaseContainer) {
            return this.hitRect.intersects(container.hitRect);
        }

        /**
         * 是否包含了某个点
         */
        containsPoint(x: number, y: number) {
            return this.hitRect.contains(x, y);
        }

        /******************************************************************/
        get hitRect(): egret.Rectangle {
            let dx: number = this.scaleX * (this.scaleX < 0 ? (this.anchorOffsetX - this.width)  :  this.anchorOffsetX);
            let dy: number = this.scaleY * (this.scaleY < 0 ? (this.anchorOffsetY - this.height)  :  this.anchorOffsetY);
            this._hitRect.x = this.x - dx;
            this._hitRect.y = this.y - dy;
            this._hitRect.width = Math.abs(this.width * this.scaleX);
            this._hitRect.height = Math.abs(this.height * this.scaleY);
            return this._hitRect;
        }
    }
}