const ApiRootUrl = 'https://test.mingrui-gz.com/api/';

module.exports = {
    AuthLoginByWeixin: ApiRootUrl + 'login', //登录接口
    Swiper:ApiRootUrl + 'index-carousel',//轮播图数据
    HotGood:ApiRootUrl + 'goods-hot',//活动专区图片
    ShopList:ApiRootUrl+ 'shop-list',//首页推荐商家
    ShopDetail:ApiRootUrl + 'shop-details',//获取店铺详情

    GetPhoneCode: ApiRootUrl+'get-verification',//获取手机验证码
    CheckPhoneCode: ApiRootUrl + 'check-verification',//校验手机验证码

    GoodListAddress:ApiRootUrl + 'shop-goods-category',//获取包含地址信息的商品


    GoodsList: ApiRootUrl + 'goods-list', //获得商品列表
    GoodsCategory: ApiRootUrl + 'goods-category', //获得分类数据
    GoodsDetail: ApiRootUrl + 'goods-detail', //获得商品的详情

    MyShop:ApiRootUrl + 'my-shop',//我的商铺

    
    CartList: ApiRootUrl + 'cart-index', //获取购物车的数据
    CartAdd: ApiRootUrl + 'cart-add', // 添加商品到购物车
    CartUpdate: ApiRootUrl + 'cart-update', // 更新购物车商品数量
    CartDelete: ApiRootUrl + 'cart-delete', // 删除购物车的商品
    CartChecked: ApiRootUrl + 'cart-checked', // 选择或取消选择商品
    CartGoodsCount: ApiRootUrl + 'cart-goodscount', // 获取购物车商品件数
    CartChechedAll: ApiRootUrl + 'cart-check-all',//全选或全不选商品
    CartCheckout: ApiRootUrl + 'cart-checkout', // 下单前信息确认
   
    OrderSubmit: ApiRootUrl + 'order-submit', // 提交订单
    OrderList: ApiRootUrl + 'order-list', // 全部订单列表
    OrderCancel:ApiRootUrl + 'order-list',//取消订单
    OrderDetail:ApiRootUrl + 'order-detail',//订单详情
    SendMsg: ApiRootUrl +'send-message',//给用户发送消息
    PayPrepayId: ApiRootUrl + 'pay/prepay', //获取微信统一下单prepay_id

    CollectList: ApiRootUrl + 'collection-list', //收藏列表
    CollectAdd: ApiRootUrl + 'collection-add', //添加或取消收藏
    CollectDelete: ApiRootUrl + 'collection-delete', //添加或取消收藏

    CommentList: ApiRootUrl + 'comment/list', //评论列表
    CommentCount: ApiRootUrl + 'comment/count', //评论总数
    CommentPost: ApiRootUrl + 'comment/post', //发表评论

    TopicList: ApiRootUrl + 'topic/list', //专题列表
    TopicDetail: ApiRootUrl + 'topic/detail', //专题详情
    TopicRelated: ApiRootUrl + 'topic/related', //相关专题

    
    SearchIndex: ApiRootUrl + 'index-search', //首页搜索
    SearchResult: ApiRootUrl + 'search/result', //搜索数据
    SearchHelper: ApiRootUrl + 'search/helper', //搜索帮助
    SearchClearHistory: ApiRootUrl + 'search/clearhistory', //搜索帮助

    GetShopArea:ApiRootUrl + 'shop-area', //根据district返回代理点        
    AddressList: ApiRootUrl + 'address-list', //收货地址列表
    AddressDetail: ApiRootUrl + 'address/detail', //收货地址详情
    AddressSave: ApiRootUrl + 'address-save', //保存和修改收货地址
   // AddressUpdate: ApiRootUrl + 'address-update', //修改收货地址
    AddressDelete: ApiRootUrl + 'address-delete', //删除地址
    AddressSetDefault: ApiRootUrl +'address-default',//直接设为默认地址
    RegionList: ApiRootUrl + 'region/list', //获取区域列表

    OrderList: ApiRootUrl + 'order-list', //获得订单列表
    OrderDetail: ApiRootUrl + 'order/detail', //订单详情
    OrderCancel: ApiRootUrl + 'order/cancel', //取消订单
    OrderExpress: ApiRootUrl + 'order/express', //物流详情

    FootprintList: ApiRootUrl + 'footprint/list', //足迹列表
    FootprintDelete: ApiRootUrl + 'footprint/delete', //删除足迹
}