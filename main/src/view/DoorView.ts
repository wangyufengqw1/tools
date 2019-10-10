class DoorView extends gui.OvBase{
	public constructor() {
		super("hallDoor","mainView");
	}


	dispose():void
	{
		this.remove();
		super.dispose();
	}

	private mathRadomBg : number = 0;
	private c1 : fairygui.Controller;
	private item :IconSprite[];
	private showNum : number = 18;
	private headIcon : headIcon;
	private itemlist : fairygui.GList;
	private btn100   : fairygui.GButton;
	private down     : fairygui.GComponent;
	open(...args):void
	{
		this.item = [];
		this._textList = [];
		for(var i : number = 0;i<4;i++)
		{
			if(i<2){
				this._textList.push(this.getTextField("txt"+i));
			}
		}
		for(var y : number = 0;y<this.showNum;y++){
			this.item.push(new IconSprite(this._ui.getChild("item"+y).asCom));
			this.item[y].addEventListener(IconSprite.ONCLICK,this.itemClick,this);
			this.item[y].myId = y+1;
		}
		this.btn100 = this._ui.getChild("btn100").asButton;
		if(api.GlobalAPI.publicApi.isRelease){
			this.btn100.visible = false;
		}
		this.down = this._ui.getChild("down").asCom;
		this.createIcon();
		this.c1 = this._ui.getController("c1");
		this.mathRadomBg = Math.floor(Math.random()*2)+1;		
		this.itemlist = this.getList("list");
		this.itemlist.itemRenderer = this.iteRenderer; 
		this.itemlist.callbackThisObj = this;
		this.itemlist.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL,this.onChange,this);
		this.itemlist.addEventListener(fairygui.ItemEvent.CLICK,this.onItemClick,this);
		api.GlobalAPI.soundManager.changeMusic(false,"");
		api.GlobalAPI.webSocket.request(GameEvent.GetRenshu,{},this.getRenshu.bind(this));	
		api.GlobalAPI.webSocket.request(GameEvent.GetAaminiAccountInfo,{},this.useDataUpdate.bind(this));
	}

	private onChange(e:fairygui.DragEvent):void
	{
		if(this.itemlist.scrollPane.posY + this.itemlist.height>=this.itemlist.scrollPane.contentHeight){
			this.down.visible = false;
		}else{
			this.down.visible = true;
		}
	}

	private getListItemResource(index:number)
	{
		return  fairygui.UIPackage.getItemURL("hallDoor", "publicBtn");
	}

	private iteRenderer(index:number,item:btnItem):void
	{
		item.myId(this.myId[index]);
		item.myName(this.nameArr[index]);
		item.setMcShow(this.mcArr[index]);
		item.setTipShow(this.tipsArr[index]);
		if(this.pNum[index] == ""){
			item.enabled = false;
			item.wx("正在维护中...");
		}else if(this.pNum[index] == "a"){
			item.wx("敬请期待..");
		}else{
			item.enabled = true;
			item.pNum(this.pNum[index]);
		}
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
			if(hot[0]<data[this.nameArr[i]]){
				hot[0] = data[this.nameArr[i]];
				hot[1] = i;
			}
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
			
			if(Number(atr) == 0){
				this.pNum.push("");
			}else if(Number(atr) == -1){
				this.pNum.push("a");
			}else{
				this.pNum.push(atr);
			}
		}
		this.changeNum(hot[1]);
		
		this.itemlist.numItems = this.nameArr.length;
	}

	/**
	 * 将热门放在第一位
	 */
	private changeNum(num:number):void
	{
		let t = this.myId[0];
		this.myId[0] = this.myId[num];
		this.myId[num] = t;

		let tt = this.nameArr[0];
		this.nameArr[0] = this.nameArr[num];
		this.nameArr[num] = tt;

		t = this.mcArr[0];
		this.mcArr[0] = this.mcArr[num];
		this.mcArr[num] = t;

		tt = this.pNum[0];
		this.pNum[0] = this.pNum[num];
		this.pNum[num] = tt;

		this.tipsArr[0] = 1;

	}

	private onItemClick(e:fairygui.ItemEvent):void
	{
		let item : btnItem = e.itemObject as btnItem;
		switch (item.getMyId()) {
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

	/**
	 * 头像选择界面头像点击
	 */
	private itemClick(e:egret.TouchEvent):void
	{
		this.cleanChooseByItem();
		var curItem : IconSprite = e.currentTarget;
		curItem.choose(true);
		//头像一致就不发消息给后端
		if(this.headIcon.myId == curItem.myId){
			return ;
		}
		this.headIcon.myId = curItem.myId;
		api.GlobalAPI.webSocket.request(GameEvent.ChooseIcon,{icon:curItem.myId});
	}

	/**
	 * 头像选择界面点击清空
	 */
	private cleanChooseByItem():void
	{
		for(var y : number = 0;y<this.showNum;y++){
			this.item[y].choose(false);
		}
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
		this.cleanChooseByItem();
		this.item[num-1].choose(true);
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
			case 99:
				this.c1.setSelectedIndex(0);
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

	private _type : number = 0;
	/**
	 * 进入房间
	 */
	private clickInRoom(num:number)
	{
		
	}

	private _data     : any;
	private _num:number = 0;
	private _dataFlag : boolean =false;
	private inRoomBack(data:any):void
	{
		
		
	}

	private remove():void
	{
		this._dataFlag = false;
		// for(var x :number = 0;x<this._buttonList.length;x++)
		// {
		// 	this._buttonList[x].removeEventListener(mouse.MouseEvent.ROLL_OVER, this.onRollOver, this);
		// 	this._buttonList[x].removeEventListener(mouse.MouseEvent.ROLL_OUT, this.onRollOut, this);
		// }
	}
}