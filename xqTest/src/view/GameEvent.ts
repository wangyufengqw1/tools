class GameEvent {

    /*************************************后端游戏消息***************************************** */
    static GETOPENCELL :string = "GETOPENCELL";     //获取打开的棋子
    static EATCELLBACK :string = "EATCELLBACK";     //吃掉棋子回调
    static FAILCELLSEND:string = "FAILCELLSEND";    //失败棋子发送
    static SYNCHRO     :string = "SYNCHRO";         //同步
    static NEXTROLE    :string = "NEXTROLE";                //下一回合




    /****************************************前端通信消息************************************************ */
    static WEB_FAILPLAYEND : string = "WEB_FAILPLAYEND";   //死亡棋子动画结束








    /**************************************后端其他消息************************************************ */
    static MATCHGAME   : string = "MATCHGAME";     //匹配游戏
    static GAMESTART   : string = "GAMESTART";     //游戏开始 传敌人的消息
    static REDCHOOSE   : string = "REDCHOOSE";     //抢红选择
    static REDRESULT   : string = "REDRESULT";     //抢红结果
    static TIMESCHOOSE : string = "TIMESCHOOSE";   //加倍选择
    static TIMESRESULT : string = "TIMESRESULT";   //加倍结果
}