class CallBackVo {
	public handeler : Function;
	public thisObj  : any;
	public arg      : any;
	public once     : boolean = false;
	public constructor(_handler:Function = null,_thisObj:any = null,..._arg) {
		this.handeler = _handler;
		this.thisObj  = _thisObj;
		this.arg      = _arg;
	}

	public apply(...arg):any
	{
		if(arg && arg.length>0){
			this.arg = arg;
		}
		return  this.handeler.apply(this.thisObj,this.arg);
	}

	public free():void
	{
		this.handeler = null;
		this.thisObj  = null;
		this.arg      = null;
		this.once     = null;
	}
}