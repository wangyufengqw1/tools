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
var mainView = (function (_super) {
    __extends(mainView, _super);
    function mainView() {
        return _super.call(this, "xq", "mainView") || this;
    }
    /**
     * 注销
     */
    mainView.prototype.dispose = function () {
        this.gameView.removeAll();
        this.gameView = null;
        _super.prototype.dispose.call(this);
    };
    mainView.prototype.open = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        //我自己的显示
        this.roleIconView.mySelfShow(api.data.nameObj);
    };
    /**
     * 初始化
     */
    mainView.prototype.initView = function () {
        api.data.skyLayer = this._ui.getChild("skyLayer").asCom;
        this.robView = new RobView(this._ui.getChild("robView").asCom);
        this.gameView = new GameView(this._ui);
        this.roleIconView = new RoleIconView(this._ui);
        this.c1 = this._ui.getController("c1");
        this.c1.setSelectedIndex(0);
    };
    mainView.prototype.initEvent = function () {
        //游戏开始
        notification.addNotification(GameEvent.MATCHGAME, this.matchGame, this); //开始匹配
        notification.addNotification(GameEvent.GAMESTART, this.gameStart, this); //游戏开始
        notification.addNotification(GameEvent.REDCHOOSE, this.redChoose, this); //抢红的选择
        notification.addNotification(GameEvent.REDRESULT, this.redResult, this); //抢红的结果
        notification.addNotification(GameEvent.TIMESCHOOSE, this.timesChoose, this); //倍速的选择
        notification.addNotification(GameEvent.TIMESRESULT, this.timesResult, this); //倍速的结果
        //游戏中的逻辑
        notification.addNotification(GameEvent.GETOPENCELL, this.getOpenCell, this); //打开棋子
        notification.addNotification(GameEvent.EATCELLBACK, this.eatCellBack, this); //吃棋回调
        notification.addNotification(GameEvent.SYNCHRO, this.getSynchro, this); //同步棋子
        notification.addNotification(GameEvent.FAILCELLSEND, this.getFailUpdate, this); //失败棋子同步
        notification.addNotification(GameEvent.NEXTROLE, this.nextRole, this); //下一回合
        notification.addNotification(GameEvent.WEB_FAILPLAYEND, this.updateFailItem, this); //失败棋子同步
    };
    /******************************************************************后端消息监听*********************************************************************************/
    /**
     * 开始匹配
     */
    mainView.prototype.matchGame = function () {
        this.c1.setSelectedIndex(1);
    };
    /**
     * 游戏开始
     */
    mainView.prototype.gameStart = function (data) {
        this.roleIconView.otherShow(data["name"]);
        this.c1.setSelectedIndex(2);
    };
    /**
     * 抢红显示
     */
    mainView.prototype.redChoose = function (num) {
        if (num == 1) {
            //我抢红
            this.robView.openRobView(0);
        }
        else {
            this.roleIconView.otherStrShow("正在抢红");
            this.robView.openRobView(2);
        }
    };
    /**
     * 抢红结果
     */
    mainView.prototype.redResult = function (num) {
        api.data.myColor = num;
        this.roleIconView.redResult(num);
        //如果我是红色则我先手
        api.data.isClick = num == 1;
    };
    /**
     * 倍数选择
     */
    mainView.prototype.timesChoose = function (num) {
        // this.c1.setSelectedIndex(2);
        if (num == 1) {
            //我倍数
            this.robView.openRobView(1);
        }
        else {
            console.log("正在加倍");
            this.roleIconView.otherStrShow("正在加倍");
            this.robView.openRobView(2);
        }
    };
    /**
     * 倍数结果
     */
    mainView.prototype.timesResult = function (data) {
        this.roleIconView.timesResult(data);
        //游戏开始表现动画
        //然后进入游戏界面
        this.c1.setSelectedIndex(3);
    };
    /**
     * 打开棋子
     */
    mainView.prototype.getOpenCell = function (data) {
        this.gameView.getOpenCell(data);
    };
    /**
     * 同步
     */
    mainView.prototype.getSynchro = function (data) {
        api.data.cellData = data;
        if (!api.data.itemMovePlay) {
            this.gameView.updateItem();
        }
    };
    /**
     * 获取失败棋子数据
     */
    mainView.prototype.getFailUpdate = function (data) {
        api.data.failData = data;
        if (!api.data.itemMovePlay) {
            this.gameView.updateFailItem();
        }
    };
    /**
     * 吃掉棋子
     */
    mainView.prototype.eatCellBack = function (str) {
        this.gameView.eatCellBack(str);
    };
    /**
     * 下一回合
     */
    mainView.prototype.nextRole = function (num) {
    };
    /***********************************************************前端消息监听****************************************************************/
    /**
     * 更新失败棋子界面
     */
    mainView.prototype.updateFailItem = function () {
        this.gameView.updateFailItem();
    };
    /***************************************************************点击事件***************************************************************** */
    mainView.prototype.clickHandler = function (index) {
        _super.prototype.clickHandler.call(this, index);
        switch (index) {
            case 0://开始游戏
                break;
            case 1:
                //发送开始游戏给后端
                api.core.sendStartGame();
                break;
            case 2:
                break;
            default:
                break;
        }
    };
    return mainView;
}(gui.OvBase));
__reflect(mainView.prototype, "mainView");
//# sourceMappingURL=mainView.js.map