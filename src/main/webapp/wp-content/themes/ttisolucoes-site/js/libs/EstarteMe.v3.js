window.EstarteMe = window.EstarteMe || {};
( function(jQuery, window, undefined) {
		"use strict";

		EstarteMe.app = function() {

			var objWindow = jQuery(window), nodeRoot = jQuery("html, body"), objHeaderSection = jQuery('#top'), objHeaderSectionInitHeight = null, objHeaderSectionLastHeight = null, objStartButton = null, objSections = jQuery(".anchor, .anchor-fake"), objPersistentMenu = jQuery("#persistent-menu"), objInfogr = jQuery('.infogr'), AdjustHeaderHeightCounter = null, CheckButtonStartCounter = null, ControlMenuVisibilityCounter = null, SelectMenuItemOnScrollCounter = null, infogrScrollHeight = 12000, superscrollorama = jQuery.superscrollorama(), HeadJS = {
				InitFeatures : function() {
					head.feature('placeholder', function() {
						var t = document.createElement('textarea');
						return (t.placeholder !== undefined);
					});

					if (!head.placeholder) {
						jQuery('[placeholder]').focus(function() {
							var input = jQuery(this);

							if (input.val() == input.attr('placeholder')) {
								input.val('').removeClass('placeholder');
							}
						}).blur(function() {
							var input = jQuery(this);

							if (input.val() == '' || input.val() == input.attr('placeholder')) {
								input.addClass('placeholder').val(input.attr('placeholder'));
							}
						}).blur().parents('form').submit(function() {
							jQuery(this).find('[placeholder]').each(function() {
								var input = jQuery(this);

								if (input.val() == input.attr('placeholder')) {
									input.val('');
								}
							});
						});
					}
				}
			}, Form = {
				ValidateForm : function(form, callbackOnReset) {
					var elForm = jQuery(form), elInput = elForm.find(".validate");

					jQuery(elInput).keypress(function() {
						jQuery(".item-form").removeClass("error");
						jQuery(".form-feedback").slideUp('fast').html("");
					});

					if (callbackOnReset) {
						jQuery(elForm).on('reset', function() {
							callbackOnReset.call(this, jQuery(this));
						});
					}

					jQuery(elForm).submit(function() {
						var sair = false;

						jQuery.each(elInput, function(i, val) {
							if (sair) {
								return false;
							} else {
								if (jQuery(this).val() == "" || jQuery(this).val() == "-") {
									jQuery(this).focus();
									jQuery(this).closest(".item-form").addClass("error");
									jQuery(this).siblings(".form-feedback").html("Por favor, preencha este campo");
									jQuery(this).siblings(".form-feedback").slideDown('fast');
									sair = true;
								} else {
									if (jQuery(this).hasClass('type-email')) {
										if (!Form.ValidateEmail(jQuery(this).val())) {
											jQuery(this).focus();
											jQuery(this).closest(".item-form").addClass("error");
											jQuery(this).siblings(".form-feedback").html("Preencha com um e-mail válido");
											jQuery(this).siblings(".form-feedback").slideDown('fast');
											sair = true;
										}
									}
								}
							}
						});

						if (!sair) {
							var form = this, action = jQuery(form).attr('action'), data = jQuery(form).serialize();

							jQuery.ajax({
								type : 'POST',
								url : action,
								data : data,

								beforeSend : function() {
									jQuery(form).addClass('loading-form');
									jQuery(form).parent().append('<div class="loading-form-icon"> </div>');
								},

								complete : function() {
									jQuery(form).removeClass('loading-form');
									jQuery(form).parent().children('.loading-form-icon').remove();
								},

								error : function() {
									alert('Ocorreu algum erro no processo, tente novamente.');
								},

								success : function(response) {
									response = (response && typeof response === 'string') ? jQuery.parseJSON(response) : ((response && typeof response === 'object') ? response : new Object());
									alert(response.message);

									if (response.status == 'success') {
										jQuery(form).find('input:text, textarea').val('');
									}
								}
							});
						}

						return false;
					});
				},

				ValidateEmail : function(email) {
					var reg = new RegExp(/^[a-z0-9_\-]+(\.[_a-z0-9\-]+)*@([_a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)$/);
					return reg.test(email) ? true : false;
				},

				FormAnchors : function() {
					jQuery(document).on('click', '.go-contact-form', function(e) {
						e.preventDefault();

						var index = jQuery(this).attr('index'), section = jQuery('#contato'), offsetTopTarget = Util.GetTargetScrollTop(section);

						Util.DocumentSrollTop(offsetTopTarget, function() {
							jQuery('#contact-form').each(function() {
								jQuery(this).find('[name="txt-name"]').focus();
								Form.SelectOption(jQuery(this).find('[name="txt-subject"]'), index);
							});
						});
					});

					jQuery(document).on('click', '.open-startup-form', function(e) {
						e.preventDefault();

						var subject = jQuery(this).attr('title'), section = jQuery('#apresente-sua-ideia'), offsetTopTarget = Util.GetTargetScrollTop(section);

						Util.DocumentSrollTop(offsetTopTarget);

						/*
						 jQuery('#contact-startups-form').each(function() {
						 jQuery(this).parent().prev().slideUp(500);
						 jQuery(this).parent().slideDown(500);
						 jQuery(this).find('[name="txt-name"]').focus();
						 });
						 */
					});
				},

				BuildSelects : function() {
					jQuery('select').combobox();
				},

				SelectOption : function(select, index) {
					jQuery(select)[0].selectedIndex = index;
					jQuery(select).nextAll('input').first().val($('select :selected').text());
				}
			}, Timers = {
				Init : function() {
					Timers.AdjustHeaderHeightInit();
					Timers.ControlMenuVisibilityInit();
					Timers.SelectMenuItemOnScrollInit();
				},

				AdjustHeaderHeightInit : function() {
					clearTimeout(AdjustHeaderHeightCounter);
					AdjustHeaderHeightCounter = setTimeout(Timers.AdjustHeaderHeight, 100);
				},

				CheckButtonStartInit : function() {
					clearTimeout(CheckButtonStartCounter);
					CheckButtonStartCounter = setTimeout(Timers.CheckButtonStart, 100);
				},

				ControlMenuVisibilityInit : function() {
					clearTimeout(ControlMenuVisibilityCounter);
					ControlMenuVisibilityCounter = setTimeout(Timers.ControlMenuVisibility, 100);
				},

				SelectMenuItemOnScrollInit : function() {
					clearTimeout(SelectMenuItemOnScrollCounter);
					SelectMenuItemOnScrollCounter = setTimeout(Timers.SelectMenuItemOnScroll, 100);
				},

				AdjustHeaderHeight : function() {
					objHeaderSectionLastHeight = objHeaderSection.height();
					if (!objHeaderSectionInitHeight)
						objHeaderSectionInitHeight = objHeaderSectionLastHeight;
					var tempHeight = objWindow.height();
					if (tempHeight < objHeaderSectionInitHeight)
						tempHeight = objHeaderSectionInitHeight;

					objHeaderSection.css({
						'height' : tempHeight
					});
					Timers.AdjustHeaderHeightInit();
				},

				CheckButtonStart : function() {
					if (objWindow.scrollTop() == 0 && objStartButton.hasClass('invisib')) {
						objStartButton.removeClass('invisib');
						objStartButton.animate({
							'opacity' : '1',
							'bottom' : '20px'
						}, 500, 'easeInOutCubic');
					} else if (objWindow.scrollTop() > 0 && !objStartButton.hasClass('invisib')) {
						objStartButton.addClass('invisib');
						objStartButton.animate({
							'opacity' : '0',
							'bottom' : '10px'
						}, 500, 'easeInOutCubic');
					}

					Timers.CheckButtonStartInit();
				},

				ControlMenuVisibility : function() {
					
					
					if (Util.ElementIsVisible(objHeaderSection)) {
						jQuery(objPersistentMenu).css({
							'top' : '-300px'
						});
					} else {
						jQuery(objPersistentMenu).css({
							'top' : '0px'
						});
					}

					Timers.ControlMenuVisibilityInit();
				},

				SelectMenuItemOnScroll : function() {
					//Util.ExecuteIfElementIsOnTop(objSections, function() {
					Util.ExecuteIfElementIsOnPosition(objSections, function() {
						var id = jQuery(this).attr("id") || jQuery(this).attr("rel"), menuItens = jQuery("a.nav-anchor[href='#" + id + "']");
						jQuery(menuItens).parent().addClass('current');
						jQuery(menuItens).parent().siblings().removeClass('current');
					});

					Timers.SelectMenuItemOnScrollInit();
				}
			}, Effects = {
				ClickMenuItem : function() {
					jQuery(document).on('click', '.nav-anchor', function(e) {
						e.preventDefault();

						var section = jQuery(this.hash), offsetTopTarget = Util.GetTargetScrollTop(section);

						Util.DocumentSrollTop(offsetTopTarget);
					});
				},

				StartButton : function() {
					var temp = setTimeout(function() {
						jQuery('#top').append('<a href="#quem-somos" id="start-button" class="sprite">Saiba mais</a>');
						objStartButton = jQuery('#start-button');

						jQuery('#start-button').fadeIn('slow', function() {
							Timers.CheckButtonStartInit();
						});
					}, 500);
				},

				Infographic : function() {
					var leftTarget = 0, persistentMenuHeight = jQuery('#persistent-menu').height(), node = jQuery('.box-info'), nodeHeight = Util.GetElementHeight(node), windowHeight = jQuery(window).height() - persistentMenuHeight, offset;

					jQuery('.infogr-slide').each(function() {
						leftTarget -= Util.GetElementWidth(this);
					});
					leftTarget += Util.GetElementWidth(jQuery('.infogr-slide').last());

					if (windowHeight < nodeHeight) {
						offset = -(persistentMenuHeight);
					} else {
						offset = -(((windowHeight / 2) - (nodeHeight / 2)) + persistentMenuHeight);
					}

					superscrollorama.pin(node, infogrScrollHeight, {
						anim : (new TimelineLite()).append(TweenMax.to(jQuery(node).find('.infogr-inner-2'), 1, {
							css : {
								left : leftTarget
							},
							ease : Quad.easeInOut
						})),
						offset : offset
					});
				},

				FaqList : function() {
					jQuery(document).on('click', '.section-faq .list-key', function(e) {
						e.preventDefault();

						var this_ = jQuery(this), next_ = this_.next(), parent_ = this_.parent();

						if (parent_.hasClass('open')) {
							parent_.removeClass('open');
							next_.slideUp();
						} else {
							parent_.addClass('open');
							next_.slideDown();
						}
					});

					Effects.ListEffects('.section-faq', 'perguntas', false);
				},

				JobsList : function() {
					Effects.ListEffects('.section-jobs', 'vagas', true);
				},

				MentorsList : function() {
					Effects.ListEffects('.section-mentors', 'mentores', true);
				},

				PartnersList : function() {
					Effects.ListEffects('.section-partners', 'parceiros', true);
				},

				ListEffects : function(mainSelector, text, calculatePosition) {
					var listBox = jQuery(mainSelector + ' .list-box'), lists = listBox.children('.list'), listWidth = lists.first().width(), listBoxLeft = parseInt((listBox.css('margin-left')).replace('px', '')), listActive = 1, html = '<div class="list-controller begin">' + '<a href="javascript:;" class="list-button sprite list-button-prev" title="' + text + ' anteriores" style="display:none">' + text + ' anteriores</a>' + '<a href="javascript:;" class="list-button sprite list-button-next" title="próximas ' + text + '">próximas ' + text + '</a>' + '</div>';

					if (lists.length == 1)
						return false;

					listBox.parent().after(html);

					if (calculatePosition) {
						var marginTop = -((Util.GetElementHeight(listBox.parent()) + 50) / 2);
						listBox.parent().next().css({
							'margin-top' : marginTop
						});
					}

					jQuery(document).on('click', mainSelector + ' .list-button-prev', function(e) {
						e.preventDefault();

						if (listActive > 1) {
							listActive -= 1;
							listBoxLeft = -((listActive * listWidth) - listWidth);
							listBox.animate({
								'margin-left' : listBoxLeft
							}, 500, 'easeInOutCubic');
						}

						jQuery(mainSelector + ' .list-controller').removeClass('end');
						jQuery(mainSelector + ' .list-button-next').fadeIn();

						if (listActive == 1) {
							jQuery(mainSelector + ' .list-button-prev').fadeOut(function() {
								jQuery(mainSelector + ' .list-controller').addClass('begin');
							});
						}
					});

					jQuery(document).on('click', mainSelector + ' .list-button-next', function(e) {
						e.preventDefault();

						if (listActive < lists.length) {
							listActive += 1;
							listBoxLeft = -((listActive * listWidth) - listWidth);
							listBox.animate({
								'margin-left' : listBoxLeft
							}, 500, 'easeInOutCubic');
						}

						jQuery(mainSelector + ' .list-controller').removeClass('begin');
						jQuery(mainSelector + ' .list-button-prev').fadeIn();

						if (listActive == lists.length) {
							jQuery(mainSelector + ' .list-button-next').fadeOut(function() {
								jQuery(mainSelector + ' .list-controller').addClass('end');
							});
						}
					});
				}
			}, Util = {
				isTouchDevice : function() {
					return "ontouchstart" in window;
				},

				GetTargetScrollTop : function(target) {
					var offset = parseInt(target.attr('offset')), offsetTopTarget = target.offset().top + offset, offsetTopInfo = objInfogr.offset().top, offsetTopWindow = objWindow.scrollTop();

					if (offsetTopTarget > offsetTopInfo && offsetTopWindow < offsetTopInfo && jQuery('.superscrollorama-pin-spacer').height() == 0) {
						offsetTopTarget += infogrScrollHeight;
					}

					return offsetTopTarget;
				},

				DocumentSrollTop : function(offsetTopTarget, callback) {
					var speed = offsetTopTarget - objWindow.scrollTop();

					if (speed < 0)
						speed = -speed;

					if (speed <= 4000)
						speed = speed * .90;
					else if (speed > 4000 && speed <= 8000)
						speed = speed * .50;
					else if (speed > 8000)
						speed = speed * .30;
					else if (speed > 12000)
						speed = speed * .20;

					nodeRoot.stop().animate({
						scrollTop : offsetTopTarget
					}, speed, 'easeInOutQuad', function() {
						if (callback)
							callback.call(this);
					});
				},

				/*ExecuteIfElementIsOnTop : function(selector, callback) {
				 var documentScrollTop = (document.documentElement.scrollTop || document.body.scrollTop);

				 jQuery(selector).each(function() {
				 var anchorOffsetTop = jQuery(this).offset().top - 125,
				 anchorHeight = Util.GetElementHeight(this);

				 if (anchorOffsetTop <= documentScrollTop && (anchorOffsetTop + anchorHeight) > documentScrollTop) {
				 callback.call(this);
				 }
				 });
				 },*/

				ExecuteIfElementIsOnPosition : function(selector, callback) {
					var documentScrollTop = (document.documentElement.scrollTop || document.body.scrollTop), checkpoint = documentScrollTop + (objWindow.height() / 2);

					jQuery(selector).each(function() {
						var offset = parseInt(jQuery(this).attr('offset')), anchorOffsetTop = jQuery(this).offset().top, anchorHeight = Util.GetElementHeight(this);

						if (anchorOffsetTop <= checkpoint && (anchorOffsetTop + anchorHeight) > checkpoint) {
							callback.call(this);
						}
					});
				},

				ElementIsVisible : function(selector) {
					var documentScrollTop = (document.documentElement.scrollTop || document.body.scrollTop), windowHeight = (window.innerHeight && window.innerHeight < jQuery(window).height()) ? window.innerHeight : jQuery(window).height(), result = null;

					if (jQuery(selector).is(":visible"))
						jQuery(selector).each(function() {
							var anchorOffsetTop = jQuery(this).offset().top, anchorHeight = Util.GetElementHeight(this);
							//result = anchorOffsetTop >= documentScrollTop && (anchorHeight + anchorOffsetTop) <= (documentScrollTop + windowHeight);
							result = anchorOffsetTop >= documentScrollTop && (anchorOffsetTop) <= (documentScrollTop + windowHeight);
						});

					return result;
				},

				GetElementHeight : function(tag) {
					var tag = jQuery(tag), height = tag.height(), paddingTop = tag.css('padding-top'), paddingBottom = tag.css('padding-bottom'), borderTop = tag.css('border-top-width'), borderBottom = tag.css('border-bottom-width');

					paddingTop = paddingTop ? paddingTop.replace("px", "") : 0, paddingBottom = paddingBottom ? paddingBottom.replace("px", "") : 0, borderTop = borderTop ? borderTop.replace("px", "") : 0, borderBottom = borderBottom ? borderBottom.replace("px", "") : 0;

					height = parseInt(height) || 0, paddingTop = parseInt(paddingTop) || 0, paddingBottom = parseInt(paddingBottom) || 0, borderTop = parseInt(borderTop) || 0, borderBottom = parseInt(borderBottom) || 0;

					return (height + paddingTop + paddingBottom + borderTop + borderBottom);
				},

				GetElementWidth : function(tag) {
					var tag = jQuery(tag), width = tag.width(), paddingRight = tag.css('padding-right'), paddingLeft = tag.css('padding-left'), borderRight = tag.css('border-right-width'), borderLeft = tag.css('border-left-width');

					paddingRight = paddingRight ? paddingRight.replace("px", "") : 0, paddingLeft = paddingLeft ? paddingLeft.replace("px", "") : 0, borderRight = borderRight ? borderRight.replace("px", "") : 0, borderLeft = borderLeft ? borderLeft.replace("px", "") : 0;

					width = parseInt(width) || 0, paddingRight = parseInt(paddingRight) || 0, paddingLeft = parseInt(paddingLeft) || 0, borderRight = parseInt(borderRight) || 0, borderLeft = parseInt(borderLeft) || 0;

					return (width + paddingRight + paddingLeft + borderRight + borderLeft);
				}
			};

			return {
				init : function() {
					if (Util.isTouchDevice()) {
						jQuery('#body').addClass('touch-device');
					}

					HeadJS.InitFeatures();

					Form.ValidateForm("#contact-form", null);

					Form.ValidateForm("#contact-startups-form", function(elForm) {
						elForm.parent().slideUp(500);
						elForm.parent().prev().slideDown(500);
					});

					Form.FormAnchors();
					Form.BuildSelects();
					Effects.ClickMenuItem();

					if (!Util.isTouchDevice()) {
						Effects.Infographic();
					}

					Effects.FaqList();
					//Effects.JobsList();
					//Effects.MentorsList();
					Effects.PartnersList();
					Effects.StartButton();
					Timers.Init();
				}
			};
		};
	}(jQuery, window, undefined));
