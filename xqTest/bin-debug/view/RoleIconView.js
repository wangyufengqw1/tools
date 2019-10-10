var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var RoleIconView = (function () {
    function RoleIconView(v) {
        this._ui = v;
        this.initView();
    }
    RoleIconView.prototype.initView = function () {
        this.roleItem = [];
        //		this.btn      = [];
        for (var i = 0; i < 2; i++) {
            this.roleItem.push(new RoleItem(this._ui.getChild("icon" + i).asCom));
            ;
            //	this.btn.push(this._ui.getChild("btn"+i).asButton);
        }
    };
    /**
     * 自己的显示
     */
    RoleIconView.prototype.mySelfShow = function (data) {
        this.roleItem[0].item_id = 1;
        this.roleItem[0].icon_name = data["name"];
        this.roleItem[0].icon_money = data["icons"];
        this.roleItem[0].strVisible = false;
    };
    /**
     * 其他的显示
     */
    RoleIconView.prototype.otherShow = function (data) {
        this.roleItem[1].item_id = 2;
        this.roleItem[1].icon_name = data["name"];
        this.roleItem[1].icon_money = data["icons"];
        this.roleItem[1].strVisible = false;
    };
    /**
     * 其他玩家的显示
     */
    RoleIconView.prototype.otherStrShow = function (str) {
        var _this = this;
        egret.Tween.resumeTweens(this.roleItem[1]);
        egret.Tween.removeTweens(this.roleItem[1]);
        this.roleItem[1].strVisible = true;
        this.roleItem[1].strShow = str;
        this.roleItem[1].numTxt = 5;
        this.tween = egret.Tween.get(this.roleItem[1]).to({ numTxt: 0 }, 5000).call(function () {
            _this.roleItem[1].strVisible = false;
        });
    };
    /**
     * 抢红结果
     */
    RoleIconView.prototype.redResult = function (num) {
        var z = num == 1 ? 0 : 1;
        var xy = this.roleItem[z].getXY();
        var wh = this.roleItem[z].getWH();
        if (num == 1) {
            gameTool.poolList.getInstance(items.ShowTip, 1, "红方", xy[0], xy[1] - wh[1]);
        }
        else {
            gameTool.poolList.getInstance(items.ShowTip, 0, "红方", xy[0], xy[1] + wh[1]);
        }
    };
    /**
     * 加倍结果
     */
    RoleIconView.prototype.timesResult = function (data) {
        var z = data["who"] == 1 ? 0 : 1; //1是玩家  但玩家对应的数组下标是0
        var str = data["times"] == 1 ? "加倍" : "不加倍"; //1代表加倍
        var xy = this.roleItem[z].getXY();
        var wh = this.roleItem[z].getWH();
        if (data["who"] == 1) {
            gameTool.poolList.getInstance(items.ShowTip, 1, str, xy[0], xy[1] - wh[1]);
        }
        else {
            gameTool.poolList.getInstance(items.ShowTip, 0, str, xy[0], xy[1] + wh[1]);
        }
    };
    /**
     * 下一回合
     */
    RoleIconView.prototype.nextRole = function (num) {
        if (num == 1) {
            api.data.isClick = true;
        }
        else {
            api.data.isClick = false;
        }
    };
    return RoleIconView;
}());
__reflect(RoleIconView.prototype, "RoleIconView");
//# sourceMappingURL=RoleIconView.js.map