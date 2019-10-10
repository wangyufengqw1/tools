class LoadViewBase extends loadUI.BaseLoadingUI{
	public constructor(name:string) {
		super(name);
	}

	private txt : fairygui.GTextField;
	private imag  : fairygui.GImage;
	private _initWidth : number;
	/**
	 * 初始化
	 */
	initView():void
	{
		this.txt = this._ui.getChild("txt").asTextField;
		this.imag  = this._ui.getChild("imag").asImage;
		this._initWidth = this.imag.width;
		this.imag.width = 0;
	}

	/**
	 * 进度条加载
	 */
	setProgress(current: number, total: number):void
	{
		this.imag.width = current/total * this._initWidth;
		this.txt.text = "加载中："+Math.floor(current*100/total)+"%";
	}
}