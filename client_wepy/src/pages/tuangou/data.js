import http from '../../utils/Base';
import api from '../../utils/API';


var groupList = {
    allProduct:[],//全部商品
    classify:[],//团购分类
    classifyProduct:{},//分类商品，字段name作为区分
    //数据初始化
    init:function(res){
        this.allProduct =[],
        this.classify=[],
        this.classifyProduct={},
        this.classifyProduct = res;//添加分类商品
        for(let index in res){
            this.classify.push(res[index].name);//添加分类名
            this.allProduct = this.allProduct.concat(res[index].groupInfo);//添加所有分类
        }
    },
    //获取全部团购商品
    getAll:function(){
        return this.allProduct;
    },
    //根据分类名获取分类商品
    getClassifyProduct:function(name){
        if(name == '全部团购'){
            return this.getAll();
        }
        for(let index in this.classifyProduct){
            if(this.classifyProduct[index].name == name){
                return this.classifyProduct[index].groupInfo;
            }
        }
    },
    //获取所有分类
    getClassify:function(){
        return this.classify;
    }
}
module.exports={
    groupList:groupList
}