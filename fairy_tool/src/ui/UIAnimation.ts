/**
 * Created by silence on 2017/7/1.
 */
module gui {
    import GComponent = fairygui.GComponent;
    export class UIAnimation {
        public component: GComponent;
        inClose: boolean;

        show(callback, context, ...args): void {
            this.inClose = false;
            callback.apply(context, args);
        }

        close(callback, context, ...args): void {
            this.inClose = true;
            callback.apply(context, args);
        }

        dispose(): void {
            this.component = null;
        }
    }
    /**
     * 弹窗模式(透明度渐变居中大小变化)
     */
    export class BoxAnimation extends UIAnimation {

        dispose(): void {
            super.dispose();
        }

        show(callback, context, ...args): void {
            this.lastScaleX = this.component.scaleX;
            this.lastScaleY = this.component.scaleY;
            this.component.scaleX = 0;
            this.component.scaleY = 0;
       //     this.component.alpha  = 0;
            egret.Tween.get(this.component).to({
                scaleX:  this.lastScaleX,
                scaleY:  this.lastScaleY
            }, 300, egret.Ease.backOut).wait(100).call(callback, context, args);
        }

        close(callback, context, ...args): void {
            egret.Tween.get(this.component).to({
                alpha: 0,
          //      scaleY: 0
            }, 300, egret.Ease.backIn).call(callback, context, args);
        }

        private lastScaleX:number;
        private lastScaleY:number;
    }

    /**
     * 主窗口模式(从左到右)
     */
    export class SceneAnimation extends UIAnimation {
        private _orienX: number;

        show(callback, context, ...args): void {
            this._orienX = this.component.x;
            this.component.x = this._orienX - 720;
            egret.Tween.get(this.component).to({x: this._orienX}, 200).wait(100).call(callback, context, args);
        }

        close(callback, context, ...args): void {
            egret.Tween.get(this.component).to({x: this._orienX + 720}, 300).call(callback, context, args);
        }
    }
}
