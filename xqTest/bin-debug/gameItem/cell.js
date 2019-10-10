var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var cell = (function (_super) {
    __extends(cell, _super);
    function cell(num) {
        var _this = _super.call(this) || this;
        _this.$_id = num;
        _this.initView();
        return _this;
    }
    /**
     * 初始化
     */
    cell.prototype.initView = function () {
        this.mainView = fairygui.UIPackage.createObject("xq", "cell").asCom;
        this.width = this.mainView.width;
        this.height = this.mainView.height;
        this.c1 = this.mainView.getController("c1");
        this.c1.setSelectedIndex(0);
        this.addChild(this.mainView);
    };
    /**
     * 设置状态
     */
    cell.prototype.setSelectIndex = function (num) {
        this.c1.setSelectedIndex(num);
    };
    cell.prototype.getSelectIndex = function () {
        return this.c1.selectedIndex;
    };
    Object.defineProperty(cell.prototype, "type", {
        get: function () {
            return this.$type;
        },
        set: function (v) {
            this.$type = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(cell.prototype, "$id", {
        get: function () {
            return this.$_id;
        },
        enumerable: true,
        configurable: true
    });
    return cell;
}(fairygui.GComponent));
__reflect(cell.prototype, "cell");
//# sourceMappingURL=cell.js.map