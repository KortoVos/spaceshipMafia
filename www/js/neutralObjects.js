function neutralObject(nObject, $arena){
	this.id = nObject.id;
	this.type = nObject.type;
	this.$arena = $arena;
	this.x = nObject.x;
	this.y = nObject.y;

	this.w = nObject.w;
	this.h = nObject.h;

	this.baseAngle = nObject.baseAngle;

	this.materialize();
}

neutralObject.prototype = {

	materialize: function(){
		this.$arena.append('<div id="' + this.id + '" class="neutralObjects ' + this.type + '"></div>');
		this.$body = $('#' + this.id);

		this.$body.css('width', this.w);
		this.$body.css('height', this.h);

		if(localTank != undefined){
			this.$body.css('left',this.x - localTank.x  + WIDTH/2 + 'px');
			this.$body.css('top', this.y - localTank.y  + HEIGHT/2 +'px');
		}
		this.$body.css('-webkit-transform', 'rotateZ(' + this.baseAngle + 'deg)');
		this.$body.css('-moz-transform', 'rotateZ(' + this.baseAngle + 'deg)');
		this.$body.css('-o-transform', 'rotateZ(' + this.baseAngle + 'deg)');
		this.$body.css('transform', 'rotateZ(' + this.baseAngle + 'deg)');
	},

	explode: function(){
		this.$arena.append('<div id="expl' + this.id + '" class="ball-explosion" style="left:' + this.x + 'px"></div>');
		var $expl = $('#expl' + this.id);
		if(localTank != undefined){
			$expl.css('left',this.x - localTank.x  + WIDTH/2 + 'px');
			$expl.css('top', this.y - localTank.y  + HEIGHT/2 +'px');
		}

		setTimeout( function(){
			$expl.addClass('expand');
		}, 1);
		setTimeout( function(){
			$expl.remove();
		}, 1000);
	}

}