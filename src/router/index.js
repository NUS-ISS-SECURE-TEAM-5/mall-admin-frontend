import { createRouter, createWebHistory } from "vue-router";

/* Layout */
import Layout from "../views/layout/Layout";

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  { path: "/404", component: () => import("@/views/404"), hidden: true },
  {
    path: "",
    component: Layout,
    redirect: "/home",
    alwaysShow: true,
    meta: { title: "Home", icon: "home" },
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: { title: "Dashboard", icon: "dashboard" },
      },
    ],
  },
];

export const asyncRouterMap = [
  {
    path: "/pms",
    component: Layout,
    redirect: "/pms/product",
    name: "pms",
    alwaysShow: true,
    meta: { title: "Product", icon: "product" },
    children: [
      {
        path: "product",
        name: "product",
        component: () => import("@/views/pms/product/index"),
        meta: { title: "Product-list", icon: "product-list" },
      },
      {
        path: "addProduct",
        name: "addProduct",
        component: () => import("@/views/pms/product/add"),
        meta: { title: "Product-add", icon: "product-add" },
      },
      {
        path: "updateProduct",
        name: "updateProduct",
        component: () => import("@/views/pms/product/update"),
        meta: { title: "修改商品", icon: "product-add" },
        hidden: true,
      },
      {
        path: "productCate",
        name: "productCate",
        component: () => import("@/views/pms/productCate/index"),
        meta: { title: "Product-cate", icon: "product-cate" },
      },
      {
        path: "addProductCate",
        name: "addProductCate",
        component: () => import("@/views/pms/productCate/add"),
        meta: { title: "添加商品分类" },
        hidden: true,
      },
      {
        path: "updateProductCate",
        name: "updateProductCate",
        component: () => import("@/views/pms/productCate/update"),
        meta: { title: "修改商品分类" },
        hidden: true,
      },
      {
        path: "productAttr",
        name: "productAttr",
        component: () => import("@/views/pms/productAttr/index"),
        meta: { title: "Product-attr", icon: "product-attr" },
      },
      {
        path: "productAttrList",
        name: "productAttrList",
        component: () => import("@/views/pms/productAttr/productAttrList"),
        meta: { title: "商品属性列表" },
        hidden: true,
      },
      {
        path: "addProductAttr",
        name: "addProductAttr",
        component: () => import("@/views/pms/productAttr/addProductAttr"),
        meta: { title: "添加商品属性" },
        hidden: true,
      },
      {
        path: "updateProductAttr",
        name: "updateProductAttr",
        component: () => import("@/views/pms/productAttr/updateProductAttr"),
        meta: { title: "修改商品属性" },
        hidden: true,
      },
      {
        path: "brand",
        name: "brand",
        component: () => import("@/views/pms/brand/index"),
        meta: { title: "Product-brand", icon: "product-brand" },
      },
      {
        path: "addBrand",
        name: "addBrand",
        component: () => import("@/views/pms/brand/add"),
        meta: { title: "添加品牌" },
        hidden: true,
      },
      {
        path: "updateBrand",
        name: "updateBrand",
        component: () => import("@/views/pms/brand/update"),
        meta: { title: "编辑品牌" },
        hidden: true,
      },
    ],
  },
  {
    path: "/oms",
    component: Layout,
    redirect: "/oms/order",
    name: "oms",
    alwaysShow: true,
    meta: { title: "订单", icon: "order" },
    children: [
      {
        path: "order",
        name: "order",
        component: () => import("@/views/oms/order/index"),
        meta: { title: "Order-list", icon: "product-list" },
      },
      {
        path: "orderDetail",
        name: "orderDetail",
        component: () => import("@/views/oms/order/orderDetail"),
        meta: { title: "订单详情" },
        hidden: true,
      },
      {
        path: "deliverOrderList",
        name: "deliverOrderList",
        component: () => import("@/views/oms/order/deliverOrderList"),
        meta: { title: "发货列表" },
        hidden: true,
      },
      {
        path: "orderSetting",
        name: "orderSetting",
        component: () => import("@/views/oms/order/setting"),
        meta: { title: "Order-setting", icon: "order-setting" },
      },
      {
        path: "returnApply",
        name: "returnApply",
        component: () => import("@/views/oms/apply/index"),
        meta: { title: "Order-return", icon: "order-return" },
      },
      {
        path: "returnReason",
        name: "returnReason",
        component: () => import("@/views/oms/apply/reason"),
        meta: { title: "Order-return-reason", icon: "order-return-reason" },
      },
      {
        path: "returnApplyDetail",
        name: "returnApplyDetail",
        component: () => import("@/views/oms/apply/applyDetail"),
        meta: { title: "退货原因详情" },
        hidden: true,
      },
    ],
  },
  {
    path: "/sms",
    component: Layout,
    redirect: "/sms/coupon",
    name: "sms",
    alwaysShow: true,
    meta: { title: "营销", icon: "sms" },
    children: [
      {
        path: "flash",
        name: "flash",
        component: () => import("@/views/sms/flash/index"),
        meta: { title: "Seckill-list", icon: "sms-flash" },
      },
      {
        path: "flashSession",
        name: "flashSession",
        component: () => import("@/views/sms/flash/sessionList"),
        meta: { title: "秒杀时间段列表" },
        hidden: true,
      },
      {
        path: "selectSession",
        name: "selectSession",
        component: () => import("@/views/sms/flash/selectSessionList"),
        meta: { title: "秒杀时间段选择" },
        hidden: true,
      },
      {
        path: "flashProductRelation",
        name: "flashProductRelation",
        component: () => import("@/views/sms/flash/productRelationList"),
        meta: { title: "秒杀商品列表" },
        hidden: true,
      },
      {
        path: "coupon",
        name: "coupon",
        component: () => import("@/views/sms/coupon/index"),
        meta: { title: "Coupon-list", icon: "sms-coupon" },
      },
      {
        path: "addCoupon",
        name: "addCoupon",
        component: () => import("@/views/sms/coupon/add"),
        meta: { title: "添加优惠券" },
        hidden: true,
      },
      {
        path: "updateCoupon",
        name: "updateCoupon",
        component: () => import("@/views/sms/coupon/update"),
        meta: { title: "修改优惠券" },
        hidden: true,
      },
      {
        path: "couponHistory",
        name: "couponHistory",
        component: () => import("@/views/sms/coupon/history"),
        meta: { title: "优惠券领取详情" },
        hidden: true,
      },
      {
        path: "brand",
        name: "homeBrand",
        component: () => import("@/views/sms/brand/index"),
        meta: { title: "Product-brand-recommends", icon: "product-brand" },
      },
      {
        path: "new",
        name: "homeNew",
        component: () => import("@/views/sms/new/index"),
        meta: { title: "New-product-recommends", icon: "sms-new" },
      },
      {
        path: "hot",
        name: "homeHot",
        component: () => import("@/views/sms/hot/index"),
        meta: { title: "Hot-recommends", icon: "sms-hot" },
      },
      {
        path: "subject",
        name: "homeSubject",
        component: () => import("@/views/sms/subject/index"),
        meta: { title: "Subject-recommends", icon: "sms-subject" },
      },
      {
        path: "advertise",
        name: "homeAdvertise",
        component: () => import("@/views/sms/advertise/index"),
        meta: { title: "Ad-list", icon: "sms-ad" },
      },
      {
        path: "addAdvertise",
        name: "addHomeAdvertise",
        component: () => import("@/views/sms/advertise/add"),
        meta: { title: "添加广告" },
        hidden: true,
      },
      {
        path: "updateAdvertise",
        name: "updateHomeAdvertise",
        component: () => import("@/views/sms/advertise/update"),
        meta: { title: "编辑广告" },
        hidden: true,
      },
    ],
  },
  {
    path: "/ums",
    component: Layout,
    redirect: "/ums/admin",
    name: "ums",
    alwaysShow: true,
    meta: { title: "Authorities", icon: "ums" },
    children: [
      {
        path: "admin",
        name: "admin",
        component: () => import("@/views/ums/admin/index"),
        meta: { title: "Admin-list", icon: "ums-admin" },
      },
      {
        path: "role",
        name: "role",
        component: () => import("@/views/ums/role/index"),
        meta: { title: "Admin-role", icon: "ums-role" },
      },
      {
        path: "allocMenu",
        name: "allocMenu",
        component: () => import("@/views/ums/role/allocMenu"),
        meta: { title: "分配菜单" },
        hidden: true,
      },
      {
        path: "allocResource",
        name: "allocResource",
        component: () => import("@/views/ums/role/allocResource"),
        meta: { title: "分配资源" },
        hidden: true,
      },
      {
        path: "menu",
        name: "menu",
        component: () => import("@/views/ums/menu/index"),
        meta: { title: "Menu-list", icon: "ums-menu" },
      },
      {
        path: "addMenu",
        name: "addMenu",
        component: () => import("@/views/ums/menu/add"),
        meta: { title: "添加菜单" },
        hidden: true,
      },
      {
        path: "updateMenu",
        name: "updateMenu",
        component: () => import("@/views/ums/menu/update"),
        meta: { title: "修改菜单" },
        hidden: true,
      },
      {
        path: "resource",
        name: "resource",
        component: () => import("@/views/ums/resource/index"),
        meta: { title: "Resource-list", icon: "ums-resource" },
      },
      {
        path: "resourceCategory",
        name: "resourceCategory",
        component: () => import("@/views/ums/resource/categoryList"),
        meta: { title: "资源分类" },
        hidden: true,
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/404", hidden: true },
];

const router = createRouter({
  history: createWebHistory(), // 使用 HTML5 History 模式
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap,
});

export default router;
