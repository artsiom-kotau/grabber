(function(a){a.fn.noUiSlider=function(b,c){function e(a){var b=new Array;if(a.find(".noUi_handle.noUi_lowerHandle").length){b[0]=parseInt(a.find(".noUi_handle.noUi_lowerHandle").css("left"));if(isNaN(b[0])){b[0]=0}}else{b[0]=0}if(a.find(".noUi_handle.noUi_upperHandle").length){b[1]=parseInt(a.css("width"))-parseInt(a.find(".noUi_handle.noUi_upperHandle").css("left"));if(isNaN(b[1])){b[1]="100%"}}else{b[1]=0}a.find(".noUi_midBar").css({left:b[0],right:b[1]})}function f(a,b,c,d){var e=parseInt(a.css("width"));var f=parseInt(c.css("width"));if(!d){d=[0,100]}return e/(d[1]-d[0])*(parseFloat(b)-d[0])-f/2}function g(a,b,c){var d=parseInt(a.css("width"));var e=parseInt(b.css("width"));if(!c){c=[0,100]}var f=b.css("left");if(f=="auto"){f=0}var g=parseInt(f)+e/2;g=g/(d/(c[1]-c[0]));g=g+c[0];return g}var d={bar:true,dontActivate:"",scale:"",startMin:"25",startMax:"75",point:"",saveScale:false,moveStyle:"",setTo:"",change:"",callback:"",knobRelease:"",tracker:"",clickmove:""};var h={init:function(){var g=a('<style title="tempNoUiSlider">.temp-show{position:absolute !important; visibility:hidden !important; display:block !important;}.autoWidth{width:auto !important;}</style>');a("html > head").append(g);return this.each(function(){if(!d.knobRelease&&d.callBack){d.knobRelease=d.callBack}var b=a(this);if(!b.is(":visible")&&b.css("width").indexOf("%")!=-1){a.error("Placing a percentage sized slider in a hidden element will cause trouble!")}var g=parseInt(b.css("width"));a.event.props=a.event.props.join("|").replace("layerX|layerY|","").split("|");a(this).css("position","relative");if(d.dontActivate.toLowerCase()!="lower"){a(this).append('<div class="noUi_handle noUi_lowerHandle"><div class="noUi_sliderKnob"></div></div>')}if(d.bar&&d.bar!="off"){a(this).append('<div class="noUi_midBar"></div>')}if(d.dontActivate.toLowerCase()!="upper"){a(this).append('<div class="noUi_handle noUi_upperHandle"><div class="noUi_sliderKnob"></div></div>')}a(this).data("activated",[b.find(".noUi_handle.noUi_lowerHandle").length,b.find(".noUi_handle.noUi_upperHandle").length]);a(this).children().css("position","absolute");a(this).data("change",c.change);a(this).find(".noUi_midBar").css({left:0,right:0});if(d.scale){a(this).data("scale",d.scale)}var h=a(this).find(".noUi_sliderKnob");h.each(function(){var c=a(this).parent(".noUi_handle");if(c.hasClass("noUi_lowerHandle")&&(d.startMin||d.startMin===0)){if(typeof d.startMin=="string"&&d.startMin.indexOf("%")!=-1){c.css("left",f(b,d.startMin,c))}else{c.css("left",f(b,d.startMin,c,d.scale))}}if(c.hasClass("noUi_upperHandle")&&d.startMax){if(typeof d.startMax=="string"&&d.startMax.indexOf("%")!=-1){c.css("left",f(b,d.startMax,c))}else{c.css("left",f(b,d.startMax,c,d.scale))}}});if(d.bar&&d.bar!="off"){e(b)}h.bind("mousedown.noUiSlider",function(f){f.preventDefault();a("body").bind("selectstart.noUiSlider",function(a){return false});a(this).addClass("noUi_activeHandle");var i=a(this).parent(".noUi_handle");var j=b.data("activated")[0]&&b.data("activated")[1];a(document).bind("mousemove.noUiSlider",function(a){var f=parseInt(i.css("width"));var h=a.pageX-b.offset().left;if(i.hasClass("noUi_lowerHandle")||!j){if(h<-1*(parseInt(i.css("width"))/2)){h=-1*(parseInt(i.css("width"))/2)}if(j){var k=parseInt(i.parent().find(".noUi_upperHandle").css("left"))-f;if(h>k){h=k}}}if(i.hasClass("noUi_upperHandle")||!j){g=parseInt(b.css("width"));var l=g-f/2;if(h>l){h=l}if(j){var k=parseInt(i.parent().find(".noUi_lowerHandle").css("left"))+f;if(h<k){h=k}}}i.css({left:h});if(d.bar&&d.bar!="off"){e(b)}if(typeof c.tracker=="function"){c.tracker.call(this)}});a(document).bind("mouseup.noUiSlider",function(){a(this).unbind("mousemove.noUiSlider");h.removeClass("noUi_activeHandle");a("body").unbind("selectstart.noUiSlider");if(typeof c.knobRelease=="function"){c.knobRelease.call(b)}if(typeof c.change=="function"){c.change.call(b)}a(this).unbind("mouseup.noUiSlider")})});a(this).bind("click.noUiSlider",function(f){console.log("click");var g=f.pageX;var h=a(this).offset().left;if(a(this).data("activated")[0]&&a(this).data("activated")[1]){var i=a(this).children(".noUi_lowerHandle").offset().left;var j=a(this).children(".noUi_upperHandle").offset().left;var k=(i+j)/2;if(g>k){a(this).children(".noUi_upperHandle").css("left",g-h)}else{a(this).children(".noUi_lowerHandle").css("left",g-h)}}else{if(a(this).data("activated")[0]){a(this).children(".noUi_lowerHandle").css("left",g-h)}if(a(this).data("activated")[1]){a(this).children(".noUi_upperHandle").css("left",g-h)}}if(d.bar&&d.bar!="off"){e(b)}if(typeof c.clickmove=="function"){c.clickmove.call(this)}if(typeof c.change=="function"){c.change.call(this)}f.stopPropagation()}).children().not(".noUi_midBar").click(function(a){return false})})},move:function(){var c=a(this);var g=false;if(!d.point){if(a(this).data("activated")[0]&&a(this).data("activated")[1]){g=true}else{if(a(this).data("activated")[0]){d.point=0}if(a(this).data("activated")[1]){d.point=1}}}if(d.saveScale){a(this).data("scale",d.scale)}if(!d.scale){if(!a(this).data("scale")){d.scale=[0,100]}else{d.scale=a(this).data("scale")}}if(typeof d.setTo!="object"){if(d.point=="lower"||d.point==0){d.setTo=[d.setTo,0]}if(d.point=="upper"||d.point==1){d.setTo=[0,d.setTo]}}if(d.point=="lower"||d.point==0||g){var h=a(this).find(".noUi_lowerHandle");var i=f(c,d.setTo[0],h,d.scale);if(d.moveStyle=="animate"){h.animate({left:i},{step:function(){if(d.bar&&d.bar!="off"){e(c)}}})}else{h.css("left",i)}}if(d.point=="upper"||d.point==1||g){var j=a(this).find(".noUi_upperHandle");var k=f(c,d.setTo[1],j,d.scale);if(d.moveStyle=="animate"){j.animate({left:k},{step:function(){if(d.bar&&d.bar!="off"){e(c)}}})}else{j.css("left",k)}}var l=a(this).data("change");if(d.bar&&d.bar!="off"){e(c)}if(typeof l=="function"){l.call(this)}},reset:function(){},getValue:function(){if(!d.point){d.point="array"}if(!d.scale){if(a(this).data("scale")=="undefined"){d.scale=[0,100]}else{d.scale=a(this).data("scale")}}returnA=new Array;if(a(this).data("activated")[0]){returnA.push(g(a(this),a(this).find(".noUi_lowerHandle"),d.scale))}if(a(this).data("activated")[1]){returnA.push(g(a(this),a(this).find(".noUi_upperHandle"),d.scale))}if(d.point=="lower"||d.point==0){return returnA[0]}if(d.point=="upper"||d.point==1){return returnA[1]}if(d.point=="array"){return returnA}}};var c=a.extend(d,c);if(h[b]){return h[b].apply(this,Array.prototype.slice.call(arguments,1))}else if(typeof b==="object"||!b){return h.init.apply(this,arguments)}else{a.error("Method "+b+" does not exist on jQuery.noUiSlider")}}})(jQuery)