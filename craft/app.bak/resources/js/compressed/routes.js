/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */
(function(b){var a=Garnish.Base.extend({tokens:null,routes:null,$container:null,$addRouteBtn:null,sorter:null,init:function(){this.tokens={};this.routes=[];this.$container=b("#routes");var g=this.getRoutes();for(var f=0;f<g.length;f++){var e=new d(g[f]);this.routes.push(e)}this.sorter=new Garnish.DragSort(g,{axis:Garnish.Y_AXIS,onSortChange:b.proxy(this,"updateRouteOrder")});this.$addRouteBtn=b("#add-route-btn");this.addListener(this.$addRouteBtn,"click","addRoute")},getRoutes:function(){return this.$container.children()},updateRouteOrder:function(){var f=this.getRoutes(),g={};for(var e=0;e<f.length;e++){g["routeIds["+e+"]"]=b(f[e]).attr("data-id")}Craft.postActionRequest("routes/updateRouteOrder",g,b.proxy(function(h,j,i){if(h.success){Craft.cp.displayNotice(Craft.t("New route order saved."))}else{Craft.cp.displayError(Craft.t("Couldn’t save new route order."))}},this))},addRoute:function(){new c()}});var d=Garnish.Base.extend({$container:null,id:null,$url:null,$template:null,modal:null,init:function(e){this.$container=b(e);this.id=this.$container.attr("data-id");this.$url=this.$container.find(".url:first");this.$template=this.$container.find(".template:first");this.addListener(this.$container,"click","edit")},edit:function(){if(!this.modal){this.modal=new c(this)}else{this.modal.show()}},updateHtmlFromModal:function(){var g="";for(var f=0;f<this.modal.urlInput.elements.length;f++){var e=this.modal.urlInput.elements[f];if(this.modal.urlInput.isText(e)){g+=e.val()}else{g+=e.prop("outerHTML")}}this.$url.html(g);this.$template.html(this.modal.$templateInput.val())}});var c=Garnish.Modal.extend({route:null,$heading:null,$urlInput:null,urlElements:null,$templateInput:null,$saveBtn:null,$cancelBtn:null,$spinner:null,$deleteBtn:null,loading:false,init:function(n){this.route=n;var j="<h4>"+Craft.t("Add a token")+"</h4>";for(var e in Craft.routes.tokens){var k=Craft.routes.tokens[e];j+='<div class="token" data-name="'+e+'" data-value="'+k+'">'+e+"</div>"}var p=b('<form class="modal route-settings" accept-charset="UTF-8"><div class="header"><h1></h1></div><div class="body"><div class="field"><div class="heading"><label for="url">'+Craft.t("If the URI looks like this")+':</label></div><div id="url" class="text url"></div><div class="url-tokens">'+j+'</div></div><div class="field"><div class="heading"><label for="template">'+Craft.t("Load this template")+':</label></div><input id="template" type="text" class="text fullwidth template"></div></div><div class="footer"><div class="buttons"><input type="submit" class="btn submit" value="'+Craft.t("Save")+'"> <input type="button" class="btn cancel" value="'+Craft.t("Cancel")+'"><div class="spinner" style="display: none;"></div><a class="delete">'+Craft.t("Delete")+"</a></div></div></form>");p.appendTo(Garnish.$bod);this.$heading=p.find("h1:first");this.$urlInput=p.find(".url:first");this.$templateInput=p.find(".template:first");this.$saveBtn=p.find(".submit:first");this.$cancelBtn=p.find(".cancel:first");this.$spinner=p.find(".spinner:first");this.$deleteBtn=p.find(".delete:first");if(!this.route){this.$deleteBtn.hide()}this.urlInput=new Garnish.MixedInput(this.$urlInput);if(this.route){this.$heading.html(Craft.t("Edit Route"))}else{this.$heading.html(Craft.t("Create a new route"))}if(this.route){var m=this.route.$url.prop("childNodes");for(var h=0;h<m.length;h++){var g=m[h];if(Garnish.isTextNode(g)){var o=this.urlInput.addTextElement();o.setVal(g.nodeValue)}else{this.addUrlVar(g)}}setTimeout(b.proxy(function(){var i=this.urlInput.elements[0];this.urlInput.setFocus(i);this.urlInput.setCarotPos(i,0)},this),1);var f=this.route.$template.text();this.$templateInput.val(f)}else{setTimeout(b.proxy(function(){this.$urlInput.focus()},this),100)}this.base(p);var l=this.$container.find(".url-tokens").children("div");this.addListener(l,"mousedown",function(i){this.addUrlVar(i.currentTarget)});this.addListener(this.$container,"submit","saveRoute");this.addListener(this.$cancelBtn,"click","cancel");this.addListener(this.$deleteBtn,"click","deleteRoute")},addUrlVar:function(f){var e=b(f).clone().attr("tabindex","0");this.urlInput.addElement(e);this.addListener(e,"keydown",function(g){switch(g.keyCode){case Garnish.LEFT_KEY:setTimeout(b.proxy(function(){this.urlInput.focusPreviousElement(e)},this),1);break;case Garnish.RIGHT_KEY:setTimeout(b.proxy(function(){this.urlInput.focusNextElement(e)},this),1);break;case Garnish.DELETE_KEY:setTimeout(b.proxy(function(){this.urlInput.removeElement(e)},this),1);g.preventDefault()}})},show:function(){if(this.route){this.$heading.html(Craft.t("Edit Route"));this.$deleteBtn.show()}this.base()},saveRoute:function(g){g.preventDefault();if(this.loading){return}var h={};if(this.route){h.routeId=this.route.id}for(var f=0;f<this.urlInput.elements.length;f++){var e=this.urlInput.elements[f];if(this.urlInput.isText(e)){h["url["+f+"]"]=e.val()}else{h["url["+f+"][0]"]=e.attr("data-name");h["url["+f+"][1]"]=e.attr("data-value")}}h.template=this.$templateInput.val();this.loading=true;this.$saveBtn.addClass("active");this.$spinner.show();Craft.postActionRequest("routes/saveRoute",h,b.proxy(function(i,l,j){if(i.success){if(!this.route){var k=b('<div class="pane route" data-id="'+i.routeId+'"><div class="url"></div><div class="template"></div></div>');k.appendTo("#routes");this.route=new d(k);this.route.modal=this;Craft.routes.sorter.addItems(k);if(Craft.routes.sorter.$items.length==1){b("#noroutes").addClass("hidden")}}this.route.updateHtmlFromModal();this.hide();Craft.cp.displayNotice(Craft.t("Route saved."))}else{Craft.cp.displayError(Craft.t("Couldn’t save route."))}this.$saveBtn.removeClass("active");this.$spinner.hide();this.loading=false},this))},cancel:function(){this.hide();if(this.route){this.route.modal=null}},deleteRoute:function(){if(confirm(Craft.t(("Are you sure you want to delete this route?")))){Craft.postActionRequest("routes/deleteRoute",{routeId:this.route.id},function(){Craft.cp.displayNotice(Craft.t("Route deleted."))});Craft.routes.sorter.removeItems(this.route.$container);this.route.$container.remove();this.hide();if(Craft.routes.sorter.$items.length==0){b("#noroutes").removeClass("hidden")}}}});Craft.routes=new a()})(jQuery);