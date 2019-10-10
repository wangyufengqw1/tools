class LoginView extends gui.OvBase{
	public constructor() {
		super("common","loginView");
	}

	dispose():void
	{
		super.dispose();
	}

	private login : fairygui.Controller;
	/**
	 * 初始化界面 传入参数
	 */
	open(...args):void
	{
		this.login = this._ui.getController("login");
		this.login.setSelectedIndex(0);
		for(var i : number=0;i<5;i++)
		{
			this._textList.push(this.getTextField("txt"+i));
		}
	}

	/**********************************************************/
	protected clickHandler(index: number): void {
		super.clickHandler(index);
		api.GlobalAPI.soundManager.playEffectBuYrl("resource/assets/common/click.mp3",1);
		switch (index) {
			case 1: //开始游戏
				this.gotoLogin();
				break;
			case 2: //前往注册
				this.setText(3,'');
				this.setText(4,'');
				this.setText(2,'');
				this.login.setSelectedIndex(1);
				break;
			case 3: //注册
				this.createUserName();
				break;
			case 4: //关闭注册
			case 5:
				this.setText(0,'');
				this.setText(1,'');
				this.login.setSelectedIndex(0);
				break;	
			default:
				break;
		}
	}

	/**
	 * 前往登录
	 */
	private gotoLogin():void
	{	
		if(this.getText(0)=='' || this.getText(1)=='')
		{
			api.createAlert("账号或密码不能为空");
			return ;
		}
		api.GlobalAPI.webSocket.request(GameEvent.AaAccountVerify, {userName:this.getText(0),pwd:this.getText(1)},this.callbackByAaA.bind(this), (event: string, code: number, msg: string) => {
			console.error("无法连接游戏服务器.请确认网络连接无异常.[code:%s, msg:%s]", code, msg);
		//	kernel.event.dispatchEventWith('ConnectLoaginError', false, msg);
		});
	}

	/**
	 * 登录回调
	 */
	private  callbackByAaA(data:any):void
	{
		if(data["errorCode"] == 0){
			this.dispose();
			//账号登录成功、进入游戏
			api.GlobalAPI.userData.setOpenId(data["open_id"]);
			api.GlobalAPI.webSocket.login(data["open_id"]);
		}else if(data["errorCode"] == 1)
		{
			//用户不成功
			api.createAlert("用户不存在");
		}else if(data["errorCode"] == 2)
		{
			//密码错误
			api.createAlert("/密码错误");
		}else if(data["errorCode"] == 3)
		{
			//其他错误登录失败
			api.createAlert("其他错误登录失败");
		}
		
	}

	/**
	 * 注册
	 */
	private createUserName():void
	{
		api.GlobalAPI.webSocket.request(GameEvent.CreateAaminiAccount, { userName:this.getText(3),pwd:this.getText(4),email:this.getText(2)},this.userNameBack.bind(this), (event: string, code: number, msg: string) => {
			console.error("无法连接游戏服务器.请确认网络连接无异常.[code:%s, msg:%s]", code, msg);
		//	kernel.event.dispatchEventWith('ConnectLoaginError', false, msg);
		});
	}

	private userNameBack(data:any):void
	{
		if(data["errorCode"] == 0){
			if(data["open_id"]){
				api.GlobalAPI.userData.setOpenId(data["open_id"]);
			//	GlobalAPI.localData.set("open_id",data["open_id"]);
				this.setText(0,this.getText(3));
				this.setText(1,this.getText(4));
				this.gotoLogin();
			}	
		}else if(data["errorCode"] == 1)
		{
			//用户已经存在
			api.createAlert("用户已经存在");
		}else if(data["errorCode"] == 2)
		{
			//用户名太长
			api.createAlert("用户名太长");
		}else if(data["errorCode"] == 3)
		{
			//用户名太短
			api.createAlert("用户名太短");
		}else if(data["errorCode"] == 4)
		{
			//用密码太短
			api.createAlert("密码太短太短");
		}else if(data["errorCode"] == 5)
		{
			//密码太长
			api.createAlert("密码太长");
		}else if(data["errorCode"] == 6)
		{
			//账号密码只能是字母或数字
			api.createAlert("账号密码只能是字母或数字");
		}else if(data["errorCode"] == 7)
		{
			//其他错误
			api.createAlert("其他错误");
		}
	}
}