class btnItem extends fairygui.GButton{
	public constructor() {
		super();
	}

	constructFromResource():void
	{
		super.constructFromResource();
		this._txt = [];
		this.kong = this.getChild("kong").asCom;
		this._txt.push(this.getChild("txt0").asTextField);
		this._txt.push(this.getChild("txt1").asTextField);
//		this._txt.push(this.getChild("txt2").asTextField);
		this.c2 = this.getController("c2");
		this.mc      = this.getChild("mc").asCom;
		this.imag    = new fairygui.GImage();
		this.c3    = this.getController("c3");
	}

	/**
	 * 对应的id
	 */
	myId(num:number):void
	{
		this._myId = num;
	}


	/**
	 * 图片显示
	 */
	myUrl(num:string):void
	{
		RES.getResByUrl("resource/assets/icon/"+num+".png",this.imgLoadHandler,this,RES.ResourceItem.TYPE_IMAGE);
	}

	getMyId():number
	{
		return this._myId+1;
	}
	private _myId :number

	/**
	 * 状态显示
	 */
	setStateShow(num:number):void
	{
		this.c2.setSelectedIndex(num);
	}

	/**
	 * 免费显示
	 */
	setFreeShow(num:number):void
	{
		this.c3.setSelectedIndex(num);
	}


	setMcShow(num:number):void
	{
		this.mc.getController("c1").setSelectedIndex(num);
	}

	/**
	 * 我的名字
	 */
	myName(str:string):void
	{
		this._txt[0].text = str.toString();
	}

	pNum(str:string):void
	{
		if(str == ""){
			this._txt[1].text = "";
		}else{
			this._txt[1].text = str+"人在玩";
		}
		
	}

	wx(str:string):void
	{
		this._txt[1].text = str.toString();
	}

	private imgLoadHandler(texture:egret.Texture,url:string): void {
		this.imag.texture = texture;
		this.kong.addChild(this.imag);
    }

	private kong    : fairygui.GComponent;
	private _txt    : fairygui.GTextField[];
	private mc      : fairygui.GComponent;
	private imag    : fairygui.GImage;
	private c2      : fairygui.Controller;
	private c3      : fairygui.Controller;
}