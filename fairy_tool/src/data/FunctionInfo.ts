/**
 * Created by lxz on 2017/7/13.
 */
/**
 * 方法携带数据
 */
class FunctionInfo{
    fun : __Function;
    context:any;
    args:any[];
    sleep:boolean;
    public constructor(){

    }

    dispose(){
        this.fun = null;
        this.context = null;
        this.args = null;
    }

    call(){
        if(this.sleep){
            return;
        }
        if(typeof this.fun == "string"){
            this.context[this.fun] = this.args ? this.args[0] : null;
        }else{
            this.fun.apply(this.context , this.args);
        }
    }

    onceCall(){
        this.call();
        gameTool.poolList.remove(this);
        this.dispose();
    }
}