class RoleIconView {
	public constructor(v:fairygui.GComponent) {
		this._ui = v;
		this.initView();
	}

	private initView():void
	{
		this.roleItem = [];
//		this.btn      = [];
		for(let i : number = 0;i<2;i++){
			this.roleItem.push(new RoleItem(this._ui.getChild("icon"+i).asCom));;
		//	this.btn.push(this._ui.getChild("btn"+i).asButton);
		}
	}

	/**
	 * 自己的显示
	 */
	mySelfShow(data:any):void
	{
		this.roleItem[0].item_id = 1;
		this.roleItem[0].icon_name = data["name"];
		this.roleItem[0].icon_money = data["icons"];
		this.roleItem[0].strVisible = false;
	}

	/**
	 * 其他的显示
	 */
	otherShow(data:any):void
	{
		this.roleItem[1].item_id = 2;
		this.roleItem[1].icon_name = data["name"];
		this.roleItem[1].icon_money = data["icons"];
		this.roleItem[1].strVisible = false;
	}

	/**
	 * 其他玩家的显示
	 */
	otherStrShow(str:string):void
	{
		egret.Tween.resumeTweens(this.roleItem[1]);
		egret.Tween.removeTweens(this.roleItem[1]);
		this.roleItem[1].strVisible = true;
		this.roleItem[1].strShow    = str;
		this.roleItem[1].numTxt = 5;
		this.tween = egret.Tween.get(this.roleItem[1]).to({numTxt:0},5000).call(()=>{
			this.roleItem[1].strVisible = false;
		});
	}

	/**
	 * 抢红结果
	 */
	redResult(num:number):void
	{
		let z  : number   = num == 1?0:1;
		let xy : number[] = this.roleItem[z].getXY();
		let wh : number[] = this.roleItem[z].getWH();
		if(num == 1){
			gameTool.poolList.getInstance(items.ShowTip,1,"红方",xy[0],xy[1]-wh[1]);
		}else{
			gameTool.poolList.getInstance(items.ShowTip,0,"红方",xy[0],xy[1]+wh[1]);
		}
	}

	/**
	 * 加倍结果
	 */
	timesResult(data:any):void
	{
		let z   : number   = data["who"] == 1?0:1;   //1是玩家  但玩家对应的数组下标是0
		let str : string   = data["times"] == 1?"加倍":"不加倍"  //1代表加倍
		let xy  : number[] = this.roleItem[z].getXY();
		let wh  : number[] = this.roleItem[z].getWH();
		if(data["who"] == 1){
			gameTool.poolList.getInstance(items.ShowTip,1,str,xy[0],xy[1]-wh[1]);
		}else{
			gameTool.poolList.getInstance(items.ShowTip,0,str,xy[0],xy[1]+wh[1]);
		}
	}

	/**
	 * 下一回合
	 */
	nextRole(num:number):void
	{
		if(num == 1){  //我的回合则 可点击
			api.data.isClick = true;
		}else{		   //玩家的回合
			api.data.isClick = false;
		}
	}

	private _ui      :fairygui.GComponent;
	private roleItem : RoleItem[]; 
	private tween    : egret.Tween;
//	private btn      : fairygui.GButton[];
}