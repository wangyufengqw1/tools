/**
 * Created by lxz on 2017/11/18.
 */
module gui {
    import GComponent = fairygui.GComponent;
    export class BindProperty {
        private _keys: { [key: string]: string[] };

        public constructor() {
            this._keys = {};
        }

        bindGuiProperty(context: any, com: GComponent) {
            let len = com.numChildren;
            let id = gameTool.getTypeId(context);
            if (this._keys[id] == null) {
                this._keys[id] = [];
            }
            for (let i = 0; i < len; i++) {
                let obj = com.getChildAt(i);
                let key = obj.name;
                if (definiton.hasProperty(context , key)) { //对象已拥有该属性
                    continue;
                }
                if (key.match(/^n[0-9]+$/g)) { //默认名字不予设置(免得设置太多属性)
                    continue;
                }
                // if (key.indexOf("text") > -1 || key.indexOf("btn") > -1) { //按钮与文本不予设置(免得设置太多属性)
                //     continue;
                // }
                context[key] = obj;
                this._keys[id].push(key);
            }
        }

        removeBindGuiProperty(context: any) {
            let id = gameTool.getTypeId(context);
            if (this._keys[id]) {
                let len = this._keys[id].length;
                for (let i = 0; i < len; i++) {
                    context[this._keys[id][i]] = null;
                    delete context[this._keys[id][i]];
                }
                this._keys[id] = null;
                delete this._keys[id];
            }
        }
    }

    export function bindGuiProperty(context: any, com: GComponent) {
        gameTool.singleton(BindProperty).bindGuiProperty(context, com);
    }

    export function removeBindGuiProperty(context: any) {
        gameTool.singleton(BindProperty).removeBindGuiProperty(context);
    }
}