var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameEvent = (function () {
    function GameEvent() {
    }
    /*************************************后端游戏消息***************************************** */
    GameEvent.GETOPENCELL = "GETOPENCELL"; //获取打开的棋子
    GameEvent.EATCELLBACK = "EATCELLBACK"; //吃掉棋子回调
    GameEvent.FAILCELLSEND = "FAILCELLSEND"; //失败棋子发送
    GameEvent.SYNCHRO = "SYNCHRO"; //同步
    GameEvent.NEXTROLE = "NEXTROLE"; //下一回合
    /****************************************前端通信消息************************************************ */
    GameEvent.WEB_FAILPLAYEND = "WEB_FAILPLAYEND"; //死亡棋子动画结束
    /**************************************后端其他消息************************************************ */
    GameEvent.MATCHGAME = "MATCHGAME"; //匹配游戏
    GameEvent.GAMESTART = "GAMESTART"; //游戏开始 传敌人的消息
    GameEvent.REDCHOOSE = "REDCHOOSE"; //抢红选择
    GameEvent.REDRESULT = "REDRESULT"; //抢红结果
    GameEvent.TIMESCHOOSE = "TIMESCHOOSE"; //加倍选择
    GameEvent.TIMESRESULT = "TIMESRESULT"; //加倍结果
    return GameEvent;
}());
__reflect(GameEvent.prototype, "GameEvent");
//# sourceMappingURL=GameEvent.js.map