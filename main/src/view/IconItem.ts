class IconItem extends fairygui.GComponent{
	private mainView : fairygui.GComponent;
	private c1       : fairygui.Controller;
	private _icon    : fairygui.GObject;
	private imag 	 : egret.Bitmap;
	public constructor() {
		super();
		
	}

	constructFromResource():void
	{
		super.constructFromResource();
		this.c1 = this.getController("c1");
		this._icon = this.getChild("icon");
		this._myid = -1;
		this.imag = new egret.Bitmap();
	}

	/**
	 * 头像编号
	 */
	private _myid : number;
	set myId(value:number)
	{
		if(value == this._myid){
			//相同编号不用再次加载
			return ;
		}
		this._myid = value;
		RES.getResByUrl("resource/assets/icon/"+value.toString()+".jpg",this.imgLoadHandler,this,RES.ResourceItem.TYPE_IMAGE);
	}

	private imgLoadHandler(texture:egret.Texture,url:string): void {
		this.imag.texture = texture;
		(this.displayObject as egret.DisplayObjectContainer).addChild(this.imag);
		this.imag.width = this.width + 10;
		this.imag.height = this.height + 10;
		this.imag.x = -5;
		this.imag.y = -5;
		this.imag.mask = this._icon.displayObject;
    }

	get myId():number
	{
		return this._myid;
	}

	choose(v:boolean):void
	{
		if(v){
			this.c1.setSelectedIndex(1);
		}else{
			this.c1.setSelectedIndex(0);
		}
	}
}