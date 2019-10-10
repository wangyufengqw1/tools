var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RobView = (function () {
    function RobView(v) {
        this._ui = v;
        this.initView();
        this.initEvent();
    }
    RobView.prototype.initView = function () {
        this.btn = [];
        for (var i = 0; i < 2; i++) {
            this.btn.push(this._ui.getChild("btn" + i).asButton);
        }
        this.c1 = this._ui.getController("c1");
        this.txt = this._ui.getChild("txt").asTextField;
    };
    RobView.prototype.initEvent = function () {
        for (var i = 0; i < 2; i++) {
            this.btn[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        }
    };
    RobView.prototype.click = function (e) {
        var num = this.btn.indexOf(e.currentTarget);
        if (num > -1) {
            if (this.c1.selectedIndex == 0) {
                //抢红
                api.core.sendRedChoose(num);
            }
            else if (this.c1.selectedIndex == 1) {
                //是否加倍
                api.core.sendTimesChoose(num);
            }
        }
    };
    /**
     * 打开抢红
     */
    RobView.prototype.openRobView = function (num) {
        var _this = this;
        this.c1.setSelectedIndex(num);
        if (num == 2) {
            //什么都不显示
            return;
        }
        egret.Tween.resumeTweens(this);
        egret.Tween.removeTweens(this);
        this.numTxt = 5;
        this.tween = egret.Tween.get(this).to({ numTxt: 0 }, 5000).call(function () {
            _this.c1.setSelectedIndex(2);
        }, this);
    };
    RobView.prototype.dispose = function () {
        for (var i = 0; i < 2; i++) {
            this.btn[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.click, this);
        }
    };
    Object.defineProperty(RobView.prototype, "numTxt", {
        get: function () {
            return this._numT;
        },
        set: function (v) {
            this._numT = v;
            this.txt.text = Math.floor(v).toString();
        },
        enumerable: true,
        configurable: true
    });
    return RobView;
}());
__reflect(RobView.prototype, "RobView");
//# sourceMappingURL=RobView.js.map