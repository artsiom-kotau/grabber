// This javascript is used in the search page tabs, and the tabs on the homepage.
/// <reference path="/Scripts/GlobalEvents-1.0.js" />

var dynamicTabs = {};

dynamicTabs.Tab = function (text, contentArea) {
	this.Text = text;
	this.ContentArea = contentArea;
	this.TabNode = null;
};


(function ($) {

	var TABS_CREATED = "TABS_CREATED";
	var _allTabsWidth = 0;

	var methods = {
		init: function (options) {
			var settings = $.extend({
				tabList: null,
				tabLoadedCallback: null,
				tabSelectedCallback: null
			}, options);

			if (settings.tabList == null) { alert("tabList cannot be null"); }

			return this.each(function () {
				var $tabsContainer = $(this);
					
				if (!$tabsContainer.data("dynamicTabs")) {
					$tabsContainer.data("dynamicTabs", settings);
					
					for (var tabIndex = 0; tabIndex < settings.tabList.length; tabIndex++) {
						methods.loadTab(settings.tabList[tabIndex], $tabsContainer);
					}
					// Add the tab controller if the tabs are on the search page.
					if ($tabsContainer.attr('id') == "tabsContainer") {
						methods.loadResponsiveTabController($tabsContainer);
					}
					if (window.KswGlobalEvents) {
						window.KswGlobalEvents.raise(TABS_CREATED, settings.tabList.length);
					}
				}

			});
		},

		loadResponsiveTabController: function ($container) {
			var $controller = $('<div class="tabController" ></div>');
			var $button = $('<span class="tabControllerDrop"><img data-kswid="tabControllerImage" src="subtopicMenuButtonMobile.png" /></span>');
			$controller.append($button);
			$controller.append('<div class="tabControllerTitleImageContainer"><div id="tabControllerTitleImage" ></div></div><span class="tabControllerTitle" data-kswid="tabControllerTitle">All</span>');
			$container.before($controller);
				
			$button.click(function () {
				methods.toggleTabs();
			});
				
			// listen for resize
			if (window.KswGlobalEvents) {
				window.KswGlobalEvents.listen("EVENT_RESIZED", function (sender, eventArgs) {
					if (!eventArgs.data || !eventArgs.data.state) {
						return;
					}

					switch (eventArgs.data.state) {
						case "Compact":
							if ($button.hasClass("expanded")) {
								$container.show();
							} else {
								$container.hide();
							}
							break;
						case "Full":
						case "Mid":
						default:
							$container.show();
							break;
					}
				});
			}
		},

		loadTab: function (tabItem, ul) {
			// create tab 
		    // truncate text label beyond 20 characters
		    var tabLabel = tabItem.Text.length > 20 ? tabItem.Text.substring(0, 20) + "&hellip;" : tabItem.Text;
		    var newTab = $("<li><a title=\"" + tabItem.Text + "\">" + tabLabel + "</a></li>");
			ul.append(newTab);
			tabItem.TabNode = newTab;

			// tab click
			newTab.click(function () {
				ul.parent().find(".tabControllerTitle").text(tabItem.Text);
				ul.parent().find("#tabControllerTitleImage").attr("class", tabItem.CssClass);
				$(this).parent().dynamicTabs("selectTab", tabItem);
			});

			var settings = ul.data("dynamicTabs");
			if (settings.tabLoadedCallback) {
				settings.tabLoadedCallback(tabItem);
			}

			_allTabsWidth += newTab.outerWidth();
		},

		selectTab: function (selectedTabItem) {
			var settings = $(this).data("dynamicTabs");



			for (var tabIndex = 0; tabIndex < settings.tabList.length; tabIndex++) {
				var tabItem = settings.tabList[tabIndex];
				tabItem.TabNode.removeClass("active");
				tabItem.ContentArea.hide();
			}

			selectedTabItem.TabNode.addClass("active");
			selectedTabItem.ContentArea.show();

			if (settings.tabSelectedCallback) { settings.tabSelectedCallback(selectedTabItem); }
		},

		toggleTabs: function () {
			var tabs = $("#tabsContainer");
			var tabDropdown = $(".tabControllerDrop");
			if (tabDropdown.attr('class').indexOf("expanded") > 0) {
				tabs.slideUp();
				tabDropdown.removeClass("expanded");
			} else {
				tabs.slideDown();
				tabDropdown.addClass("expanded");
			}
		},

	};

	$.fn.dynamicTabs = function (method) {

		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.dynamicTabs');
		}

		return null;
	};
		
})(jQuery);



