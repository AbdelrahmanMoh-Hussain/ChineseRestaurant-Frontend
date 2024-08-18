$(
    function () {
        $("button").blur(
            function (event) {
                var screenWidth = window.innerWidth;
                console.log(screenWidth)
                if (screenWidth < 991) {
                    $("#collapsable-nav").collapse('hide');
                }
            }
        )
    }
);

(function (global) {
    var dc = {};

    var homeHtml = "snippets/home-snippet.html";
    var allCategoriesUrl =
        "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
    let mainItemUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/"
    var categoriesTitleHtml = "snippets/category-title-snippet.html";
    var itemTitleHtml = "snippets/menu-item-title.html";
    var categoryHtml = "snippets/category-snippet.html";
    var itemHtml = "snippets/menu-item.html";

    // Convenience function for inserting innerHTML for 'select'
    var insertHtml = function (selector, html) {
        var targetElem = document.getElementById(selector);
        targetElem.innerHTML = html;
    };

    let swithMenuToActive = function() {
        let classes = document.getElementById("navHomeBtn").className;
        console.log(classes);
        classes = classes.replace(new RegExp("active", "g"), "");
        document.getElementById("navHomeBtn").className = classes;

        classes = document.getElementById("navMenuBtn").className;
        if(classes.indexOf("active") == -1){
            classes += " active";
            document.getElementById("navMenuBtn").className = classes;
            
        }
    }
    // Show loading icon inside element identified by 'selector'.
    var showLoading = function (selector) {
        var html = "<div class='text-center'>";
        html += "<img src='images/Double Ring@1x-1.0s-200px-200px.gif'></div>";
        insertHtml(selector, html);
    };

    // Return substitute of '{{propName}}'
    // with propValue in given 'string'
    var insertProperty = function (string, propName, propValue) {
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace, "g"), propValue);
        return string;
    };

    // On page load (before images or CSS)
    document.addEventListener("DOMContentLoaded", function (event) {
        // On first load, show home view
        showLoading("main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function (responseText) {
                document.getElementById("main-content").innerHTML = responseText;
            },
            false
        );
    });

    // Load the menu categories view
    dc.loadMenuCategories = function () {
        showLoading("main-content");
        $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    };

    // Builds HTML for the categories page based on the data
    // from the server
    function buildAndShowCategoriesHTML(categories) {
        // Load title snippet of categories page
        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml,
            function (categoriesTitleHtml) {
                // Retrieve single category snippet
                $ajaxUtils.sendGetRequest(
                    categoryHtml,
                    function (categoryHtml) {
                        swithMenuToActive();
                        var categoriesViewHtml = buildCategoriesViewHtml(
                            categories,
                            categoriesTitleHtml,
                            categoryHtml
                        );
                        insertHtml("main-content", categoriesViewHtml);
                    },
                    false
                );
            },
            false
        );
    }

    // Using categories data and snippets html
    // build categories view HTML to be inserted into page
    function buildCategoriesViewHtml(
        categories,
        categoriesTitleHtml,
        categoryHtml
    ) {
        var finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";

        // Loop over categories
        for (var i = 0; i < categories.length; i++) {
            // Insert category values
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html, "name", name);
            html = insertProperty(html, "short_name", short_name);
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    dc.loadMenuItems = function(categoryShortName) {
        showLoading("main-content");
        let itemUrl = mainItemUrl + categoryShortName + ".json";
        $ajaxUtils.sendGetRequest(itemUrl, buildAndShowitemsHTML)
    }

    function buildAndShowitemsHTML(items) {
        $ajaxUtils.sendGetRequest(itemTitleHtml,
            function (itemTitleHtml) {
                $ajaxUtils.sendGetRequest(itemHtml,
                    function(itemHtml){
                        swithMenuToActive();
                        menuItems = buildItemsViewHtml(items, itemTitleHtml, itemHtml);
                        insertHtml("main-content", menuItems);
                    },
                    false
                );
            },
            false
        );
    }

    function buildItemsViewHtml(items, itemTitleHtml, itemHtml){
        let titleHtml = itemTitleHtml;
        console.log(items.category.name);
        titleHtml = insertProperty(titleHtml, "name", items.category.name);
        titleHtml = insertProperty(titleHtml, "category.special_instructions", items.category.special_instructions);

        let finalHtml = titleHtml;
        finalHtml += "<section class='row'>";

        let menuItems = items.menu_items;
        let categoryShortName = items.category.short_name;
        for (let i = 0; i < items.menu_items.length; i++) {
            let html = itemHtml;
            html = insertProperty(html, "item.short_name", menuItems[i].short_name);
            html = insertProperty(html, "category.short_name", categoryShortName);
            html = insertItemPrice(html, "item.price_small", menuItems[i].price_small);
            html = insertItemPrice(html, "item.price_large", menuItems[i].price_large);
            html = insertItemPortionName(html, "item.small_portion_name", menuItems[i].small_portion_name);
            html = insertItemPortionName(html, "item.large_portion_name", menuItems[i].large_portion_name);
            html = insertProperty(html, "item.name", menuItems[i].name);
            html = insertProperty(html, "item.description", menuItems[i].description);
            
            finalHtml += html;
        }

        finalHtml += "</section>";
        return finalHtml;
    }

    function insertItemPrice(html, pricePropName, pricePropValue) {
        if(!pricePropValue) {
            return insertProperty(html, pricePropName, "");
        }
        else{
            return insertProperty(html, pricePropName, "$" + pricePropValue.toFixed(2))
        }
    }
    function insertItemPortionName(html, portionPropName, portionPropValue) {
        if(!portionPropValue) {
            return insertProperty(html, portionPropName, "");
        }
        else{
            return insertProperty(html, portionPropName, "(" + portionPropValue + ")")
        }
    }

    
    global.$dc = dc;
    
})(window);