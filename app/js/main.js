var PR = {

    init: function(){
        // trigger random a city
        var rnd = Math.floor((Math.random() * 81) + 1);
        $('.multiselect-parent li[role="presentation"]:eq('+rnd+') a').trigger('click');
    }

};

$(window).load(PR.init);