/**
 * 常用列表
 */
module gui {
    export class GListBase {
        private _itemClick: (item) => void;
        private _list: fairygui.GList;
        private _type: any;
        private _callbackThisObj: any;

        public constructor(list: fairygui.GList, pkgName: string, resName: string, type: any, itemRenderer: (index, item) => void, callbackThisObj: any) {
            fairygui.UIObjectFactory.setPackageItemExtension(fairygui.UIPackage.getItemURL(pkgName, resName), type);
            this._list = list;
            this._list.itemRenderer = itemRenderer;
            this._list.callbackThisObj = callbackThisObj;
            this._callbackThisObj = callbackThisObj;
            this._type = type;
        }

        public dispose() {
            notification.removeNotificationByObject(this);
            this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            this._list = null;
            this._type = null;
            this._itemClick = null;
        }

        /******************************************************************/
        private onItemClick(event: fairygui.ItemEvent) {
            var item: any = event.itemObject;
            this._itemClick.call(this._callbackThisObj, item);
        }

        /******************************************************************/
        set itemClick(value: (item) => void) {
            this._itemClick = value;
            if (value) {
                this._list.addEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            }
            else {
                this._list.removeEventListener(fairygui.ItemEvent.CLICK, this.onItemClick, this);
            }
        }

        set numItems(value: number) {
            this._list.numItems = value;
        }
    }

}

