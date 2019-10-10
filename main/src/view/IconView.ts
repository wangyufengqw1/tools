class IconView{
	public constructor(v:fairygui.GComponent,myIcon:headIcon) {
		this.mainView = v;
		this._myIcon = myIcon;
		this.initView();
	}

	private initView():void
	{
		this.itemlist = this.mainView.getChild("list").asList;
		this.itemlist.itemRenderer = this.iteRenderer; 
		this.itemlist.callbackThisObj = this;
		this.itemlist.numItems = 18;
		this.itemlist.addEventListener(fairygui.ItemEvent.CLICK,this.onItemClick,this);
		this.btn = [];
		this.btn.push(this.mainView.getChild("btn0").asButton);
		this.btn.push(this.mainView.getChild("btn1").asButton);
		this.btn[0].addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
		this.btn[1].addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClick,this);
	}

	private onClick(e:egret.TouchEvent):void
	{
		let num : number = this.btn.indexOf(e.currentTarget);
		if(num>-1){
			if(num == 0){
				notification.postNotification(GameEvent.web_closeDoor);
			}else{
				//选择头像
				//头像一致就不发消息给后端
				if(api.GlobalAPI.userData.getUserIcon() == this.chooseId){
					return ;
				}
				this._myIcon.myId = this.chooseId;
				api.GlobalAPI.webSocket.request(GameEvent.ChooseIcon,{icon:this.chooseId});
				notification.postNotification(GameEvent.web_closeDoor);
			}
		}
	}

	private iteRenderer(index:number,item:IconItem):void
	{
		item.myId = index+1;
	}

	private onItemClick(e:fairygui.ItemEvent):void
	{
		let item : IconItem = e.itemObject as IconItem;
		this.cleanChooseByItem();
		item.choose(true);
		this.chooseId= item.myId;
	}

	/**
	 * 头像选择界面点击清空
	 */
	private cleanChooseByItem():void
	{
		for(var y : number = 0;y<18;y++){
			let items: IconItem = this.itemlist.getChildAt(y) as IconItem;
			items.choose(false);
		}
	}


	private mainView : fairygui.GComponent;
	private itemlist : fairygui.GList;
	private btn      : fairygui.GButton[];
	private chooseId : number;
	private _myIcon  : headIcon;
}