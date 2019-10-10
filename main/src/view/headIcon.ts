class headIcon extends fairygui.GComponent{
	private imag 	 : fairygui.GImage;
	public constructor(_icon:fairygui.GObject,setXy:boolean=false) {
		super();
		this.mask = _icon.displayObject;
		this.width = _icon.width;
		this.height = _icon.height;
		this._myid = -1;
		if(setXy){
			this.x = _icon.x;
			this.y = _icon.y;
		}
	}

	/**
	 * 头像编号
	 */
	private _myid : number;
	set myId(value:number)
	{  
		if(value == 0){
			value = 1;
		}
		if(value == this._myid && this.imag!=null){
			//相同编号不用再次加载
			return ;
		}
		if(this.imag){
			if(this.imag.parent){
				this.imag.parent.removeChild(this.imag);
			}
			this.imag = null;
		}
		this.imag = this.imag = new fairygui.GImage();
		this.addChild(this.imag);
		this._myid = value;
		RES.getResByUrl("resource/assets/icon/"+value.toString()+".jpg",this.imgLoadHandler,this,RES.ResourceItem.TYPE_IMAGE);
	}

	get myId():number
	{
		return this._myid;
	}

	private imgLoadHandler(texture:egret.Texture,url:string): void {
		this.imag.texture = texture;
		this.imag.width = this.width + 10;
		this.imag.height = this.height + 10;
		this.imag.x = -5;
		this.imag.y = -5;
    }

	clean():void
	{
		if(this.imag){
			if(this.imag.parent){
				this.imag.parent.removeChild(this.imag);
			}
			this.imag = null;
		}
	}

	
}