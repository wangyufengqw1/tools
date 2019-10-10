class failItem {
	public constructor(v:fairygui.GComponent) {
		this.mainView = v;
		this.initView();
	}

	private initView():void
	{
		this.txt = [];
		this.c1 = this.mainView.getController("c1");
		this.c2 = this.mainView.getController("c2");
		this.c3 = this.mainView.getController("c3");
		this.txt.push(this.mainView.getChild("txt0").asTextField);
		this.txt.push(this.mainView.getChild("txt1").asTextField);
		this.mainView.enabled = false;
	}

	/**
	 * 传入身份
	 */
	set item_id(v:number)
	{
		this._item_id = v;
		let x : number = Math.abs(v);
		if(v>0){
			this.txt[0].text = api.Data.rednameStr[x-1];
		}else{
			this.txt[0].text = api.Data.blacknameStr[x-1];
		}
	}

	get item_id():number
	{
		return this._item_id;
	}

	get x():number
	{
		return  this.mainView.x;
	}

	get y():number
	{
		return  this.mainView.y;
	}

	/**
	 * 数量
	 */
	numShow(v:number):void
	{
		if(v>1){
			this.c2.setSelectedIndex(1);
		}else{
			this.c2.setSelectedIndex(0);
		}
		if(v == 0){
			return ;
		}
		if(this._item_id>0){
			this.c1.setSelectedIndex(2);
		}else{
			this.c1.setSelectedIndex(1);
		}
		this.mainView.enabled = true;
		this.txt[1].text = "*"+v.toString();
	}

	/**
	 * 是否击杀
	 */
	isHit(v:boolean):void
	{
		if(v){
			this.c3.setSelectedIndex(1);
		}else{
			this.c3.setSelectedIndex(0);
		}
	} 

	private mainView : fairygui.GComponent;
	private c1       : fairygui.Controller;
	private c2       : fairygui.Controller;
	private c3       : fairygui.Controller;
	private txt      : fairygui.GTextField[];
	private _item_id : number;
}