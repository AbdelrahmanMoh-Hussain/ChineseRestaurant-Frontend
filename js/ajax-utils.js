(function(global){

    var ajaxUtils = {};

    function getRequestObject() {
        if(window.XMLHttpRequest){
            return (new XMLHttpRequest());
        }
        else {
            global.alert("Ajax is not supported");
            return (null);
        }
    }

    ajaxUtils.sendGetRequest = function (requestURL, responceHandler, isJSON) {
        var request = getRequestObject();
        request.onreadystatechange = function() {
            handleRequest(request, responceHandler, isJSON);
        }
        request.open("GET", requestURL, true);
        request.send(null);
    };

    function handleRequest(request, responceHandler, isJSON) {
        if(request.readyState == 4 && request.status == 200) {
            if(isJSON == undefined){
                isJSON = true;
            }

            if(isJSON){
                responceHandler(JSON.parse(request.responseText));
            }
            else{
                responceHandler(request.responseText);

            }
        }
    }

    global.$ajaxUtils = ajaxUtils;

})(window);