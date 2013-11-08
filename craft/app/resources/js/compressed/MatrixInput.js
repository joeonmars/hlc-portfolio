/*
 Copyright (c) 2013, Pixel & Tonic, Inc.
 @license   http://buildwithcraft.com/license Craft License Agreement
 @link      http://buildwithcraft.com
*/
(function(d){Craft.MatrixInput=Garnish.Base.extend({id:null,blockTypes:null,blockTypesByHandle:null,inputNamePrefix:null,inputIdPrefix:null,$container:null,$blockContainer:null,$newBlockBtnContainer:null,$newBlockBtnGroup:null,$newBlockBtnGroupBtns:null,blockSort:null,totalNewBlocks:0,init:function(a,b,c){this.id=a;this.blockTypes=b;this.inputNamePrefix=c;this.inputIdPrefix=Craft.formatInputId(this.inputNamePrefix);this.$container=d("#"+this.id);this.$blockContainer=this.$container.children(".blocks");
this.$newBlockBtnContainer=this.$container.children(".buttons");this.$newBlockBtnGroup=this.$newBlockBtnContainer.children(".btngroup");this.$newBlockBtnGroupBtns=this.$newBlockBtnGroup.children(".btn");this.$newBlockMenuBtn=this.$newBlockBtnContainer.children(".menubtn");this.setNewBlockBtn();this.blockTypesByHandle={};for(b=0;b<this.blockTypes.length;b++)a=this.blockTypes[b],this.blockTypesByHandle[a.handle]=a;c=this.$blockContainer.children();this.blockSort=new Garnish.DragSort(c,{caboose:"<div/>",
handle:"> .actions > .move",axis:"y",helperOpacity:0.9});for(b=0;b<c.length;b++){var e=d(c[b]);a=e.data("id");(a="string"==typeof a&&a.match(/new(\d+)/))&&a[1]>this.totalNewBlocks&&(this.totalNewBlocks=parseInt(a[1]));new h(this,e)}this.addListener(this.$newBlockBtnGroupBtns,"click",function(a){a=d(a.target).data("type");this.addBlock(a)});new Garnish.MenuBtn(this.$newBlockMenuBtn,{onOptionSelect:d.proxy(function(a){a=d(a).data("type");this.addBlock(a)},this)});this.addListener(Garnish.$win,"resize",
"setNewBlockBtn")},setNewBlockBtn:function(){this.$newBlockBtnGroup.removeClass("hidden").width()>this.$container.width()?(this.$newBlockBtnGroup.addClass("hidden"),this.$newBlockMenuBtn.removeClass("hidden")):(this.$newBlockBtnGroup.removeClass("hidden"),this.$newBlockMenuBtn.addClass("hidden"))},addBlock:function(a,b){this.totalNewBlocks++;for(var c="new"+this.totalNewBlocks,e='<div class="matrixblock" data-id="'+c+'"><input type="hidden" name="'+this.inputNamePrefix+"["+c+'][type]" value="'+a+
'"/><div class="actions"><a class="settings icon menubtn" title="'+Craft.t("Actions")+'" role="button"></a> <div class="menu"><ul>',g=0;g<this.blockTypes.length;g++)var k=this.blockTypes[g],e=e+('<li><a data-action="add" data-type="'+k.handle+'">'+Craft.t("Add {type} above",{type:k.name})+"</a></li>");var e=e+('</ul><hr/><ul><li><a data-action="delete">'+Craft.t("Delete")+'</a></li></ul></div><a class="move icon" title="'+Craft.t("Reorder")+'" role="button"></a> </div></div>'),f=d(e);b?f.insertBefore(b):
f.appendTo(this.$blockContainer);var l=d('<div class="fields"/>').appendTo(f),e=this.getParsedBlockHtml(this.blockTypesByHandle[a].bodyHtml,c),m=this.getParsedBlockHtml(this.blockTypesByHandle[a].footHtml,c);d(e).appendTo(l);c=f.is(":last-child")?20:0;f.css(this.getHiddenBlockCss(f)).animate({opacity:1,marginBottom:c},"fast",d.proxy(function(){f.css("margin-bottom","");d("body").append(m);Craft.initUiElements(l);new h(this,f);this.blockSort.addItems(f)},this))},getHiddenBlockCss:function(a){var b=
-a.outerHeight();a.is(":only-child")?b-=16:a.is(":last-child")&&(b+=16);return{opacity:0,marginBottom:b}},getParsedBlockHtml:function(a,b){return"string"==typeof a?a.replace(/__BLOCK__/g,b):""}});var h=Garnish.Base.extend({matrix:null,$block:null,init:function(a,b){this.matrix=a;this.$block=b;var c=this.$block.find("> .actions > .settings");(new Garnish.MenuBtn(c)).menu.settings.onOptionSelect=d.proxy(this,"onMenuOptionSelect")},onMenuOptionSelect:function(a){a=d(a);"add"==a.data("action")?(a=a.data("type"),
this.matrix.addBlock(a,this.$block)):this.selfDestruct()},selfDestruct:function(){this.$block.animate(this.matrix.getHiddenBlockCss(this.$block),"fast",d.proxy(function(){this.$block.remove()},this))}})})(jQuery);

//# sourceMappingURL=MatrixInput.min.map
