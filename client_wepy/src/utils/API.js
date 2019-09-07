const ApiRootUrl = 'https://test.mingrui-gz.com/api/';

module.exports = {
    AuthLoginByWeixin: ApiRootUrl + 'login', //登录接口
    UserInfo: ApiRootUrl + 'user-info', //获取用户身份信息
    Swiper: ApiRootUrl + 'index-carousel', //轮播图数据
    HotGood: ApiRootUrl + 'goods-hot', //活动专区图片
    ShopList: ApiRootUrl + 'shop-list', //首页推荐商家
    ShopDetail: ApiRootUrl + 'shop-details', //获取店铺详情

    GetPhoneCode: ApiRootUrl + 'get-verification', //获取手机验证码
    CheckPhoneCode: ApiRootUrl + 'check-verification', //校验手机验证码

    GoodListAddress: ApiRootUrl + 'shop-goods-category', //获取包含地址信息的商品


    GoodsList: ApiRootUrl + 'goods-list', //获得商品列表
    GoodsCategory: ApiRootUrl + 'goods-category', //获得分类数据
    GoodsDetail: ApiRootUrl + 'goods-detail', //获得商品的详情
    MyShop: ApiRootUrl + 'my-shop', //我的商铺
    ShopOrder:ApiRootUrl + 'my-shop-order',//我的商铺订单
    NotifyOrder:ApiRootUrl + 'notify-order',//商家查看新的订单提醒

    WechatPay:ApiRootUrl+'pay-prepay',//使用微信支付
    Refund:ApiRootUrl +'order-refund',//商家确认退款
    OrderReceived:ApiRootUrl + 'my-shop-orderReceived',//商家确认接单
    OrderComplete:ApiRootUrl + 'my-shop-orderComplete',//商家确认订单送达
    OpenSetting:ApiRootUrl + 'my-shop-openSetting',//商家设置营业时间
    
    RefundRes:ApiRootUrl +'order-refund-res',//用户使用退款结果查询

    CartList: ApiRootUrl + 'cart-index', //获取购物车的数据
    CartAdd: ApiRootUrl + 'cart-add', // 添加商品到购物车
    CartUpdate: ApiRootUrl + 'cart-update', // 更新购物车商品数量
    CartDelete: ApiRootUrl + 'cart-delete', // 删除购物车的商品
    CartChecked: ApiRootUrl + 'cart-checked', // 选择或取消选择商品
    CartGoodsCount: ApiRootUrl + 'cart-goodscount', // 获取购物车商品件数
    CartChechedAll: ApiRootUrl + 'cart-check-all', //全选或全不选商品

    CartCheckout: ApiRootUrl + 'cart-checkout', // 下单前信息确认
    OrderSubmit: ApiRootUrl + 'order-submit', // 提交订单
    UserRefund:ApiRootUrl + 'order-user-refund',//用户申请退款
    
    OrderList: ApiRootUrl + 'order-list', // 全部订单列表

    OrderDetail: ApiRootUrl + 'order-detail', //订单详情
    OrderCancel:ApiRootUrl + 'order-cancel',//用户取消待付款订单
    SendMsg: ApiRootUrl + 'send-message', //给用户发送消息
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

    GetShopArea: ApiRootUrl + 'shop-area', //根据district返回代理点        
    AddressList: ApiRootUrl + 'address-list', //收货地址列表
    AddressDetail: ApiRootUrl + 'address/detail', //收货地址详情
    AddressSave: ApiRootUrl + 'address-save', //保存和修改收货地址
    // AddressUpdate: ApiRootUrl + 'address-update', //修改收货地址
    AddressDelete: ApiRootUrl + 'address-delete', //删除地址
    AddressSetDefault: ApiRootUrl + 'address-default', //直接设为默认地址
    RegionList: ApiRootUrl + 'region/list', //获取区域列表

    UserComment:ApiRootUrl + 'user-comment',//用户提交评论
    CommentList:ApiRootUrl + 'comment-list',//获取用户评论

    QRcode:ApiRootUrl + 'qrcode',//生成小程序码

    GroupList:ApiRootUrl+'group-list',  //团购商品列表
    GroupCarousel:ApiRootUrl+'group-carousel',  //团购商品轮播 get
    GroupDetail:ApiRootUrl+ 'group-detail',  //团购商品详情   get group_id goods_id
}