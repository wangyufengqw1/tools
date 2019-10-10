/**
 * Created by lxz on 2017/10/30.
 */
module gui {
    /**
     * 控制台
     */
    export class ConsoleList {
        private _list: GListBase;
        private _texts: string[];
        private _oList:fairygui.GList;

        public constructor(list: fairygui.GList, pkgName: string, resName: string) {
            this._oList = list;
            this._list = new GListBase(list, pkgName, resName, ConsoleItem, this.itemRenderer, this);
            this.clear();
        }

        addText(str: string) {
            this._texts.push(str);
            this._list.numItems = this._texts.length;
            this._oList.scrollToView(this._texts.length - 1);
        }

        clear() {
            this._texts = [];
            this._list.numItems = this._texts.length;
        }

        /******************************************************************/
        private itemRenderer(index, item) {
            item.setListIndex(index, this._texts[index]);
        }
    }
    export class ConsoleItem extends fairygui.GComponent {
        private _listIndex: number;

        public constructor() {
            super();
        }

        dispose(): void {
            super.dispose();
        }

        constructFromResource(): void {
            super.constructFromResource();
        }

        setListIndex(index, text): void {
            this._listIndex = index;
            this.getChild("text").text = text;
        }
    }
}