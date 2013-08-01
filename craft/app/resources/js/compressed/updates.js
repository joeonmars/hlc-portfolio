/*!
 * Craft by Pixel & Tonic
 *
 * @package   Craft
 * @author    Pixel & Tonic, Inc.
 * @copyright Copyright (c) 2013, Pixel & Tonic, Inc.
 * @license   http://buildwithcraft.com/license Craft License Agreement
 * @link      http://buildwithcraft.com
 */
(function(a){Craft.postActionRequest("update/getAvailableUpdates",function(b){var c=a("#loading");c.fadeOut("fast",function(){c.remove();if(!b.errors&&b.error){b.errors=[b.error]}if(b.errors&&b.errors.length>0){a("<div/>").appendTo(Craft.cp.$content).html(b.errors[0]);return}var k=function(w,F){for(var y=0;y<w.length;y++){a("<hr/>").appendTo(Craft.cp.$content);var E=w[y],G=F+" "+E.version;if(E.build){G+=' <span class="light">'+Craft.t("build {build}",{build:E.build})+"</span>"}if(E.critical){G+=' <span class="critical">'+Craft.t("Critical")+"</span>"}a("<h3>"+G+"</h3>").appendTo(Craft.cp.$content);var z=a("<ul/>").appendTo(Craft.cp.$content);var B=E.notes.split(/[\r\n]+/);for(var x=0;x<B.length;x++){var D=B[x],A=D.match(/\[(\w+)\]\s*(.+)/),C=a("<li/>").appendTo(z);if(A){C.addClass(A[1].toLowerCase()).html(A[2])}else{C.html(D)}}}};if(b.app&&b.app.releases&&b.app.releases.length){var n=function(){var w=b.app.manualDownloadEndpoint;a("<iframe/>",{src:w}).appendTo(Garnish.$bod).hide()};var p=function(){window.location.href=Craft.getUrl("updates/go/craft")};var r=a("<h2>"+Craft.t("You’ve got updates!")+"</h2>").appendTo(Craft.cp.$content),o=a('<div class="buttons"/>').appendTo(Craft.cp.$content);a('<div class="clear"/>').appendTo(Craft.cp.$content);if(b.app.manualUpdateRequired){var m=a('<div class="btn submit">'+Craft.t("Download")+"</div>").appendTo(o)}else{var l=a('<div class="btngroup"/>').appendTo(o),e=a('<div class="btn submit">'+Craft.t("Update")+"</div>").appendTo(l),g=a('<div class="btn submit menubtn"/>').appendTo(l),h=a('<div class="menu" data-align="right"/>').appendTo(l),q=a("<ul/>").appendTo(h),t=a("<li/>").appendTo(q),m=a("<a>"+Craft.t("Download")+"</a>").appendTo(t);new Garnish.MenuBtn(g)}if(b.app.licenseUpdated){var f,j,s,v,u,i;var d=function(w){w.stopPropagation();if(!f){j=a("<form><p>"+Craft.t('Craft’s <a href="http://buildwithcraft.com/license" target="_blank">Terms and Conditions</a> have changed.')+"</p></form>");v=a("<label> "+Craft.t("I agree.")+" &nbsp;</label>").appendTo(j);u=a('<input type="checkbox"/>').prependTo(v);s=a('<input class="btn submit" type="submit"/>').appendTo(j);f=new Garnish.HUD(w.currentTarget,j,{hudClass:"hud",triggerSpacing:20,tipWidth:30});j.on("submit",function(x){x.preventDefault();if(u.prop("checked")){i();f.hide();u.prop("checked",false)}else{Garnish.shake(f.$hud)}})}else{f.$trigger=a(w.currentTarget);f.show()}if(w.currentTarget==m[0]){s.attr("value",Craft.t("Seriously, download."));i=n}else{s.attr("value",Craft.t("Seriously, update."));i=p}};m.on("click",d);if(typeof e!="undefined"){e.on("click",d)}}else{m.on("click",n);if(typeof e!="undefined"){e.on("click",p)}}k(b.app.releases,"Craft")}else{a('<p id="no-system-updates">'+Craft.t("No system updates are available.")+"</p>").appendTo(Craft.cp.$content)}a("#updates").fadeIn("fast")})})})(jQuery);