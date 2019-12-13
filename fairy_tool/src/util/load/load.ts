/**
 * Created by lxz on 2017/10/17.
 */
/**
 * Created by lxz on 2017/8/3.
 */
module loadUtil {
    import singleton = gameTool.singleton;
    export var  packName:any;
    export class Loader {
        /**
         * 加载进度界面
         * loading process interface
         */
        private _loadingView: any;
        private _groupName: string;
        private _groupListens: any;
        private loadRes   : string[];
    //    private packName  : any;

        constructor() {
            this.loadRes = [];
            this._groupListens = {};
        }

        /**
         * 加载资源组
         * @param group     资源组名称
         * @param fun       回调函数
         * @param context   上下文
         * @param args      参数
         */
        loadGroup(group: string, loadingView: {new ():loadUI.BaseLoadingUI;} = null, fun: (...args) => any, context: any, ...args) {
            this._groupName = group;
            if (RES.isGroupLoaded(this._groupName)) {
                this._loadingView = null;
                fun.apply(context, args);
            } else {
                if (loadingView) { //显示进度条
                    if (delay.hasDelayMain(this)) {
                        delay.addDelayTransact(this, loadGroup, group, loadingView, fun, context, ...args);
                        return;
                    }
                    if (fairygui.UIPackage.getByName("load_ui") == null) {
                        delay.createDelayMain(this);
                        delay.addDelayTransact(this, loadGroup, group, loadingView, fun, context, ...args);
                        loadUtil.loadGroup("load_ui", null, () => {
                            fairygui.UIPackage.addPackage("load_ui");
                            delay.executeAllTransact(this);
                        }, this);
                        return;
                    }
                    this._loadingView = gui.addBox(loadingView , group);
                }
                this._groupListens[this._groupName] = (e: RES.ResourceEvent) => {
                    if (this._loadingView) {
                        gui.remove(this._loadingView);
                        this._loadingView = null;
                    }
                    fun.apply(context, args);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._groupListens[e.groupName], this);
                    this._groupListens[e.groupName] = null;
                    delete this._groupListens[e.groupName];
                };
                RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._groupListens[this._groupName], this);
                RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
                RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
                RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
                RES.loadGroup(this._groupName);
                this.desGroup(this._groupName);
            }
        }

        private desGroup(str:string):void
        {
            if(this.loadRes.indexOf(str)>-1 || str == "fish" || str == "xq"){
                return ;
            }
            this.loadRes.push(str);
            for(let i : number = this.loadRes.length-2;i>=0;i--){
                if(RES.destroyRes(this.loadRes[i])){
                    if(fairygui.UIPackage.getByName(loadUtil.packName[this.loadRes[i]])){
                         fairygui.UIPackage.removePackage(fairygui.UIPackage.getByName(loadUtil.packName[this.loadRes[i]]).id);
                    }
                     this.loadRes.splice(i,1); 
                };
            }
            
        }

        loadResource(path: string, dataFormat: string, complete: (res) => void, context: any) {
            let resourceLoader = new egret.URLLoader();
            let fun = (evt: egret.Event) => {
                var loader: egret.URLLoader = evt.currentTarget;
                loader.removeEventListener(egret.Event.COMPLETE, fun, this);
                complete.call(context, loader.data);
            }
            resourceLoader.addEventListener(egret.Event.COMPLETE, fun, this);
            resourceLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, (err)=>{
                console.log(err);
            }, this);
            resourceLoader.dataFormat = dataFormat;
            let resourceRequest = new egret.URLRequest(path);
            // resourceRequest.url = path;
            resourceLoader.load(resourceRequest);
        }

        /******************************************************************/
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError(event: RES.ResourceEvent): void {
            console.warn("资源组加载项加载出错 Url:" + event.resItem.url + " has failed to load");
        }

        /**
         * 资源组加载出错
         * Resource group loading failed
         */
        private onResourceLoadError(event: RES.ResourceEvent): void {
            //TODO
            console.warn("资源组加载出错 Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //ignore loading failed projects
        }

        /**
         * preload资源组加载进度
         * loading process of preload resource
         */
        private onResourceProgress(event: RES.ResourceEvent): void {
            if(this._loadingView){
                this._loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
            }
        }

    }

    /**
     * 加载资源组
     */
    export function loadGroup(group: string, loadingView: {new ():loadUI.BaseLoadingUI;} = null, fun: (...args) => any, context: any, ...args) {
        gameTool.singleton(Loader).loadGroup(group, loadingView, fun, context, ...args);
    }

    /*
     loadUtil.loadFastDragon("hero", () => {
     let hero = new animation.FastMovie();
     hero.movieKey = "hero";
     hero.x = 200;
     hero.y = 250;
     hero.movie.play("1");
     this.addChild(hero);
     }, this);
     */

    export function loadResource(path: string, dataFormat: string, complete: (res) => void, context: any) {
        singleton(Loader).loadResource(path, dataFormat, complete, context);
    }

    /**
     * 加载一个配置文件
     */
    export function loadConfigItem(path: string, complete: (res) => void, context: any) {
        if (path.indexOf(".data") > -1 || path.indexOf(".gz") > -1) {
            loadResource(path, egret.URLLoaderDataFormat.BINARY, complete, context);
        } else if (path.indexOf(".csv") > -1 || path.indexOf(".txt") > -1 || path.indexOf(".json") > -1) {
            loadResource(path, egret.URLLoaderDataFormat.TEXT, complete, context);
        } else {
            RES.getResAsync(path, complete, context);
        }
    }

    /*
     loadUtil.loadConfigItems(["monster_data"] , ()=>{
     console.log(MonsterConfig.getInstance().getTypeData(10005));
     console.log(MonsterConfig.getInstance().getTypeData(10007));
     console.log(MonsterConfig.getInstance().getTypeData(10001));
     },this , [MonsterConfig.init] , this);

     loadUtil.loadConfigItems(["monster_csv"] , ()=>{
     console.log(MonsterConfig.getInstance().getTypeData(10001));
     },this , [MonsterConfig.init] , this);
     */

    /**
     * 加载配置文件列表
     */
    export function loadConfigItems(paths: string[], complete: () => void, context1: any, parses ?: ((res) => void)[], context2 ?: any, index: number = 0) {
        if (paths.length == 0) {
            complete.call(context1);
            return;
        }
        this.loadConfigItem(paths[index], (res) => {
            // console.log("loadConfigItem");
            // console.log(res);
            if (res && parses) {
                parses[index].call(context2, res);
            }
            index++;
            if (paths.length == index) {
                complete.call(context1);
            } else {
                this.loadConfigItems(paths, complete, context1, parses, context2, index);
            }
        }, this);
    }
}