class ModuleManager {
	/**
	 * 构造函数
	 */
	constructor()
	{
		this._modules    = [];
		this._moduleInfo = [];
	}
	/**
	 * 打开模块
	 */
	public openModule(p_moduleName:string,p_loadType:number=1,p_opendCallBack?:CallBackVo,...args):void
	{
		// var moduleInfo : ModuleInfo = this.getModuleInfo(p_moduleName);
		// if(!moduleInfo){
		// 	//如果模块信息不存在进行加载
		// 	loadUtil.loadGroup(p_moduleName,LoadType[p_moduleName],()=>{
		// 		moduleInfo = new ModuleInfo();
		// 		moduleInfo.moduleName = p_moduleName;  //名字赋值
		// 		let suffix = DEBUG?".js":".min.js";
		// 		let key    = "module_"+p_moduleName;   //模块的名字都是module_+p_moduleName;
		// 		var jsUrl : string = "resource/assets/module/"+p_moduleName+"/"+p_moduleName+suffix; //加载的js的路径
		// 		if(suffix == ".min.js"){
		// 			jsUrl = RES.getVirtualUrl("resource/assets/module/"+p_moduleName+"/"+p_moduleName+suffix)
		// 		}
		// 		var script: HTMLScriptElement = document.createElement("script");   //在html里创建一个script标签
		// 		script.src = jsUrl; //路径赋值
		// 		script.onload = ()=>
		// 		{
		// 			eval("moduleInfo.mainClass= " + key + ".Main");
        //       //      eval("moduleInfo.mediatorClass= " + key + ".Mediator");
        //             eval("moduleInfo.coreClass= " + key + ".Core");
        //             eval("moduleInfo.dataClass= " + key + ".Data");
        //             this._moduleInfo[p_moduleName] = moduleInfo;
		// 			this.applyModule(moduleInfo, p_opendCallBack, ...args);
		// 		}
		// 		 document.head.appendChild(script);  //将标签添加执行
		// 	},this);
		// }else
		// {
		// 	this.applyModule(moduleInfo, p_opendCallBack, ...args);
		// }
	}

	/**
	 * 执行模块
	 */
	private applyModule(p_moduleInfo:ModuleInfo,p_opendCallBack?:CallBackVo,...args):void
	{
		var currentModule: base.BaseModule = this.getModule(p_moduleInfo.moduleName);
        if (!currentModule) {
            currentModule = new p_moduleInfo.mainClass();
            p_moduleInfo.coreClass["main"] = currentModule;
            currentModule.moduleName = p_moduleInfo.moduleName;
            this._modules[p_moduleInfo.moduleName] = currentModule;
            currentModule.enter(p_moduleInfo, ...args);
            currentModule.addEventListener(ModuleManager.MODULE_CLOSED, this.onModuleClosed, this);
        }
        else {
            currentModule.open(...args);
        }
        if (p_opendCallBack) {
            p_opendCallBack.apply();
        }
	}

	private onModuleClosed(e: CEvent): void {
        var p_moduleName: string = (e.target as base.BaseModule).moduleName;
        this._modules[p_moduleName] = null;
        delete this._modules[p_moduleName];
    }

	/**
	 * 通过模块名获取模块信息
	 */
	public getModuleInfo(p_moduleName:string):ModuleInfo
	{
		return this._moduleInfo[p_moduleName];
	}

	public getModule(p_moduleName: string): base.BaseModule {
        return this._modules[p_moduleName]
    }

	private _moduleInfo : ModuleInfo[];   //模块数据的集合
	private _modules    : base.BaseModule[];//模块集合
	public static MODULE_CLOSED: string = "moduleClosed";   //关闭模块
    public static MODULE_OPENED: string = "moduleOpened";	//打开模块
}


class ModuleInfo
{
	moduleName : string;
	mainClass  : any;
//	mediatorClass:any;
	coreClass  : any;
	dataClass  : any;
}