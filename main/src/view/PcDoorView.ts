class PcDoorView extends gui.OvBase{
	public constructor() {
		super("pcDoor","mainView");
	}


	dispose():void
	{
		super.dispose();
	}

	private c1 : fairygui.Controller;
//	private item :IconSprite[];
	private showNum : number = 18;
	private headIcon : headIcon;

	private btn100   : fairygui.GButton;
	open(...args):void
	{
		this._textList = [];
		for(var i : number = 0;i<4;i++)
		{
			if(i<2){
				this._textList.push(this.getTextField("txt"+i));
			}
		}

		this.btn100 = this._ui.getChild("btn100").asButton;
		if(api.GlobalAPI.publicApi.isRelease){
			this.btn100.visible = false;
		}
		this.createIcon();
		this.c1 = this._ui.getController("c1");	
		this.iconView = new IconView(this._ui.getChild("iconView").asCom,this.headIcon);
		api.GlobalAPI.soundManager.changeMusic(false,"");
		api.GlobalAPI.webSocket.request(GameEvent.GetRenshu,{},this.getRenshu.bind(this));	
		api.GlobalAPI.webSocket.request(GameEvent.GetAaminiAccountInfo,{},this.useDataUpdate.bind(this));
		notification.addNotification(GameEvent.web_closeDoor,this.closeIcon,this);
	}

	private closeIcon():void
	{
		this.c1.setSelectedIndex(0);
	}

	

	private myId    : number[] = [0,1,3,2,6,4,5,99];
	private nameArr : string[] = ["幸运福袋","欢乐钓鱼","大圣偷桃","扫雷","暗棋争霸","飞刀挑战","闯三关","敬请期待"];
	private mcArr   : number[] = [0,1,3,2,4,1,1,4];    //mc对应的颜色
	private tipsArr : number[] = [0,0,0,0,2,0,0,0];    //tip对应的标签 0是没有1是最热2是最新
	private pNum    : string[];
	private getRenshu(data:any):void
	{
		this.pNum = [];
		let hot : number[] = [0,0];     //热门
		for(var i : number=0;i<this.nameArr.length;i++){

			let atr : string = "";
			let str : string = String(data[this.nameArr[i]]);
			if(str == "undefined"){
				atr = "-1";
			}else{
				for(var x : number = 0;x<str.length;x++){
					atr+=str.charAt(x);
					if((str.length-x)%3==1 && x!=str.length-1){
						atr+=",";
					}
				}
			}
			if(atr!="-1"){
				this._ui.getChild("btn"+(i+1)).asButton.getChild("txt").text = atr + "人在玩";
			}
		}
	
	}

	
	/**
	 * 创建头像
	 */
	private createIcon():void
	{
		this.headIcon = new headIcon(this._ui.getChild("iconKong"));
		this._ui.getChild("btn98").asButton.addChild(this.headIcon);
	}


	private onRollOver(e: egret.TouchEvent): void {
		var num : number = this._buttonList.indexOf(e.currentTarget);
		if(num>-1){
			this._buttonList[num].setScale(1.1,1.1);
		}
    }

    private onRollOut(e: egret.TouchEvent): void {
   		var num : number = this._buttonList.indexOf(e.currentTarget);
		if(num>-1){
			this._buttonList[num].setScale(1,1);
		}
    }

	private cleanButton():void
	{
		for(var x : number =0;x<this._buttonList.length;x++)
		{
			this._buttonList[x].setScale(1,1);
		}
	}

	/**
	 * 初始化监听
	 */
	initEvent():void
	{
		this.regedEvebt={};
		this.eventInit();
	}

	private kickoutF():void
	{
		api.createAlert("账户在别处登陆，请重新连接",1,(type:number)=>
		{
			this.dispose();
			gui.addScene(LoginView);
		});
	}

	/**
	 * 后端消息接听初始化
	 */
	private regedEvebt:{[k: string]: (msg: any) => void};
	private  eventInit():void
    {
        if(this.regedEvebt!=null)
        {
            for(var o in this.regedEvebt)
            {
                api.GlobalAPI.webSocket.on(o,this.regedEvebt[o]);
            }
        }
    }

	/**
	 * 消息移除
	 */
    private eventRemove():void
    {
        if(this.regedEvebt!=null)
        {
            for(var o in this.regedEvebt)
            {
               api.GlobalAPI.webSocket.off(o,this.regedEvebt[o]);
            }
        }
    }

	protected onClick(e: egret.TouchEvent): void
	{
		super.onClick(e);
		api.GlobalAPI.soundManager.playEffectBuYrl("resource/assets/common/click.mp3",1);
		var num : number = this._buttonList.indexOf(e.currentTarget);
		if(num>-1){
			this._buttonList[num].setScale(1,1);
		}
	}

	/**
	 * 玩家数据更新
	 */
	private useDataUpdate(data:any):void
	{
		if(data["errorCode"] == 0){
			//用户获取成功
			if(data["a"]){
				if(data["a"]["username"]){
					api.GlobalAPI.userData.setUserName(data["a"]["username"]);
				}
				if(data["a"]["coins"]){
					api.GlobalAPI.userData.setUserCoins(data["a"]["coins"]);
				}else{
					api.GlobalAPI.userData.setUserCoins(0);
				}
				this.iconShow(data["a"]["icon"]);
			}
		}else if(data["errorCode"] == 1)
		{
			//用户不存在
			api.createAlert("用户不存在,返回登录界面",1,(type:number)=>
			{
				if(type == 1){
					this.dispose();
					gui.addScene(LoginView);
				}
			});

		}else if(data["errorCode"] == 2)
		{
			//其他错误返回登录界面
			api.createAlert("其他错误返回登录界面",1,(type:number)=>
			{
				if(type == 1){
					this.dispose();
					gui.addScene(LoginView);
				}
			});
		}
		this.update();
	}

	/**
	 * 头像展示
	 */
	private iconShow(num:number):void
	{
		if(num == 0){
			num = 1;
		}
	//	this.cleanChooseByItem();
//		this.item[num-1].choose(true);
		this.headIcon.myId = num;
		api.GlobalAPI.userData.setUserIcon(this.headIcon.myId);
	}

	/**
	 * 界面更新
	 */
	private update():void
	{
		this.setText(0,api.GlobalAPI.userData.getUserName());
		this.setText(1,api.GlobalAPI.userData.getUserCoins());
	}
	 

	/**********************************************************/
	protected clickHandler(index: number): void {
		super.clickHandler(index);
		switch (index) {	
			case 100:
				api.GlobalAPI.webSocket.request(GameEvent.AddCoins,{},this.addCoinsBack.bind(this));
				break;
			case 1:
				//红包
				api.GlobalAPI.webSocket.request(GameEvent.getingame,{gameid:1},(data)=>{
					if(data["errorCode"] == 0){
						gameTool.stage.setContentSize(1920,1080);
						gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
						api.GlobalAPI.moduleManager.openModule("redProject");
						this.dispose();
					}else{
						api.createAlert("游戏维护中");
					}
				});
			//	MemoryLeakUtil.resetObj();
				break;	
			case 2:		  
				//捕鱼
				api.GlobalAPI.webSocket.request(GameEvent.getingame,{gameid:2},(data)=>{
					if(data["errorCode"] == 0){
						gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
						gameTool.stage.setContentSize(1920,1080);
						api.GlobalAPI.moduleManager.openModule("fishGame");
						this.dispose();
					}else{
						api.createAlert("游戏维护中");
					}
				});
			//	MemoryLeakUtil.compare();
				break;	
			case 3:
				//扫雷
				api.GlobalAPI.webSocket.request(GameEvent.getingame,{gameid:4},(data)=>{
					if(data["errorCode"] == 0){
						gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
						gameTool.stage.setContentSize(1920,1080);
						api.GlobalAPI.moduleManager.openModule("sweepGame");
						this.dispose();
					}else{ 
						api.createAlert("游戏维护中");
					}
				});
				break;		
			case 4:
				api.GlobalAPI.webSocket.request(GameEvent.getingame,{gameid:5},(data)=>{
					if(data["errorCode"] == 0){
						api.GlobalAPI.moduleManager.openModule("gzHero");
						this.dispose();	
					}else{
						api.createAlert("游戏维护中");
					}
				});
				break;		
			case 5:
				api.GlobalAPI.webSocket.request(GameEvent.getingame,{gameid:6},(data)=>{
					if(data["errorCode"] == 0){
						api.GlobalAPI.moduleManager.openModule("feidao");
						this.dispose();
					}else{
						api.createAlert("游戏维护中");
					}
				});
				break;		
			case 6:
				api.GlobalAPI.webSocket.request(GameEvent.getingame,{gameid:7},(data)=>{
					if(data["errorCode"] == 0){
						api.GlobalAPI.moduleManager.openModule("rouge");
						this.dispose();
					}else{
						api.createAlert("游戏维护中");
					}
				});
				break;	
			case 7:
				api.GlobalAPI.moduleManager.openModule("xq");
				this.dispose();
				break;
			case 98:
				this.c1.setSelectedIndex(1);
				break;	
			default:
				break;
		}
	}

	private inRoom():void
	{
		this.dispose();
		setTimeout(function() {
			let ip: string = "47.52.32.227";
			let port: number = 9994;
			api.GlobalAPI.webSocket.connectServer(ip + ":" + port, () => {
				gui.addScene(LoginView)
			});
		}, 500);
	}

	private addCoinsBack(data:any):void
	{
		if(data["a"])
		{
			this.setText(1,data["a"]["coins"]);
			api.GlobalAPI.userData.setUserCoins(data["a"]["coins"])
		}
	}



	private iconView : IconView;       //头像界面
}