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
var item = (function (_super) {
    __extends(item, _super);
    function item() {
        var _this = _super.call(this) || this;
        _this.intiView();
        return _this;
    }
    item.prototype.intiView = function () {
        this.mainView = fairygui.UIPackage.createObject("xq", "item").asCom;
        this.width = this.mainView.width;
        this.height = this.mainView.height;
        this.c1 = this.mainView.getController("c1");
        this.select = this.mainView.getController("select");
        this.txt = this.mainView.getChild("txt").asTextField;
        this.addChild(this.mainView);
        this.t0 = this.mainView.getTransition("t0");
        this.t0.stop();
    };
    Object.defineProperty(item.prototype, "item_id", {
        get: function () {
            return this.$id;
        },
        /**
         * 设置这个棋子的身份
         */
        set: function (v) {
            this.$id = v;
            var x = Math.abs(v);
            if (v == 0) {
                this.visible = false;
                return;
            }
            if (v < 0) {
                this.txt.text = api.Data.blacknameStr[x - 1];
            }
            else {
                this.txt.text = api.Data.rednameStr[x - 1];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(item.prototype, "isVisible", {
        get: function () {
            return this.$isVisible;
        },
        /**
         * 设置这个棋子是否翻开
         */
        set: function (v) {
            this.$isVisible = v;
            if (!this.isVisible) {
                this.c1.setSelectedIndex(0);
                return;
            }
            if (this.$id > 0) {
                this.c1.setSelectedIndex(2); //红色棋子
            }
            else if (this.$id < 0) {
                this.c1.setSelectedIndex(1); //蓝色棋子
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 选中态 改变
     */
    item.prototype.setSelect = function (num) {
        if (!this.$isVisible && num == 0) {
            return;
        }
        this.select.setSelectedIndex(num);
    };
    /**
     * 播放棋子翻转动画
     */
    item.prototype.playRotate = function (v) {
        var _this = this;
        this.t0.play(function () {
            _this.item_id = v;
            _this.isVisible = true;
        }, this);
    };
    /**
     * 吃棋子或者是走一格
     */
    item.prototype.eatCell = function (x, y, f, thisArg) {
        var arg = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            arg[_i - 4] = arguments[_i];
        }
        egret.Tween.get(this).to({ x: x - this.width / 2, y: y - this.height / 2 }, 500).call(f, thisArg, arg);
    };
    /**
     * 死亡表现动画
     */
    item.prototype.die = function () {
        var _this = this;
        //飞往对应身份的地址
        if (this.$id == undefined) {
            this.$id = api.data.failData[api.data.failData.length - 1];
        }
        var point_id = Math.abs(this.$id) - 1;
        if (this.$id < 0) {
            point_id += 7;
        }
        var point = api.data.failpoint[point_id];
        egret.Tween.get(this).to({ x: point.x, y: point.y }, 500).call(function () {
            _this.visible = false;
            notification.postNotification(GameEvent.WEB_FAILPLAYEND);
        }, this);
    };
    return item;
}(fairygui.GComponent));
__reflect(item.prototype, "item");
//# sourceMappingURL=item.js.map