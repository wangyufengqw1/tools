class cell extends fairygui.GComponent{
	public constructor(num:number) {
		super();
		this.$_id = num;
		this.initView();
	}

	/**
	 * 初始化
	 */
	private initView():void
	{
		this.mainView = fairygui.UIPackage.createObject("xq","cell").asCom;
		this.width	  = this.mainView.width;
		this.height   = this.mainView.height;
		this.c1 = this.mainView.getController("c1");
		this.c1.setSelectedIndex(0);
		this.addChild(this.mainView);
	}

	/**
	 * 设置状态
	 */
	setSelectIndex(num:number):void
	{
		this.c1.setSelectedIndex(num);
	}

	getSelectIndex():number
	{
		return this.c1.selectedIndex;
	}

	set type(v:number)
	{
		this.$type = v;
	}

	get $id():number
	{
		return this.$_id;
	}

	get type():number
	{
		return this.$type;
	}

	private mainView : fairygui.GComponent;
	private c1       : fairygui.Controller;
	private $_id      : number;
	private $type    : number;   //棋盘状态  0有棋子 1无棋子 2损坏
}