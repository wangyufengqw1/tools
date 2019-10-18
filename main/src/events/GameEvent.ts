class GameEvent {
	/**************************前后端交互信息*****************************/
	/**
	 * (登陆) (open_id)  (是否登陆成功的msg)
	 */
	static Login : string = "miniGame.Login";

	/**
	 * 登陆验证
	 */
	static AaAccountVerify : string = "miniGame.AaAccountVerify";

	/**
	 * 注册
	 */
	static CreateAaminiAccount : string = "miniGame.CreateAaminiAccount";

	/**
	 * （获取用户信息） (openId)  (errorCode（0.ok,1用户不存在，2，其他错误）)
	 */
	static GetAaminiAccountInfo : string = "miniGame.getaccountinfo";  

	/**
	 * 回到游戏大厅
	 */
	static GetRenshu : string = "miniGame.GetRenshu";  


	/**
	 * 选择头像
	 */
	static ChooseIcon : string = "miniGame.ChooseIcon"; 
	/**
	 * 请求打开对应的游戏
	 */
	static　getingame : string = "miniGame.getingame";

	/**
	 * 回复是否掉线
	 */
	static Getdiaoxianjiance : string = "miniGame.Getdiaoxianjiance";


	static kickout         : string = "kickout";                    //被顶号了
	static Logout          : string = "miniGame.Logout";            //退出
	static AddCoins        : string = "miniGame.AddCoins";          //金币加钱
	static Loginbyurl      : string = "miniGame.Loginbyurl";        //登录
	static getxintiaobao   : string = "miniGame.getxintiaobao";     //获取心跳包
	static xiantao         : string = "xiantao";                    //仙桃
	static connect         : string = "connect";                    //连接网络
	static diaoxian  	   : string = "diaoxian";       //后台询问是否掉线
	static weihu           : string = "weihu";                      //维护
	static loginTrue       : string = "loginTrue";                  //登录成功



	/***********前端********** */
	static web_closeDoor           : string = "closeDoor";                      //关闭
}