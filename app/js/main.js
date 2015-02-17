var PR = {

    init: function(){

        // trigger Istanbul
        $('.multiselect-parent li[role="presentation"]:eq(39) a').trigger('click');

    }

};

$(window).load(function(){
    PR.init();
});