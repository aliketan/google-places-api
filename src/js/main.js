(function ($) {
    // define 'script' object and current version
    var main = {};
    main.version = '1.0.0';

    //google places api key.
    const apiKey = "YOUR_API_KEY";

    main.app = {  
        pages: {
            index: function () {
                var addressInput = $("input[name='address']");
                addressInput.geoCodePlaces({ 
                    apiKey: apiKey,
                    address:'input[name="address"]',
                    country:'select[name="country"]',
                    city:'input[name="city"]',
                    zip:'input[name="postalcode"]',
                    province:'input[name="province"]'
                });
            }
        },
        init: function(){ }
    };
    window.main = main;

})(jQuery);

$(document).ready(function () {
    var library = new Script();
    main.init();
});

function Script() {
    main.app.init();
}

main.init = function () {
    var module = this.getModul().split(',');
    for (var i = 0; i < module.length; i++) {
        this.runModule(module[i]);
    }
};

main.getModul = function () {
    var scripts = document.getElementsByTagName("BODY")[0];
    var modulePage = scripts.getAttribute("data-template");
    return modulePage;
};

main.runModule = function (module) {
    switch (module) {
        case "index":
            main.app.pages.index();
            break;
        default:
            break;
    }
}