class mainView extends gui.OvBase{
	public constructor() {
		super("xq","mainView");
	}

	/**
	 * 注销
	 */
	dispose():void
	{
		this.gameView.removeAll();
		this.gameView = null;
		super.dispose();
	}	

	open(...arg):void
	{
		//我自己的显示
		this.roleIconView.mySelfShow(api.data.nameObj);
	}

	/**
	 * 初始化
	 */
	initView():void
	{
		api.data.skyLayer = this._ui.getChild("skyLayer").asCom;
		this.robView      = new RobView(this._ui.getChild("robView").asCom);
		this.gameView     = new GameView(this._ui);
		this.roleIconView = new RoleIconView(this._ui);
		this.c1           = this._ui.getController("c1");
		this.c1.setSelectedIndex(0);
	}

	initEvent():void
	{	
		//游戏开始
		notification.addNotification(GameEvent.MATCHGAME,this.matchGame,this);  //开始匹配
		notification.addNotification(GameEvent.GAMESTART,this.gameStart,this);  //游戏开始
		notification.addNotification(GameEvent.REDCHOOSE,this.redChoose,this);  //抢红的选择
		notification.addNotification(GameEvent.REDRESULT,this.redResult,this);  //抢红的结果
		notification.addNotification(GameEvent.TIMESCHOOSE,this.timesChoose,this);  //倍速的选择
		notification.addNotification(GameEvent.TIMESRESULT,this.timesResult,this);  //倍速的结果

		//游戏中的逻辑
		notification.addNotification(GameEvent.GETOPENCELL,this.getOpenCell,this);      //打开棋子
		notification.addNotification(GameEvent.EATCELLBACK,this.eatCellBack,this);      //吃棋回调
		notification.addNotification(GameEvent.SYNCHRO,this.getSynchro,this);           //同步棋子
		notification.addNotification(GameEvent.FAILCELLSEND,this.getFailUpdate,this);   //失败棋子同步
		notification.addNotification(GameEvent.NEXTROLE,this.nextRole,this);  			//下一回合

		notification.addNotification(GameEvent.WEB_FAILPLAYEND,this.updateFailItem,this);  //失败棋子同步
	}


	/******************************************************************后端消息监听*********************************************************************************/
	/**
	 * 开始匹配
	 */
	private matchGame():void
	{
		this.c1.setSelectedIndex(1);
	}

	/**
	 * 游戏开始
	 */
	private gameStart(data:any):void
	{
		this.roleIconView.otherShow(data["name"]);
		this.c1.setSelectedIndex(2);
	}

	/**
	 * 抢红显示
	 */
	private redChoose(num:number):void
	{
		if(num == 1){
			//我抢红
			this.robView.openRobView(0);
		}else{
			this.roleIconView.otherStrShow("正在抢红");
			this.robView.openRobView(2);
		}
	}

	/**
	 * 抢红结果
	 */
	private redResult(num:number):void
	{
		api.data.myColor = num;
		this.roleIconView.redResult(num);
		//如果我是红色则我先手
		api.data.isClick = num == 1;
	}

	/**
	 * 倍数选择
	 */
	private timesChoose(num:number):void
	{
		// this.c1.setSelectedIndex(2);
		if(num == 1){
			//我倍数
			this.robView.openRobView(1);
		}else{
			console.log("正在加倍");
			this.roleIconView.otherStrShow("正在加倍");
			this.robView.openRobView(2);
		}
	}

	/**
	 * 倍数结果
	 */
	private timesResult(data:any):void
	{
		this.roleIconView.timesResult(data);
		//游戏开始表现动画

		//然后进入游戏界面
		this.c1.setSelectedIndex(3);
	}

	/**
	 * 打开棋子
	 */
	private getOpenCell(data:any):void				
	{
		this.gameView.getOpenCell(data);
	}

	/**
	 * 同步
	 */
	private getSynchro(data:any):void             
	{
		api.data.cellData = data;
		if(!api.data.itemMovePlay){
			this.gameView.updateItem();
		}
	}

	/**
	 * 获取失败棋子数据
	 */
	private getFailUpdate(data:any):void
	{
		api.data.failData = data;
		if(!api.data.itemMovePlay){
			this.gameView.updateFailItem();
		}
	}

	/**
	 * 吃掉棋子
	 */
	private eatCellBack(str:string):void
	{
		this.gameView.eatCellBack(str);
	}

	/**
	 * 下一回合
	 */
	private nextRole(num:number):void
	{
		
	}


	/***********************************************************前端消息监听****************************************************************/

	/**
	 * 更新失败棋子界面
	 */
	private updateFailItem():void
	{
		this.gameView.updateFailItem();
	}
	

	/***************************************************************点击事件***************************************************************** */
	protected clickHandler(index: number): void {
		super.clickHandler(index);
		switch (index) {
			case 0:             //开始游戏
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
	}

	private roleIconView : RoleIconView; 
	private gameView 	 : GameView;   //游戏界面
	private c1       	 : fairygui.Controller;
	private robView      : RobView;
}