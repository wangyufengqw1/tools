class DoorView extends gui.OvBase{
	public constructor() {
		super("hallDoor","mainView");
	}


	dispose():void
	{
		this.isOver = true;
		this.remove();
		this.eventRemove();
		super.dispose();
	}

	private mathRadomBg : number = 0;
	private c1 : fairygui.Controller;
	private item :IconSprite[];
	private showNum : number;
	private headIcon : headIcon;
	private itemlist : fairygui.GList;
	private btn100   : fairygui.GButton;
	private down     : fairygui.GComponent;
	open(...args):void
	{
		
	}

	initView():void
	{
		this.showNum = 18;
		this.item = [];
		this._textList = [];
		for(var i : number = 0;i<5;i++)
		{
			this._textList.push(this.getTextField("txt"+i));
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
		// api.GlobalAPI.soundManager.pauseBGM();
		// api.GlobalAPI.soundManager.isNoHaveMusic = true;
		api.GlobalAPI.webSocket.request(GameEvent.GetRenshu,{},this.getRenshu.bind(this));	
		api.GlobalAPI.webSocket.request(GameEvent.GetAaminiAccountInfo,{},this.useDataUpdate.bind(this));
		this.createTip();
		api.GlobalAPI.soundManager.playBGM("resource/assets/common/bgm.mp3");
	}

	private onChange(e:fairygui.DragEvent):void
	{
		if(this.itemlist.scrollPane.posY + this.itemlist.height>=this.itemlist.scrollPane.contentHeight){
			this.down.visible = false;
		}else{
			this.down.visible = true;
		}
	}

	private iteRenderer(index: number, item: btnItem):void
	{
	//	api.GlobalAPI.publicApi.pNum = [];\
		let num : number = this.myId[index];      //对应的下标
		let doordata : DoorShowTypeData = DoorShowConfig.getInstance().getTypeData(num);
		item.myId(doordata.id);
		item.myUrl(doordata.url);
		item.myName(doordata.name);
		item.setMcShow(doordata.color);
		item.setStateShow(doordata.state);
		item.setFreeShow(doordata.free);

		let str : string = String(this.curdata[doordata.name]);
		let atr : string = "";
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
			if(atr == "0"){
				item.enabled = false;
				item.getChild("txt1").asTextField.text = "正在维护中...";
			}else{
				item.enabled = true;
				item.getChild("txt1").asTextField.text = atr + "人在玩";
			}
		}
		if(Number(atr) == 0){
			api.GlobalAPI.publicApi.pNum.push("");
			item.enabled = false;
			item.wx("正在维护中...");
		}else if(Number(atr) == -1){
			item.wx("敬请期待..");
			api.GlobalAPI.publicApi.pNum.push("a");
		}else{
			item.enabled = true;
			item.pNum(atr);
			api.GlobalAPI.publicApi.pNum.push(atr);
		}
		
		if(this.curdata["fenghao"] &&  this.curdata["fenghao"]==1){
			this.c1.setSelectedIndex(2);
			this.isFeng = true;
		}else{
			this.isFeng = false;
		}
	}

	private myId    : any = [];
	private getRenshu(data:any):void
	{
		this.curdata =data;
		api.GlobalAPI.publicApi.pNum = [];
		this.myId         = DoorShowConfig.getRank();
		this.itemlist.numItems = DoorShowConfig.getRank().length;
	}
	private isFeng:boolean
	private curdata:any;

	private onItemClick(e:fairygui.ItemEvent):void
	{
	// 	let item : btnItem = e.itemObject as btnItem;
	// 	api.GlobalAPI.soundManager.playBGM("resource/assets/common/bgm.mp3");
	// 	if(item.getMyId() == 101 || item.getMyId() == 102){
	// 		this.c1.setSelectedIndex(0);
	// 	}else if(this.isFeng){
	// 		this.c1.setSelectedIndex(2);
	// 		return ;
	// 	}
	// 	api.GlobalAPI.soundManager.isNoHaveMusic = false;

	//    let doordata : DoorShowTypeData = DoorShowConfig.getInstance().getTypeData(item.getMyId());
	// 	api.GlobalAPI.webSocket.request(GameEvent.getingame,{gameid:item.getMyId()},(data)=>{
	// 		if(data["errorCode"] == 0){
	// 			let a : number[] = DoorShowConfig.getCow();
	// 			if(a.indexOf(item.getMyId())>-1){
	// 				gameTool.stage.setContentSize(1920,1080);
	// 				gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
	// 			}
	// 			api.GlobalAPI.moduleManager.openModule(doordata.moduleName);
	// 			this.dispose();
	// 		}else{
	// 			api.createAlert("游戏维护中");
	// 		}
	// 	});	
	 	
	// 	switch (item.getMyId()) {
	// 		case 101:
	// 		case 102:
	// 			this.c1.setSelectedIndex(0);
	// 			break;	
	// 	}
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
		this._textList[3].addEventListener(egret.TouchEvent.TOUCH_TAP,this.txtClick,this);
		this._textList[3].addEventListener(egret.TextEvent.CHANGE,this.txtChange,this);
		this.regedEvebt[GameEvent.CMD_HF]=this.tipShow.bind(this); 
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
			case 103:
				this.c1.setSelectedIndex(0);
				break;
			case 104:
				if(this._textList[3].text == this.txtInit){
					tip.showTextTip("提交成功");
					this.c1.setSelectedIndex(0);
					return ;
				}
				api.GlobalAPI.webSocket.request(GameEvent.Yijianfankui,{content:this._textList[3].text});
				this.c1.setSelectedIndex(0);
				tip.showTextTip("提交成功");
				break;		
			case 105:
				gameTool.stage.setContentSize(1920,1080);
				gameTool.stage.orientation = egret.OrientationMode.LANDSCAPE;
				api.GlobalAPI.moduleManager.openModule("niu");
				// this.c1.setSelectedIndex(3);
				// this._textList[3].text = this.txtInit;
				// this._textList[3].color = 0xCCCCCC;
				// this._textList[4].text = "还能输入60字";
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

	/**
	 * 前端提示
	 */
	private createTip():void
	{
		this.tipArr = [];
		this.tipNum = -1;
		this.c2 = this._ui.getController("c2");	
		this.c2.setSelectedIndex(0);
	}

	/**
	 * 推送展示
	 */
	private tipShow(data:any):void
	{
		if(data!=null){
			this.tipArr.push(data);
		}
		if(this.tipNum == -1){
			this.tipNum++;
			this.showTip();
		}
	}

	/**
	 * 显示提示
	 */
	private showTip():void
	{
		if(this.isOver){
			return ;
		}
		this.c2.setSelectedIndex(1);
		this._textList[2].text = api.GlobalAPI.publicApi.doorTipShow(this.tipArr[this.tipNum]);
		setTimeout(this.nextTip.bind(this), 6000);
	}

	/**
	 * 下一条推送
	 */
	private nextTip():void
	{
		this.tipNum++;
		this.c2.setSelectedIndex(0);
		//当推送完后 重置
		if(this.tipNum>=this.tipArr.length){
			this.tipNum = -1;
			this.tipArr = [];
			return ;
		}
		//消失2s接着弹
		setTimeout(this.showTip.bind(this), 3000);
	}

	/*****************************************************************意见反馈*******************************************************************/
	/**
	 * 文本点击
	 */
	private txtClick(e:egret.TouchEvent):void
	{
		if(this._textList[3].color == 0xCCCCCC){
			this._textList[3].color = 0x666666;
			this._textList[3].text = "";
		}
	}

	private txtChange(e:egret.Event):void
	{	
		this._textList[4].text = "还能输入"+(60-this._textList[3].text.length) +"字";
	}

	private isOver   : boolean;
	private tipNum   : number;
	private tipArr   : string[];       //推送数组
	private c2       : fairygui.Controller;
	private txtInit  : string = "您有什么想玩的游戏，不错的建议，都可以在这里告诉我们噢~我们非常重视！（注：10-60个字符，账号、充值、输赢相关问题请直接联系网站客服）";
}