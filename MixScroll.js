function eid(id) {
    return document.getElementById(id);
}

function eclass(className) {
    return document.getElementsByClassName(className);
}

function addClass(obj, className) {
	if (obj.className.indexOf(className) < 0) {
		obj.className += ' ' + className;
	}
}

function rmClass(obj, className) {
	obj.className = obj.className.replace(className, '');
}

function MixScroll(options) {
	this.options 				= options || {};
	this.options.scrollingSpeed = this.options.scrollingSpeed || 1000;
	this.options.easing 		= this.options.easing || '';
	this.options.minWidth		= this.options.minWidth || 600; 
	
	this.cssString 				= "all " + (this.options.scrollingSpeed / 1000) + "s " + this.options.easing;
	
	this.anchors				= {};
	
	this.width 					= window.innerWidth;
	this.height 				= window.innerHeight;

	this.container 				= eid('dmdContainer');

	this.pages 					= eclass('section');
	this.pagesLeft 				= eclass('left');
	this.pagesRight 			= eclass('right');
	this.pagesUp 				= eclass('up');
	this.pagesDown 				= eclass('down');

	this.curPage 				= 0;
	this.wheelStatus 			= true;

	var hashidx 	= 0;
	var touchY 		= 0;
	var self 		= this;

	document.body.style.width = this.width + 'px';
	document.body.style.height = this.height + 'px';

	this.init();

	//events
	this.container.onmousewheel = function(e) {
		e.preventDefault();

		if(!self.wheelStatus) return;
		self.wheelStatus = false;

		var dir;

		if(e.deltaY > 0 || e.wheelDelta < 0) {
			dir = 1;
			hashidx++;
		} else if(e.deltaY < 0 || e.wheelDelta > 0) {
			dir = -1;
			hashidx--;
		}

		self.doScroll(dir);
	};
	this.container.onwheel = this.container.onmousewheel;
	
	
	this.container.addEventListener('touchstart', function(e) {
		e.preventDefault();
		
		touchY = e.touches[0].clientY;
	});

	this.container.addEventListener('touchmove', function(e) {
		e.preventDefault();

		if(!self.wheelStatus) return;
		self.wheelStatus = false;

		var dir;

		if (touchY < e.touches[0].clientY) {
			dir = -1;
		} else if (touchY > e.touches[0].clientY) {
			dir = 1;
		}

		self.doScroll(dir);
	});

	window.onresize = function(e) {
    	self.width = window.innerWidth;
		self.height = window.innerHeight;

		document.body.style.width = self.width + 'px';
		document.body.style.height = self.height + 'px';

		for(var i = 0; i < self.pages.length; i++) {
			var item = self.pages[i];

			item.style.top = ((i - self.curPage) * self.height) + 'px';

			for(var j=0; j<item.pagesLeft.length; j++) {
				var iLeft = item.pagesLeft[j];
				var iRight = item.pagesRight[j];

				if(self.width < self.options.minWidth) {
					addClass(iLeft, 'force');
					addClass(iRight, 'force');
					iLeft.style.top = (((j - item.curPageLeft) * 2) * self.height) + 'px';
					iRight.style.top = (((j - item.curPageLeft)* 2 + 1) * self.height) + 'px';
				} else {
					rmClass(iLeft, 'force');
					rmClass(iRight, 'force');
					iLeft.style.top = ((j - item.curPageLeft) * self.height) + 'px';
					iRight.style.top = (((j - item.curPageLeft)*-1) * self.height) + 'px';
				}
			}

			for(var j=0; j<item.pagesUp.length; j++) {
				var iUp = item.pagesUp[j];
				var iDown = item.pagesDown[j];

				if(self.width < self.options.minWidth) {
					addClass(iUp, 'force');
					addClass(iDown, 'force');
					iUp.style.left = (((j - item.curPageUp) * 2) * self.width) + 'px';
					iDown.style.left = (((j - item.curPageUp) * 2 + 1) * self.width) + 'px';
				} else {
					rmClass(iUp, 'force');
					rmClass(iDown, 'force');
					iUp.style.left = ((j - item.curPageUp) * self.width) + 'px';
					iDown.style.left = (((j - item.curPageUp)*-1) * self.width) + 'px';
				}
			}

		}
	};

	//on location hash change
	var lastHash = document.location.hash;
	setInterval(function() {
		if(lastHash !== document.location.hash) {
			lastHash = document.location.hash;

			if(self.anchors[lastHash.substr(1)] == null) return;

			self.curPage = self.anchors[lastHash.substr(1)].curPage;

			for(var i=0; i<self.pages.length; i++) {
				var item = self.pages[i];

				item.style.top = ((i - self.curPage) * self.height) + 'px';

				var j;
				if(i < self.curPage) {
					item.curPageLeft = item.pagesLeft.length - 1; 
				} else if(i === self.curPage && self.anchors[lastHash.substr(1)].leftCurPage) {
					item.curPageLeft = self.anchors[lastHash.substr(1)].leftCurPage;
				} else {
					item.curPageLeft = 0;
				}

				for(j=0; j<item.pagesLeft.length; j++) {
					var iLeft = item.pagesLeft[j];
					var iRight = item.pagesRight[j];

					iLeft.style.top = ((j - item.curPageLeft) * self.height) + 'px';
					iRight.style.top = (((j - item.curPageLeft)*-1) * self.height) + 'px';
				}

				if(i < self.curPage) {
					item.curPageUp = item.pagesUp.length - 1; 
				} else if(i === self.curPage && self.anchors[lastHash.substr(1)].upCurPage) {
					item.curPageUp = self.anchors[lastHash.substr(1)].upCurPage;
				} else {
					item.curPageUp = 0;
				}

				for(j=0; j<item.pagesUp.length; j++) {
					var iUp = item.pagesUp[j];
					var iDown = item.pagesDown[j];

					iUp.style.left = ((j - item.curPageUp) * self.width) + 'px';
					iDown.style.left = (((j - item.curPageUp)*-1) * self.width) + 'px';
				}
			}
		}
	}, 250);

}
MixScroll.prototype = Object.create(Object.prototype);
MixScroll.prototype.constructor = MixScroll;

MixScroll.prototype.init = function() {
	this.curPage = 0;
	
	for(var i = 0; i < this.pages.length; i++) {
		var item = this.pages[i];
		
		item.style.top = (i * this.height) + 'px';
		item.style.WebkitTransition = this.cssString;
		item.style.transition = this.cssString;

		var attr = item.getAttribute('data-anchor');
		if(attr) {
			this.anchors[attr] = { curPage: i };
		}
		
		item.pagesLeft = [];
		item.curPageLeft = 0;
		var ii = 0;
		for(var j=0; j<this.pagesLeft.length; j++) {
			var leftItem = this.pagesLeft[j];

			if(leftItem.parentElement == item) {
				if(this.width < this.options.minWidth) {
					addClass(leftItem, 'force');
					leftItem.style.top = (2 * ii * this.height) + 'px';
				} else {
					leftItem.style.top = (ii * this.height) + 'px';
				}

				leftItem.style.WebkitTransition = this.cssString;
				leftItem.style.transition = this.cssString;

				attr = leftItem.getAttribute('data-anchor');
				if(attr) {
					this.anchors[attr] = { curPage: i, leftCurPage: ii };
				}

				item.pagesLeft.push(leftItem);
				ii++;
			}
		}

		item.pagesRight = [];
		item.curPageRight = 0;
		ii = 0;
		for(j=0; j<this.pagesRight.length; j++) {
			var rightItem = this.pagesRight[j];

			if(rightItem.parentElement == item) {
				if(this.width < this.options.minWidth) {
					addClass(rightItem, 'force');
					rightItem.style.top = ((2 * ii + 1) * this.height) + 'px';
				} else {
					rightItem.style.top = ((ii*-1) * this.height) + 'px';
				}

				rightItem.style.WebkitTransition = this.cssString;
				rightItem.style.transition = this.cssString;

				attr = rightItem.getAttribute('data-anchor');
				if(attr) {
					this.anchors[attr] = { curPage: i, leftCurPage: ii };
				}

				item.pagesRight.push(rightItem);
				ii++;
			}
		}
		
		item.pagesUp = [];
		item.curPageUp = 0;
		ii = 0;
		for(j=0; j<this.pagesUp.length; j++) {
			var upItem = this.pagesUp[j];

			if(upItem.parentElement == item) {
				if(this.width < this.options.minWidth) {
					addClass(upItem, 'force');
					upItem.style.left = (2 * ii * this.width) + 'px';
				} else {
					upItem.style.left = (ii * this.width) + 'px';
				}

				upItem.style.WebkitTransition = this.cssString;
				upItem.style.transition = this.cssString;

				attr = upItem.getAttribute('data-anchor');
				if(attr) {
					this.anchors[attr] = { curPage: i, upCurPage: ii };
				}

				item.pagesUp.push(upItem);
				ii++;
			}
		}
		
		item.pagesDown = [];
		item.curPageDown = 0;
		ii = 0;
		for(j=0; j<this.pagesDown.length; j++) {
			var downItem = this.pagesDown[j];

			if(downItem.parentElement == item) {
				if(this.width < this.options.minWidth) {
					addClass(downItem, 'force');
					downItem.style.left = ((2 * ii + 1) * this.width) + 'px';
				} else {
					downItem.style.left = ((ii*-1) * this.width) + 'px';
				}
				downItem.style.WebkitTransition = this.cssString;
				downItem.style.transition = this.cssString;

				attr = downItem.getAttribute('data-anchor');
				if(attr) {
					this.anchors[attr] = { curPage: i, upCurPage: ii };
				}

				item.pagesDown.push(downItem);
				ii++;
			}
		}
	}
};

MixScroll.prototype.doScroll = function(dir) {
	var p = this.pages[this.curPage];
	var self = this;
	var aux = 1;
	var nextDoThis = null;

	document.location.hash = '';

	if(this.width < this.options.minWidth) {
		if(p.pagesLeftAux == null) {
			p.pagesLeftAux = 0;
			p.pagesUpAux = 0;
		}
		aux = 0;
	}

	if(p.pagesLeft.length > 0 && p.pagesLeft.length == p.pagesRight.length && p.curPageLeft + dir >= 0 && p.curPageLeft + dir <= p.pagesLeft.length - 1) {
		if(this.width < this.options.minWidth) {
			p.pagesLeftAux += dir;
			if(p.pagesLeftAux > 1) {
				p.curPageLeft += dir;
				p.pagesLeftAux = 0;
			} else if(p.pagesLeftAux < 0) {
				p.curPageLeft += dir;
				p.pagesLeftAux = 1;
			}
		} else {
			p.curPageLeft += dir;
		}

		for(var i=0; i<p.pagesLeft.length; i++) {
			var iLeft = p.pagesLeft[i];
			var iRight = p.pagesRight[i];

			if(this.width < this.options.minWidth) {
				iLeft.style.top = ((i*2 - (p.curPageLeft * 2 + p.pagesLeftAux)) * this.height) + 'px';
				iRight.style.top = ((i*2 - (p.curPageLeft * 2 + p.pagesLeftAux - 1)) * this.height) + 'px';
			} else {
				iLeft.style.top = ((i - p.curPageLeft) * this.height) + 'px';
				iRight.style.top = (((i - p.curPageLeft)*-1) * this.height) + 'px';
			}

			if(parseInt(iLeft.style.top) === 0 && iLeft.getAttribute('data-nostop')) {
				nextDoThis = function() {
					self.doScroll(dir);
				};
			}
		}
	} else if(p.pagesUp.length > 0 && p.pagesUp.length == p.pagesDown.length && p.curPageUp + dir >= 0 && p.curPageUp + dir <= p.pagesUp.length - 1) {
		if(this.width < this.options.minWidth) {
			p.pagesUpAux += dir;
			if(p.pagesUpAux > 1) {
				p.curPageUp += dir;
				p.pagesUpAux = 0;
			} else if(p.pagesUpAux < 0) {
				p.curPageUp += dir;
				p.pagesUpAux = 1;
			}
		} else {
			p.curPageUp += dir;
		}

		for(var i=0; i<p.pagesUp.length; i++) {
			var iUp = p.pagesUp[i];
			var iDown = p.pagesDown[i];

			if(this.width < this.options.minWidth) {
				iUp.style.left = ((i*2 - (p.curPageUp * 2 + p.pagesUpAux)) * this.width) + 'px';
				iDown.style.left = ((i*2 - (p.curPageUp * 2 + p.pagesUpAux - 1)) * this.width) + 'px';
			} else {
				iUp.style.left = ((i - p.curPageUp) * this.width) + 'px';
				iDown.style.left = (((i - p.curPageUp)*-1) * this.width) + 'px';
			}

			if(parseInt(iUp.style.left) === 0 && iUp.getAttribute('data-nostop')) {
				nextDoThis = function() {
					self.doScroll(dir);
				};
			}
		}
	} else {
		if(dir > 0 && this.curPage < this.pages.length-1) {
			this.curPage++;
		} else if(dir < 0 && this.curPage > 0) {
			this.curPage--;
		}

		for(var i=0; i<this.pages.length; i++) {
			var item = this.pages[i];

			item.style.top = ((i - this.curPage) * this.height) + 'px';

			if(parseInt(item.style.top) === 0) {
				if(item.getAttribute('data-nostop')) {
					nextDoThis = function() {
						self.doScroll(dir);
					};
				} else if(item.pagesUp.length > 0 && dir === 1 && parseInt(item.pagesUp[0].style.left) === 0 && item.pagesUp[0].getAttribute('data-nostop')) {
					nextDoThis = function() {
						self.doScroll(dir);
					};
				} else if(item.pagesUp.length > 0 && dir === -1 && parseInt(item.pagesUp[item.pagesUp.length-1].style.left) === 0 && item.pagesUp[item.pagesUp.length-1].getAttribute('data-nostop')) {
					nextDoThis = function() {
						self.doScroll(dir);
					};
				} else if(item.pagesLeft.length > 0 && dir === 1 && parseInt(item.pagesLeft[0].style.top) === 0 && item.pagesLeft[0].getAttribute('data-nostop')) {
					nextDoThis = function() {
						self.doScroll(dir);
					};
				} else if(item.pagesLeft.length > 0 && dir === -1 && parseInt(item.pagesLeft[item.pagesLeft.length-1].style.top) === 0 && item.pagesLeft[item.pagesLeft.length-1].getAttribute('data-nostop')) {
					nextDoThis = function() {
						self.doScroll(dir);
					};
				}
			}
		}
	}

	setTimeout(function() {
		if(nextDoThis) {
			nextDoThis();
		} else {
			self.wheelStatus = true;
		}
		//window.location.hash = "#" + hashidx;
	}, this.options.scrollingSpeed);
}

function mixScroll(options) {
	var local = new MixScroll(options);
}