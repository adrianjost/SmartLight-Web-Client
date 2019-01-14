var Picker = {
    colorPicker: undefined,
    initColorPicker: function(identifier, color, callback){
        options = {
            width: $(identifier).parent().width(),
            sliderMargin: 16,
            markerRadius: 10,
            color: "rgb(255, 255, 255)"
        }
        if(color){
            options.color = color;
        }
        this.colorPicker = iro.ColorPicker(identifier, options);
        this.colorPicker.on("color:change", callback);
        return this.colorPicker;
    },
    initOptionPicker: function(identifier, mode_id, callback){
        $(identifier + " label.mdl-list__item").on("change",e => {
            e.stopPropagation();
            e.preventDefault();
            // remove old selection
            $(e.currentTarget).parent("form").find("i.material-icons.active").html("radio_button_unchecked");
            $(e.currentTarget).parent("form").find("i.material-icons.active").removeClass("active");
            // set new selection
            $(e.currentTarget).find("i.material-icons").html("radio_button_checked");
            $(e.currentTarget).find("i.material-icons").addClass("active");
            callback($(`input[name=${identifier.substring(1)}]:checked`).val());
        });
        var a = $("label[for=option-" + identifier.substring(1) + "-" + mode_id + "]")
        a.find("input").attr( "checked" , true );
        a.find("i.material-icons").html("radio_button_checked");
        a.find("i.material-icons").addClass("active");
    }
}