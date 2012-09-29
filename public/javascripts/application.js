var jqxhr = $.ajax( "/application/json/" + appName )
    .done(function(data) { console.log(data) });