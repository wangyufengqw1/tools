class RoleItem {
	public constructor(v:fairygui.GComponent) {
		this._ui = v;
		this.initView();
	}

	private initView():void
	{
		this.txt = [];
		for(let i : number = 0;i<4;i++){
			this.txt.push(this._ui.getChild("txt"+i).asTextField);
		}
		this.bar = new CircleTimer(50);
		(this._ui.displayObject as egret.DisplayObjectContainer).addChild(this.bar);
		this.bar.x = 406;
		this.bar.y = 0;
		this.bar.percent = 0;
		egret.Tween.get(this.bar).to({percent:1},5000).call(()=>{
			this.bar.clean();
		},this);
	}

	/**
	 * 头像id
	 */
	set item_id(v:number)
	{
		this._item_id = v;
	}		

	/**
	 * 玩家名字
	 */
	set icon_name(v:string)
	{
		this.txt[0].text = v.toString();
	}

	/**
	 * 玩家金钱
	 */
	set icon_money(v:string)
	{
		this.txt[1].text = v.toString();
	}

	set strShow(v:string)
	{
		this.txt[2].text = v.toString();
	}

	set strVisible(v:boolean)
	{
		this.txt[2].visible = v;
		this.txt[3].visible = v;
	}

	get numTxt():number
	{
		return  this.numT;
	}

	set numTxt(v:number)
	{
		this.numT = v;
		this.txt[3].text = Math.floor(v).toString();
	}

	getXY():number[]
	{	
		return [this._ui.x,this._ui.y];
	}

	getWH():number[]
	{	
		return [this._ui.width,this._ui.height];
	}

	private numT:number;
	private txt:fairygui.GTextField[];
	private _ui:fairygui.GComponent;
	private _item_id : number;
	private bar      : CircleTimer;
}