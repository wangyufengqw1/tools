var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var failItem = (function () {
    function failItem(v) {
        this.mainView = v;
        this.initView();
    }
    failItem.prototype.initView = function () {
        this.txt = [];
        this.c1 = this.mainView.getController("c1");
        this.c2 = this.mainView.getController("c2");
        this.c3 = this.mainView.getController("c3");
        this.txt.push(this.mainView.getChild("txt0").asTextField);
        this.txt.push(this.mainView.getChild("txt1").asTextField);
        this.mainView.enabled = false;
    };
    Object.defineProperty(failItem.prototype, "item_id", {
        get: function () {
            return this._item_id;
        },
        /**
         * 传入身份
         */
        set: function (v) {
            this._item_id = v;
            var x = Math.abs(v);
            if (v > 0) {
                this.txt[0].text = api.Data.rednameStr[x - 1];
            }
            else {
                this.txt[0].text = api.Data.blacknameStr[x - 1];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(failItem.prototype, "x", {
        get: function () {
            return this.mainView.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(failItem.prototype, "y", {
        get: function () {
            return this.mainView.y;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * 数量
     */
    failItem.prototype.numShow = function (v) {
        if (v > 1) {
            this.c2.setSelectedIndex(1);
        }
        else {
            this.c2.setSelectedIndex(0);
        }
        if (v == 0) {
            return;
        }
        if (this._item_id > 0) {
            this.c1.setSelectedIndex(2);
        }
        else {
            this.c1.setSelectedIndex(1);
        }
        this.mainView.enabled = true;
        this.txt[1].text = "*" + v.toString();
    };
    /**
     * 是否击杀
     */
    failItem.prototype.isHit = function (v) {
        if (v) {
            this.c3.setSelectedIndex(1);
        }
        else {
            this.c3.setSelectedIndex(0);
        }
    };
    return failItem;
}());
__reflect(failItem.prototype, "failItem");
//# sourceMappingURL=failItem.js.map