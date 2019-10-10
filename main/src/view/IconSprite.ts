class IconSprite extends fairygui.GComponent{
	private mainView : fairygui.GComponent;
	private c1       : fairygui.Controller;
	private _icon    : fairygui.GObject;
	private imag 	 : egret.Bitmap;
	static ONCLICK : string = "onClikc";
	public constructor(value:fairygui.GComponent) {
		super();
		this.mainView = value;
		this.c1 = this.mainView.getController("c1");
		this._icon = this.mainView.getChild("icon");
		this._myid = -1;
		this.imag = new egret.Bitmap();
		this.mainView.addEventListener(egret.TouchEvent.TOUCH_TAP,this.itemClick,this);
	}

	private itemClick(e:egret.TouchEvent):void
	{
		this.dispatchEvent(new egret.Event(IconSprite.ONCLICK));
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
		(this.mainView.displayObject as egret.DisplayObjectContainer).addChild(this.imag);
		this.imag.x = this._icon.x;
		this.imag.y = this._icon.y;
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