const Shops = require("../models/Shops");
const ShopifyAPI = require('shopify-node-api');
var shop = "solutionwin-apps-dev.myshopify.com";

var ShopifyHelper = {};
var Shopify = {};
Shopify.product= {};
Shopify.collection = {};
Shopify.customCollection = {};
Shopify.smartCollection = {};
Shopify.customCollection = {};
Shopify.page = {};
Shopify.blog = {};
Shopify.articles = {};
Shopify.comments = {};
const SHOPIFY_ADMIN = "/admin/api/"+process.env.SHOPIFY_API_VERSION;

function initShopify(shop) {
    return new Promise(function (resolve, reject) {
        Shops.findOne({
            shop: shop
        }, function (err, data) {
            if (err) {
                reject(err);
            } else if (data && data.access_token) {
                var shopify = new ShopifyAPI({
                    shop: shop,
                    shopify_api_key: process.env.SHOPIFY_API_KEY, // Your API key
                    access_token: data.access_token,
                    verbose: false
                });
                // console.log("shopify", shopify)
                resolve(shopify);
            } else {
                reject(`No data found for shop ${shop}`);
            }
        });
    });
}

function pageInfo(header) {
    if(typeof header === "undefined") return undefined;
    if(header === null) return undefined;
    return header.split(',').reduce(reducer, {});
}
function reducer(a, cur) {
    const pieces = cur.trim().split(';');
    var uri = pieces[0].trim().slice(1, -1);
    const rel = pieces[1].trim().slice(4);
    if (rel === '"next"') a.nextPage = uri;
    else a.previousPage = uri;
    return a;
}
Shopify.getRequest = function(url, params, callback){
    if(typeof params === "undefined") params = {};
    if(typeof params.limit === "undefined") params.limit = "250";
    if(typeof params.shop === "undefined") throw new Error("Shop parameter is required.");
    var dataList = [];
    initShopify(params.shop).then(Shopify => {
        function getReq(url){
            Shopify.get(url, function(error, products, headers){
                if(typeof products !== "undefined" && typeof products[params.type] !== "undefined"){
                    dataList = dataList.concat(products[params.type]);
                }
                try{
                    var nextPage = pageInfo(headers["link"]) ? pageInfo(headers["link"]).nextPage: undefined;
                }catch(e){console.log(e)}
                if(typeof nextPage === "undefined"){
                    if(typeof callback === "function"){
                        callback(null, dataList)
                    }
                }
                else{
                    getReq(nextPage);
                }
            });
        }
        getReq(url);
    }).catch(e => {
        console.log(e)
    });
}
Shopify.product.list = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    var url = SHOPIFY_ADMIN+'/products.json?limit='+(params.limit || "250");
    params.type = "products";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    })
}
Shopify.product.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Product id parameter is required");
    var url = SHOPIFY_ADMIN+'/products/'+params.id+'.json';
    params.type = "product";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.customCollection.list = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    var url = SHOPIFY_ADMIN+'/custom_collections.json?limit='+(params.limit || "250");
    params.type = "custom_collections";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    })
}
Shopify.customCollection.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Id parameter is required");
    var url = SHOPIFY_ADMIN+'/custom_collections/'+params.id+'.json';
    params.type = "custom_collection";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.smartCollection.list = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    var url = SHOPIFY_ADMIN+'/smart_collections.json?limit='+(params.limit || "250");
    params.type = "smart_collections";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    })
}
Shopify.smartCollection.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Id parameter is required");
    var url = SHOPIFY_ADMIN+'/smart_collections/'+params.id+'.json';
    params.type = "smart_collection";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.collection.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Id parameter is required");
    var url = SHOPIFY_ADMIN+'/collection/'+params.id+'.json';
    params.type = "collection";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.collection.products = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Id parameter is required");
    var url = SHOPIFY_ADMIN+'/collections/'+params.id+'/products.json';
    params.type = "products";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.page.list = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    var url = SHOPIFY_ADMIN+'/pages.json?limit='+(params.limit || "250");
    params.type = "pages";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    })
}
Shopify.page.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Id parameter is required");
    var url = SHOPIFY_ADMIN+'/pages/'+params.id+'.json';
    params.type = "page";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.blog.list = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    var url = SHOPIFY_ADMIN+'/blogs.json?limit='+(params.limit || "250");
    params.type = "blogs";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    })
}
Shopify.blog.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Id parameter is required");
    var url = SHOPIFY_ADMIN+'/blogs/'+params.id+'.json';
    params.type = "blog";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.articles.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.id === "undefined") throw new Error("Id parameter is required");
    var url = SHOPIFY_ADMIN+'/blogs/'+params.id+'/articles.json';
    params.type = "articles";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}
Shopify.comments.get = function(params, callback){
    if(typeof params === "undefined") throw new Error("Shop parameter is required");
    if(typeof params.blog_id === "undefined") throw new Error("Blog id parameter is required");
    if(typeof params.article_id === "undefined") throw new Error("Article id parameter is required");
    var url = SHOPIFY_ADMIN+'/comments.json?article_id'+params.article_id+'&blog_id='+params.blog_id;
    params.type = "comments";
    Shopify.getRequest(url, params, function(e,products){
        if(typeof callback === "function") callback(e,products);
    });
}

// Shopify.collection.products({shop, id: "164913774729"}, function(e,results){
//     console.log("results",results)
// });

module.exports = ShopifyHelper;
