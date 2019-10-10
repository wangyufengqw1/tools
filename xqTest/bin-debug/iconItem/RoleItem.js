var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RoleItem = (function () {
    function RoleItem(v) {
        this._ui = v;
        this.initView();
    }
    RoleItem.prototype.initView = function () {
        var _this = this;
        this.txt = [];
        for (var i = 0; i < 4; i++) {
            this.txt.push(this._ui.getChild("txt" + i).asTextField);
        }
        this.bar = new CircleTimer(50);
        this._ui.displayObject.addChild(this.bar);
        this.bar.x = 406;
        this.bar.y = 0;
        this.bar.percent = 0;
        egret.Tween.get(this.bar).to({ percent: 1 }, 5000).call(function () {
            _this.bar.clean();
        }, this);
    };
    Object.defineProperty(RoleItem.prototype, "item_id", {
        /**
         * 头像id
         */
        set: function (v) {
            this._item_id = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleItem.prototype, "icon_name", {
        /**
         * 玩家名字
         */
        set: function (v) {
            this.txt[0].text = v.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleItem.prototype, "icon_money", {
        /**
         * 玩家金钱
         */
        set: function (v) {
            this.txt[1].text = v.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleItem.prototype, "strShow", {
        set: function (v) {
            this.txt[2].text = v.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleItem.prototype, "strVisible", {
        set: function (v) {
            this.txt[2].visible = v;
            this.txt[3].visible = v;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoleItem.prototype, "numTxt", {
        get: function () {
            return this.numT;
        },
        set: function (v) {
            this.numT = v;
            this.txt[3].text = Math.floor(v).toString();
        },
        enumerable: true,
        configurable: true
    });
    RoleItem.prototype.getXY = function () {
        return [this._ui.x, this._ui.y];
    };
    RoleItem.prototype.getWH = function () {
        return [this._ui.width, this._ui.height];
    };
    return RoleItem;
}());
__reflect(RoleItem.prototype, "RoleItem");
//# sourceMappingURL=RoleItem.js.map