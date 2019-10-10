/**
 * Created by brucex on 16/5/26.
 */
module gameTool {
    /**
     * 获取显示对象的base64
     * @param {egret.DisplayObject} obj
     * @returns {string}
     */
    export function renderTexture(obj: egret.DisplayObject): string {
        var rt: egret.RenderTexture = new egret.RenderTexture();
        var rect: egret.Rectangle = new egret.Rectangle(0, 0, obj.width, obj.height);
        rt.drawToTexture(obj, rect);
        var base64: string = rt.toDataURL("image/png");
        return base64;
    }

    export interface Scale {
        x: number;
        y: number;
    }

    export class display {
        /**
         * 设置显示对象的相对描点
         * @param disObj 需要设置描点的显示对象
         * @param anchorX X轴相对描点
         * @param anchorY Y轴相对描点
         */
        static setAnchor(disObj: egret.DisplayObject, anchorX: number, anchorY: number = anchorX): void {
            disObj.anchorOffsetX = disObj.width * anchorX;
            disObj.anchorOffsetY = disObj.height * anchorY;
        }

        static get stageW(): number {
            return gameTool.stage.stageWidth;
        }

        static get stageH(): number {
            return gameTool.stage.stageHeight;
        }

        static pointInScreen(targetObj: egret.DisplayObject, x: number, y: number): boolean {
            var p = targetObj.localToGlobal(x, y);
            return (
                p.x > 0 &&
                p.y > 0 &&
                p.x < this.stageW &&
                p.y < this.stageH
            )
        }

        static inScreen(displayObj: egret.DisplayObject): boolean {
            var bounds = displayObj.getTransformedBounds(gameTool.stage);
            var w = this.stageW;
            var h = this.stageH;

            return (
                bounds.x >= -bounds.width &&
                bounds.x <= w &&
                bounds.y >= -bounds.height &&
                bounds.y <= h
            );
        }


        static setFullDisplay(display: egret.DisplayObject): void {
            display.width = this.stageW;
            display.height = this.stageH;
        }

        static getStagePosition(anchorX: number, anchorY: number = anchorX): any {
            var x = this.stageW * anchorX;
            var y = this.stageH * anchorY;
            return {x: x, y: y};
        }

        static setPositionFromStage(obj: egret.DisplayObject, anchorX: number = 0.5, anchorY: number = anchorX): void {
            var pos = this.getStagePosition(anchorX, anchorY);
            obj.x = pos.x;
            obj.y = pos.y;
        }

        static sort(container: egret.DisplayObjectContainer): void {
            var count: number = container.numChildren;
            var children: egret.DisplayObject[] = [];
            for (var i = 0; i < count; i++) {
                children.push(container.getChildAt(i));
            }

            children.sort((a: egret.DisplayObject, b: egret.DisplayObject) => {
                return a.y - b.y;
            });

            children.forEach((v: egret.DisplayObject, idx: number) => {
                container.setChildIndex(v, idx);
            });
        }

        static findTypeParent<T>(display: any, type: { new(): T; }): T {
            var parent = display.parent;
            while (parent) {
                if (parent instanceof type) {
                    return parent;
                }
                parent = parent.parent;
            }
            return null;
        }

        /**
         * 移除容器中的所有子显示对象
         * @param container 需要移除子显示对象的容器
         */
        static removeAllChildren(container: egret.DisplayObjectContainer): void {
            while (container.numChildren > 0) {
                container.removeChildAt(0);
            }
        }

        /**
         * 将源显示对象中的位置转换成目标对象中的位置
         * @param x 源显示对象x轴
         * @param y 源显示对象y轴
         * @param source 源显示对象
         * @param dist 目标显示对象
         * @returns {egret.Point}
         */
        static localTolocal(x, y, source, dist, p = new egret.Point(x, y)): egret.Point {
            p = source.localToGlobal(x, y, p);
            p = dist.globalToLocal(p.x, p.y, p);
            return p;
        }

        static getScale(obj: egret.DisplayObject): Scale {
            var ret: Scale = {x: obj.scaleX, y: obj.scaleY};
            while (obj.parent) {
                obj = obj.parent;
                ret.x *= obj.scaleX;
                ret.y *= obj.scaleY;
            }
            return ret;
        }
    }
}