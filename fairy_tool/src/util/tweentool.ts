/**
 * Created by lxz on 2017/11/2.
 */
module twwentool {
    /**
     * 数字滚动
     * @param textfiled
     * @param startValue
     * @param endValue
     * @param time
     * @returns {Tween}
     */
    export function playNum(textfiled: any, endValue: number, time: number = 300, startValue?: number): egret.Tween {
        //这里演示了一个数字变化的过程
        if(isNaN(startValue)){
            startValue = parseInt(textfiled.text);
        }else{
            textfiled.text = startValue.toString();
        }
        let tweeObject = {value: startValue};
        var vars: any = {
            onChange: function (): void {
                textfiled.text = "" + Math.floor(tweeObject.value);
            },
            onChangeObj: this
        };
        return egret.Tween.get(tweeObject, vars).to({value: endValue}, time);
    }
}