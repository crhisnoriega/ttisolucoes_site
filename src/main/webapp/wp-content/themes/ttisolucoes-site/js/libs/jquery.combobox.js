(function( jQuery ) {
	jQuery.widget( "ui.combobox", {
		_create: function() {
			var self = this,
			select = this.element.hide(),
			selected = select.children( ":selected" ),
			value = selected.val() ? selected.text() : "",
			className = selected.attr( "class" ) || "";
			
			// --- INPUT ---
			
			var input = this.input = jQuery( "<input>" )
			.insertAfter( select )
			.val( value )
			.addClass( "input-text" )
			.autocomplete({
				delay : 0,
				minLength : 0,
				appendTo : jQuery( select ).parent(),
				
				source : function( request, response ) {
					var matcher = new RegExp( jQuery.ui.autocomplete.escapeRegex( request.term ), "i" );
					
					response( select.children( "option" ).map( function() {
						var text = jQuery( this ).text();
						
						if ( this.value && ( !request.term || matcher.test( text ) ) ) {
							return {
								label: text.replace(
									new RegExp(
										"(?![^&;]+;)(?!<[^<>]*)(" +
										jQuery.ui.autocomplete.escapeRegex( request.term ) +
										")(?![^<>]*>)(?![^&;]+;)", "gi"
									), "<strong>$1</strong>" ),
								value : text,
								option : this
							};
						}
					}));
				},
				
				select : function( event, ui ) {
					jQuery( input ).addClass( 'send-disabled' );

					var classes = ( jQuery( input ).parent().attr( "class" ) || "" ).split( " " ),
					i = classes.length;
					
					while ( i > 0 ) {
						i--;
						
						if ( classes[i].indexOf( "color-" ) > -1 ) {
							jQuery( input ).parent().removeClass( classes[i] );
						}
					}
					
					jQuery( input ).parent().addClass( jQuery( ui.item.option ).attr( "class" ) || "" );
					
					ui.item.option.selected = true;
					
					self._trigger( "selected", event, {
						item: ui.item.option
					});
					
					if ( jQuery( this ).hasClass( "disabled" ) ) {
						jQuery( this ).blur();
					}

					jQuery(".item-form").removeClass("error");
					jQuery(".form-feedback").slideUp('fast').html("");
				},
				
				change : function( event, ui ) {
					if ( !ui || !ui.item ) {
						var matcher = new RegExp( "^" + jQuery.ui.autocomplete.escapeRegex( jQuery( this ).val() ) + "$", "i" ),
						valid = false,
						selectedItem;
						
						select.children( "option" ).each( function() {
							if ( jQuery( this ).text().match( matcher ) ) {
								this.selected = valid = true;
								selectedItem = this;
								return false;
							}
						});

						if ( !valid ) {
							jQuery( this ).val( "" );
							jQuery( this ).addClass( "empty" );
							select.val( "" );
							input.data( "ui-autocomplete" ).term = "";
						}
					}
				}
			})
			.click( function() {
				if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
					input.autocomplete( "close" );
					return;
				}
				
				input.autocomplete( "search", "" );
			});
			
			input.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
				return jQuery( "<li class=\""+ ( jQuery( item.option ).attr( "class" ) || "" ) +"\"></li>" ).data( "ui-autocomplete-item", item ).append( "<a>" + item.label + "</a>" ).appendTo( ul );
			};
			
			jQuery( input ).parent().addClass( className );
			
			if ( value == "" ) {
				jQuery( this ).addClass( "empty" );
			}
			
			if ( jQuery( select ).hasClass( "ghost-mask" ) ) {
				jQuery( input ).addClass( "ghost-mask" );
			}
			
			if ( jQuery( select ).hasClass( "disabled" ) ) {
				jQuery( input ).attr( "readonly", "readonly" );
				jQuery( input ).addClass( "disabled" );
				jQuery( input ).addClass( "not-selectable" );
			}
			
			if ( jQuery( select ).attr( "mask" ) && jQuery( select ).attr( "mask" ) != "" ) {
				jQuery( input ).attr( "mask", jQuery( select ).attr( "mask" ) );
			}
			
			// --- BOT?O ---
			
			this.button = jQuery( "<a href=\"javascript:;\">&nbsp;</a>" )
			.insertAfter( input )
			.button({
				icons : {
					primary : "ui-icon-triangle-1-s"
				},
				
				text : false
			})
			.attr( "tabIndex", -1 )
			.removeClass( "ui-corner-all" )
			.addClass( "ui-button-icon" )
			.removeAttr( "title" )
			.click( function() {
				if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
					input.autocomplete( "close" );
					return;
				}
				
				jQuery( this ).blur();
				input.autocomplete( "search", "" );
				input.focus();
			});
		},
		
		destroy: function() {
			this.input.remove();
			this.button.remove();
			this.element.show();
			jQuery.Widget.prototype.destroy.call( this );
		}
	});
})( jQuery );