KISSY.add('malldetail/control/floatbar', function(S,DOM,Event){
	/*
    * @param cfg.el 要浮动的节点
    * @param [cfg.placeHolder] 占位
    * @param [cfg.onChange] {function} 切换状态时回调
    * @param [cfg.top] {number} top值,默认0
    * @param [cfg.bottom] {number} bottom值,默认0,设置之后，则为浮动在底部
    * @param [cfg.cls] {string} 浮动时加上的className
    */
	return function (cfg)
	{
		var self=this,
			el=cfg.el,
			placeHolder=cfg.placeHolder||DOM.create("<div style='height:0;margin-top:0;margin-bottom:0;overflow:hidden;'></div>"),
			isFloating=false,
			isHidding = false,
			originalStyle,
			timer,
            mode,
            isTop = cfg.bottom===undefined,
			number = isTop?(Number(cfg.top) || 0):(Number(cfg.bottom)||0),
			parentEl = DOM.parent(el);
		DOM.insertAfter(placeHolder,el);
		function setPosition(){
			if(isTop){
				DOM.css(el, {"top": DOM.scrollTop() + number});
			}
			else{
				DOM.css(el, {"bottom": DOM.scrollTop() + number});
			}
		}
		function checkFloat() {
			if (mode === true || (mode !== false && (
				(isTop && DOM.offset(isFloating?placeHolder:el).top < DOM.scrollTop() + number) ||
				(!isTop && DOM.offset(isFloating?placeHolder:el).top+DOM.outerHeight(isFloating?placeHolder:el) > DOM.scrollTop() + DOM.viewportHeight() -number )
			))){
				if(!isFloating)
				{// 需要浮起
					originalStyle = {};
					S.each(["position",isTop?"top":"bottom","display"],function(sn){
						originalStyle[sn]=el.style[sn];
					});
					if (S.UA.ie<=6){
						if(!isHidding){
							DOM.css(el, {"display":"none"});
							isHidding = true;
						}
						if(timer) clearTimeout(timer);
						timer = setTimeout(function(){
							DOM.css(el, {
								"display":"block",
								"position": "absolute"
							});
							Event.on(window, "scroll", setPosition);
							setPosition();

							isHidding = false;
						},100);
					}else{
						DOM.css(el, isTop?{"position": "fixed","top": number}:{"position": "fixed","bottom": number});
					}
					DOM.css(placeHolder, {"height": DOM.outerHeight(el,true)+"px","width":DOM.outerWidth(el,true)+"px"});
					isFloating = true;
					if(cfg.cls){DOM.addClass(el,cfg.cls);}
					cfg.onChange && cfg.onChange(isFloating);
				}

			} else{
				if(isFloating)
				{// 不需要浮动+已经浮动
					if(timer) clearTimeout(timer);
					Event.remove(window, "scroll", setPosition);
					DOM.css(el, originalStyle);
					DOM.css(placeHolder, {"height": "0"});
					isFloating = false;
					if(cfg.cls){DOM.removeClass(el,cfg.cls);}
					cfg.onChange && cfg.onChange(isFloating);
				}
			}
		}
		Event.on(window, "scroll", checkFloat);
		checkFloat();

		S.mix(self,{
			isFloating:function(){
				return isFloating;
            },
            setMode: function (m) {
                mode = m;
                checkFloat();
			},
			getPlaceHolder:function(){
				return placeHolder;
			}
		});
	};
},{requires:['dom', 'event']});
