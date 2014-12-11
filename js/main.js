function hideAndDestroy(what) {
    what.fadeOut("slow", function(){
        what.remove();
    });
}

function hideEverything() {
    hideAndDestroy($("#overlay"));

    $("#info-button, #lang-switcher").fadeOut();
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

$(document).ready(function() {

	
    var currentFontSize = $('html').css('font-size');
    var currentFontSizeNum = parseFloat(currentFontSize, 10);

    function setFontSize() {
        var windowWidth = $(window).width();
        $('html').css('font-size', Math.round(currentFontSizeNum*windowWidth/1500)+"px");
    }

    setFontSize();

    $(window).resize(function() {
    	setFontSize();
    });



    function hideAllCaptionsExcept(classException){
        $("#overlay .caption").each(function(){

            $(this).children().each(function(){

                if (!$(this).hasClass(classException)) {
                    $(this).hide();
                } else {
                    $(this).show();
                }
            });
        });
    }

    switcherButtons = $("#lang-switcher li");

    function setButtonActive(button) {
        switcherButtons.removeClass("active");
        button.addClass("active");
    }

    switcherButtons.each(function(){
       var theClass = $(this).attr("class");
       theClass = theClass.replace('switcher-','');

       $(this).click(function(){
           hideAllCaptionsExcept(theClass);
           setButtonActive($(this));
       });
    });


    // activate english first

    hideAllCaptionsExcept("lang-en");
    setButtonActive($(".lang-switcher-en"));


    // setup info button

    $("#info-button")
        .click(function(){
            $("#lang-switcher, #overlay .caption").toggle();
            $("#info-button").toggleClass("active");
        })
        .hide();

    $("#lang-switcher, #overlay .caption").hide();

    //setup slides
//    $('.slide').equalHeights();
    setTimeout( function () { $('.slide').equalHeights(); }, 2000 );

    $(".slide").each(function(){
        var headline = $(this).find("h1").first().clone();
        headline.appendTo($(this));
        console.log(headline);


        $(this).click(function(){
            var myid = makeid();

            var clone = $(this).find("video").clone();
            var caption = $(this).find(".caption").clone();

            $("body").append('<div id="overlay"></div>');

            $("#overlay").hide().css({
               "height": $(window).height()+1,
               "width": $(window).width()
            });

            clone.appendTo( "#overlay" );
            caption.appendTo( "#overlay" );
            $("#overlay .caption").hide();

            $("#overlay video").attr('id', myid);

            videojs(myid, {}, function(){
                // Player (this) is initialized and ready.
                playerFallbackOrder: ["flash", "html5", "links"]
            });

            videojs(myid).ready(function(){
                var myPlayer = this;
                myPlayer.play();
                myPlayer.on("ended", function(){
                    hideEverything();
                });
            });

            $("#overlay").append('<div id="close">×</div>');
            $("#close").click(function(){
                hideEverything();
            });

            hideAllCaptionsExcept("lang-en");

            $("#overlay").fadeIn("slow");
            $("#info-button").fadeIn("slow");
        });
    });

	$('img').on('dragstart', function(event) { event.preventDefault(); });

});