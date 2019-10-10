/**
 * Created by lxz on 2017/8/10.
 */
module js_tool {
    export class jsLoader {
        startApp(jscode: string[] , complete:()=>void , context:any) {
            //console.log("startApp");

            for (var i = 0; i < jscode.length; i++) {
                jsLoader.instance().addImportScript(jscode[i]);
            }
            jsLoader.instance().preload(
                () => {
                    complete.apply(context);
                    //console.log("load all script done.")
                },
                (total, left) => {
                   // console.log("load script:total=" + total + "  left:" + left);
                }
            );
        }

        private static _instance: jsLoader;

        private importList: string[] = [];
        private importScriptsList: HTMLScriptElement[] = [];
        private totaltask: number;

        private _complete: () => void;
        private _process: (total: number, left: number) => void;

        public static instance(): jsLoader {
            if (!jsLoader._instance) {
                jsLoader._instance = new jsLoader();
            }

            return jsLoader._instance;
        }

        ///开始加载，脚本或者css
        ///complete: () => void,完成时回掉
        ///process: (total: number, left: number) => void，加载进度变化时回掉，总数和剩余任务数量，剩余0 就是完成了
        public preload(complete: () => void, process: (total: number, left: number) => void = null) {
            this.totaltask = this.importList.length;
            this._process = process;
            this._complete = complete;
            requestAnimationFrame
            (() => {
                if (this.importList.length > 0) {
                    this.startLoadScript(null);
                }
                else {
                    this.onAllLoadComplete();
                }
            });
        }

        /**
         * 卸载掉
         * @param complete
         * @param process
         */
        public reload(complete: () => void, process: (total: number, left: number) => void = null) {
            //for (let i = 0; i < this.importScriptsList.length; i++)
            //{
            //    this.importList.push(this.importScriptsList[i].src);
            //    this.importScriptsList[i].remove();
            //}
            for (let i = document.head.childNodes.length - 1; i >= 0; i--) {
                let _node = document.head.childNodes[i];
                if (_node instanceof HTMLScriptElement) {
                    this.importList.push(_node.src);
                    _node.remove();
                }
            }
            this.preload(complete, process);
        }

        public addImportScript(path: string) {
            this.importList.push(path);
        }

        /******************************************************************/
        private static getXHR(): any {
            var xhr: any = null;
            if (window["XMLHttpRequest"]) {
                xhr = new window["XMLHttpRequest"]();
            } else {
                xhr = new ActiveXObject("MSXML2.XMLHTTP");
            }
            return xhr;
        }

        private onAllLoadComplete() {
            if (this._process)//finish
            {
                this._process(this.totaltask, 0);
            }
            if (this._complete) {
                this.importList = [];
                this._complete();
            }
        }

        private startLoadScript(e) {
            if (this._process) {
                this._process(this.totaltask, this.importList.length);
            }
            if (this.importList.length > 0) {
                var s = this.importList.shift();
                if (s.toLowerCase().indexOf(".js") >= 0) {
                    var script: HTMLScriptElement = document.createElement("script");
                    script.src = s;
                    script.onload = (e) => this.startLoadScript(e);
                    script.onerror = (e) => this.loadScriptError(e);
                    document.head.appendChild(script);
                    this.importScriptsList.push(script);
                }
                else if (s.toLowerCase().indexOf(".css") >= 0) {
                    var link: HTMLLinkElement = document.createElement("link");
                    link.rel = "stylesheet";
                    link.href = s;
                    link.onload = (e) => this.startLoadScript(e);
                    link.onerror = (e) => this.loadScriptError(e);
                    document.head.appendChild(link);
                }
            }
            else {
                //console.log(document.head);
                //console.log("all complete");
                this.onAllLoadComplete();
            }
        }

        private loadScriptError(e) {
            var error: string = "load Script Error \r\n no file:" + e.srcElement.src;
            alert(error);
            this.startLoadScript(null);
        }
    }

    export function startApp(jscode: string[] , complete:()=>void , context:any) {
        jsLoader.instance().startApp(jscode , complete , context);
    }

    ///开始加载，脚本或者css
    ///complete: () => void,完成时回掉
    ///process: (total: number, left: number) => void，加载进度变化时回掉，总数和剩余任务数量，剩余0 就是完成了
    export function preload(complete: () => void, process: (total: number, left: number) => void = null) {
        jsLoader.instance().preload(complete, process);
    }
}
