/**
 * 伪随机数工具
 * Created by wjr on 16/4/23.
 */
class RandomUtil
{
    //第十万个素数
    private static M:number = 1299689;
    /**
     * 获取一个伪随机数
     * @param seed  随机种子(固定的种子得到固定的数据)
     * @param index 最忌索引(需要第几个随机数)
     *  @param m     随机周期(必须是一个素数)
     */
    public static getRandom(seed:number, index:number, m:number=RandomUtil.M):number
    {
        var d:number = 5;//指数可以是一个任意的素数(ps:d值越大,随机分布越平均,但是过大的指数较容易导致计算值溢出)
        var random:number = (seed + Math.pow(index,d)) % m;
        return random;
    }

    /**
     * 获取一个伪随机数
     * @param seed  随机种子
     * @param index 最忌索引(需要第几个随机数)
     * @param m     随机周期(必须是一个素数)
     */
    public static getRandomRate(seed:number, index:number, m:number=RandomUtil.M):number
    {
        var random:number = RandomUtil.getRandom(seed, index, m);
        var rate:number = random/m;
        return rate;
    }

    /**
     * 获取指定数量指定范围的随机数
     * @param seed  随机种子
     * @param m     随机因子(必须是素数)
     * @param num   随机数的数量
     * @param max   随机数的最大值
     * @returns {Array<number>}
     */
    public static getRandomNum(seed:number, m:number, num:number, max:number, min:number=0, except:number=-1):Array<number>
    {
        var list:Array<number> = [];
        if(num==0)return [];
        var count:number = 0;
        var index:number = 1;
        while(true){
            // console.log("RandomUtil-getRandomNum");
            var random:number = RandomUtil.getRandom(seed, index, m);
            if(random<=max && random>=min && random!=except && list.indexOf(random)==-1){
                list.push(random);
                count++;
                // this.check(list);
            }
            index++;
            if(count==num)break;
        }

        return list;
    }

    /**
     * 获取指定数量的素数
     * @param num1 起始个数
     * @param num2 终止个数
     */
    public static getPrime(num1:number, num2:number):Array<number>
    {
        var primeList:Array<number> = [];
        var prime:number = 1;
        while(true){
            var isPrime:boolean = true;
            for(var i:number=2; i<prime; i++){
                if(prime%i==0){
                    isPrime = false;
                    break;
                }
            }
            if(isPrime)primeList.push(prime);
            prime++;
            if(primeList.length>=num2){
                return primeList.splice(num1, num2-num1);
            }
        }
    }

    public static getRandomInt(min:number, max:number):number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
