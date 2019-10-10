/**
 * Created by lxz on 2017/12/20.
 */
module gameTool{
    /**
     * 等先嵌入<script src="clipboard.min.js"></script>
     */
   class CopyUtil{
       private _element:HTMLButtonElement;
       public constructor(){
           this._element = document.createElement("button");
           this._element.setAttribute("style", "visibility: hidden");
           document.body.appendChild(this._element);
           let data = document.createElement("h1");
           data.setAttribute("id", "copy_data");
           data.setAttribute("value", "");
           document.body.appendChild(data);
           eval("var clipboard = new Clipboard(this._element, {text: function() {return document.getElementById('copy_data').getAttribute('value');}}); \nclipboard.on('success', function(e) {console.log('success' + e);});\nclipboard.on('error', function(e) {console.log(e);});")
       }

       copy(str:string){
           this._element.focus();
           document.getElementById("copy_data").setAttribute("value", str);
           this._element.click();
       }

   }

   export class Download{
       private _element:HTMLAnchorElement;
       public constructor(){
           this._element = document.createElement("a");
           this._element.setAttribute("style", "visibility: hidden");
           document.body.appendChild(this._element);
       }
       download(href:string , name?:string){
           this._element.setAttribute("href", href);
           if(name){
               this._element.setAttribute("download", name);
           }
           this._element.click();
       }
   }

   export function copy(str:string){
        gameTool.singleton(CopyUtil).copy(str);
   }
    export function download(href:string , name?:string){
        gameTool.singleton(Download).download(href , name);
    }
}