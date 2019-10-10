var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var items;
(function (items) {
    var ShowTip = (function () {
        function ShowTip() {
            this.mainView = fairygui.UIPackage.createObject("xq", "showTip").asCom;
            this.txt = this.mainView.getChild("txt").asTextField;
        }
        ShowTip.prototype.initData = function (type, str, x, y) {
            var _this = this;
            this.txt.text = str;
            egret.Tween.resumeTweens(this);
            if (this.tween) {
                this.tween = null;
            }
            if (type == 1) {
                this.txt.x = this.mainView.width - this.txt.width;
                this.mainView.x = 0;
                this.tween = egret.Tween.get(this.mainView).to({ x: 1080 - this.mainView.width }, 1000).to({ x: 1080 - this.mainView.width }, 1000).call(function () {
                    _this.remove();
                }, this);
            }
            else {
                this.txt.x = 0;
                this.mainView.x = 1080;
                this.tween = egret.Tween.get(this.mainView).to({ x: x }, 1000).to({ x: x }, 1000).call(function () {
                    _this.remove();
                }, this);
            }
            this.mainView.y = y;
            api.data.skyLayer.addChild(this.mainView);
        };
        ShowTip.prototype.remove = function () {
            gameTool.poolList.remove(this);
        };
        ShowTip.prototype.retrieve = function () {
            if (this.mainView) {
                if (this.mainView.parent) {
                    this.mainView.parent.removeChild(this.mainView);
                }
            }
        };
        return ShowTip;
    }());
    items.ShowTip = ShowTip;
    __reflect(ShowTip.prototype, "items.ShowTip");
})(items || (items = {}));
//# sourceMappingURL=ShowTip.js.map