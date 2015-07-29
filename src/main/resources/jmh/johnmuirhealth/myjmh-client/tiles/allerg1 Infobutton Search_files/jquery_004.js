/// <reference path="~/Scripts/jquery.KSDynamicTabs-1.0.js" />
/// <reference path="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" />
/*
	KSInfoButtonSearch.js - (Krames Staywell Info Button results page) - A jQuery helper for info button integration.
	2012.02.23 initial version
    2013.01.25 initial hub page support
	JPN (jnelson@kramesstaywell.com)

	DEPENDENCIES/ASSUMPTIONS:
		This will really only work with the markup found in ....

	USAGE:
		<script type = 'text/javascript'>
			$(document).ready(function()
			{
				// just initialize it - you can override default values first if need be
				var ob = { }
				$(this).KSInfoButtonSearch('setDefaults', ob);

				// call init
				$(this).KSInfoButtonSearch('init');
			});
		</script>
*/

// called by flash video player. This must live outside the jquery namespace
function getCurrentVidData()
{
	return $(this).KSInfoButtonSearch('getVideoData');
}

// Begin plugin
(function($) {
	
	var Entities = {
		Pair: function (keyItem, valueItem) {
			return {
				key : keyItem,
				value : typeof valueItem == 'undefined' || valueItem == null ? "" : valueItem
			};
		},
		SearchRequest: function () {
			return {
				organization: "",
				gender: "",
				age: "",
				taskContext: "",
				searchLanguage: "",
				resultLanguage: "",
				codeSystem: "",
				code: "",
				searchPhrase: "",
				resultsArea: null
			};
		},
		HubPage: function () {
			return {
				displayMockup: false,
				title: "",
				collectionIds: [],
				taxonomies: [],
				topics: [],
			};
		},
		Configuration: function () {
			return {
				wordsToFilter : [],
				phrasesToFilter: [],
				hubPages : []
			};
		},
		ContentItem: function (title, contentTypeId, contentId, isVideo) {
			var self = {				
				title: title,
				contentTypeId: contentTypeId,
				contentId: contentId,
				isVideo: isVideo
			};
			return self;
		}
	};
	
	var Utilities = {
		getQueryStringParameters: function () {
			var querystring = window.location.search;
			if (querystring.indexOf('?') == -1) {
			    // Check for post data
			    var postedData = $('.postSupport').val();
			    if (postedData.indexOf('?') == -1) {
			        return [];
			    } else {
			        querystring = postedData;
			    }
			}

			var params = [];
			var keyValuePairs = querystring.slice(querystring.indexOf('?') + 1).split('&');
			for (var i = 0; i < keyValuePairs.length; i++) {
				var pair = keyValuePairs[i].split('=');
				params.push( new Entities.Pair(pair[0], pair[1]));
			}
			return params;
		},
		findPairByKey: function (arrayOfPairs, lookupKey) {
			if (typeof arrayOfPairs == 'undefined' 
				|| arrayOfPairs === null 
				|| !(arrayOfPairs instanceof Array)
				|| arrayOfPairs.length === 0) {
				return null;
			}

			if (typeof lookupKey == 'undefined' || lookupKey.length === 0) {
				return null;
			}

			for (var i = 0; i < arrayOfPairs.length; i++) {
				var pair = arrayOfPairs[i];
				if (pair.key && pair.key.toLowerCase() == lookupKey.toLowerCase()) {
					return pair;
				}
			}

			return null;
		},
		getValueForKey: function (arrayOfPairs, lookupKey) {
			var pair = Utilities.findPairByKey(arrayOfPairs, lookupKey);
			
			if (pair == null) {
				return "";
			}

			return pair.value;
		},
		performAjaxGet: function (request, callback, type) {
			type = (type) ? type : "xml";
			$.ajax
			({
				type: "GET",
				url: request,
				dataType: type,
				success: function(data) {
					callback(data);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				    callback('');
				}
			});
		},
		getConfiguration: function (xml, language) {
			var config = new Entities.Configuration();
			
			$('WordFilterList', xml).find('item').each(function (i, v) {
				config.wordsToFilter.push($(v).text().toLowerCase());
			});
			$('PhraseFilterList', xml).find('item').each(function (ii, vv) {
				config.phrasesToFilter.push($(vv).text().toLowerCase());
			});

			$('hubPage', xml).each(function () {
				var node = $(this);
				var hubPage = new Entities.HubPage();

				if (node.attr("displayMockup") == "true") {
					hubPage.displayMockup = true;
				}
				
				node.find("locale[lang=" + language + "]").each(function (i, v) {
					hubPage.title = $(this).find("title").text();
				});

				node.find("collectionId").each(function (i, v) {
					hubPage.collectionIds.push($(v).text());
				});
				
				node.find("searchTriggers").find("code").each(function (i, v) {
					var code = $(this);
					hubPage.taxonomies.push(new Entities.Pair(code.attr("type"), code.text()));
				});

				config.hubPages.push(hubPage);
			});

			return config;
		},
		isContentTypeIdForVideo: function (contentTypeId, excludeOldVideos) {
			var arr = excludeOldVideos
				? defaults.arrVideoContentTypeIds
				: defaults.arrVideoContentTypeIds.concat(defaults.arrVideoContentTypeIds_OLD);

			var isForVideo = false;
			$.each(arr, function (ii, videoContentTypeId) {
				if (contentTypeId == videoContentTypeId) {
					isForVideo = true;
					return false;
				}
				return true;
			});
			return isForVideo;
		},
		upperCaseFirstLetter: function(str) {
			return str.substr(0, 1).toUpperCase() + str.substr(1, str.length - 1);
		},
		getSearchedForString: function(searchRequest) {
			var searchedForString = "";

			if (searchRequest.codeSystem.length && searchRequest.code.length) {
				for (var i in _obCodeSystems) {
					if (searchRequest.codeSystem == _obCodeSystems[i].code) {
						searchedForString += Utilities.upperCaseFirstLetter(_obCodeSystems[i].label) + ": " + searchRequest.code + " ";
						break;
					}

					if (_obCodeSystems[i].arrListenForCodes.length) {
						for (var t = 0; t < _obCodeSystems[i].arrListenForCodes.length; t++) {
							if (searchRequest.codeSystem == _obCodeSystems[i].arrListenForCodes[t]) {
								searchedForString += Utilities.upperCaseFirstLetter(_obCodeSystems[i].label) + ": " + searchRequest.code + " ";
								break;
							}
						}
					}
				}
			}

			if (searchRequest.searchPhrase.length) {
				searchedForString += unescape(searchRequest.searchPhrase.replace(/\"/g, ""));
			}

			return searchedForString;
		},
		getGenderString: function (genderCode) {
			switch (genderCode.toUpperCase()) {
				case GENDER_M:
					return "Male";
				case GENDER_F:
					return "Female";
				case GENDER_A:
				case "a":
				default:
					return "Male/Female";
			}
		}, 
		formatVideoDuration: function(seconds) {
			var m = Math.floor(seconds / 60).toString();
			var s = (seconds % 60).toString();
			return m + ":" + (s.length == 1 ? "0" + s : s);
		}
	};
	
	Utilities.SearchRequestProvider = function () {
		var self = {
			initialize: initialize,
			getSearchRequestList: getSearchRequestList,
			cleanSearchPhrase: cleanSearchPhrase
		};

		var _searchInstanceRegEx = new RegExp("\\d+$");

		var _keys = {};
		_keys.Filter = {
			Organization: "representedOrganization.id.root",
			Gender: "patientPerson.administrativeGenderCode.c",
			Age: "age.v.v",
			TaskContext: "taskContext.c.c",
			SearchLanguage: "performer.languageCode.c",
			ResultLanguage: "informationRecipient.languageCode.c"
		};
		_keys.AllFilters = [
			_keys.Filter.Organization,
			_keys.Filter.Gender,
			_keys.Filter.Age,
			_keys.Filter.TaskContext,
			_keys.Filter.SearchLanguage,
			_keys.Filter.ResultLanguage
		];
		_keys.Prefix = {
			CodeSystem: "mainSearchCriteria.v.cs",
			Code: "mainSearchCriteria.v.c",
			SearchPhrase: "mainSearchCriteria.v.dn"
		};

		var _parameters = {};
		_parameters.BaseFilters = [];
		_parameters.CodeSystems = [];
		_parameters.Codes = [];
		_parameters.SearchPhrases = [];

		var _searchRequestList = [];

		function initialize(queryStringParams, config) {
			if (typeof queryStringParams == 'undefined'
			|| queryStringParams === null
			|| !(queryStringParams instanceof Array)
			|| queryStringParams.length === 0) {
				return;
			}

			// address base filter parameters
			loadBaseFilters(queryStringParams);
			
			// address search parameters
			loadSearchParameters(queryStringParams);
			buildSearchRequestList();
			cleanSearchRequest(config);
		}

		function getSearchRequestList() {
			// Add the search request list for the content search
			var searchRequest = {
				age: '',
				code: '',
				codeSystem: '',
				gender: '',
				organization: '',
				resultLanguage: 'en',
				resultsArea: null,
				searchLanguage: 'en',
				searchPhrase: 'Search Results',
				taskContext: '',
				isContentSearch: true
			};
			_searchRequestList.push(searchRequest);
			return _searchRequestList;
		}

		function loadBaseFilters(queryStringParams) {
			// merge defaults with querystrings for applicable keys
			for (var keyIndex = 0; keyIndex < _keys.AllFilters.length; keyIndex++) {
				var knownKey = _keys.AllFilters[keyIndex];

				// from querystrings, get pair having the key
				var queryStringPair = Utilities.findPairByKey(queryStringParams, knownKey);
				if (queryStringPair == null) {
					continue;
				}

				// if pair having key already exists (added as a default), update it, otherwise add it
				var existingPair = Utilities.findPairByKey(_parameters.BaseFilters, knownKey);
				if (existingPair != null) {
					existingPair.value = queryStringPair.value;
				} else {
					_parameters.BaseFilters.push(queryStringPair);
				}
			}
		}

		function loadSearchParameters(queryStringParams) {
			// multiple instances of each type of search param may exist
			// params of the same will be differentiated with a suffix
			// that is why we identify them by prefix	
			
			// we need to check for keys with the code-system prefix 
			// before checking for keys with the code-value prefix 
			// because the code-system prefix starts with the code-value 
			// prefix
			
			for (var queryStringIndex = 0; queryStringIndex < queryStringParams.length; queryStringIndex++) {
				var queryStringParam = queryStringParams[queryStringIndex];
				
				var instance = getSearchParamInstance(queryStringParams[queryStringIndex].key);
				
				// code system
				if (queryStringParam.key.indexOf(_keys.Prefix.CodeSystem) > -1) {
					queryStringParam.instance = instance;
					_parameters.CodeSystems.push(queryStringParam);
					continue;
				}

				// code values
				if (queryStringParam.key.indexOf(_keys.Prefix.Code) > -1) {
					queryStringParam.instance = instance;
					_parameters.Codes.push(queryStringParam);
					continue;
				}

				// search phrase
				if (queryStringParam.key.indexOf(_keys.Prefix.SearchPhrase) > -1) {
					queryStringParam.instance = instance;
					_parameters.SearchPhrases.push(queryStringParam);
					continue;
				}
			}
		}

		function buildSearchRequestList() {
			// search criteria grouping scenarios
			// 1. cs and c
			// 2. cs and c and d
			// 3. d and c default(?)
			
			// scenarios #1 and 2
			var usedSearchPhraseInstances = [];
			for (var codeSystemIndex = 0; codeSystemIndex < _parameters.CodeSystems.length; codeSystemIndex++) {
				var codeSystem = _parameters.CodeSystems[codeSystemIndex];
				var code = getSearchParamByInstance(_parameters.Codes, codeSystem.instance);
				if (code == null) {
					continue;
				}

				var request = new Entities.SearchRequest();
				request.codeSystem = codeSystem.value;
				request.code = code.value;
				
				var searchPhrase = getSearchParamByInstance(_parameters.SearchPhrases, codeSystem.instance);
				if (searchPhrase != null) {
					request.searchPhrase = searchPhrase.value;
					usedSearchPhraseInstances.push(searchPhrase.instance);
				}

				addBaseFiltersToSearchRequest(request);

				_searchRequestList.push(request);
			}
			
			// scenario #3
			for (var searchPhraseIndex = 0; searchPhraseIndex < _parameters.SearchPhrases.length; searchPhraseIndex++) {
				var searchPhrase = _parameters.SearchPhrases[searchPhraseIndex];

				if ($.inArray(searchPhrase.instance, usedSearchPhraseInstances) > -1) {
					continue;
				}

				var request = new Entities.SearchRequest();
				request.searchPhrase = searchPhrase.value;
				request.code = "446.4";
				addBaseFiltersToSearchRequest(request);
				_searchRequestList.push(request);
			}
		}

		function getSearchParamInstance(searchParam) {
			// initial search param won't have a trailing integer
			// subsequent instances will have an incrementing integer
			
			var instance = _searchInstanceRegEx.exec(searchParam);
			return instance == null 
				? 1
				: parseInt(instance) + 1;
		}
		
		function getSearchParamByInstance(searchParamArray, lookUpInstance) {
			if (typeof searchParamArray == 'undefined'
			|| searchParamArray === null
			|| !(searchParamArray instanceof Array)
			|| searchParamArray.length === 0) {
				return null;
			}

			for (var i = 0; i < searchParamArray.length; i++) {
				var pair = searchParamArray[i];
				if (typeof pair.instance == 'undefined') {
					continue;
				}
				
				if (pair.instance == lookUpInstance) {
					return pair;
				}
			}

			return null;
		}
		
		function addBaseFiltersToSearchRequest(searchRequest) {

			var organization = Utilities.findPairByKey(_parameters.BaseFilters, _keys.Filter.Organization);
			if (organization != null) {
				searchRequest.organization = organization.value;
			} else {
				searchRequest.organization = "1.3.6.1.4.1.3768";
			}

			var gender = Utilities.findPairByKey(_parameters.BaseFilters, _keys.Filter.Gender);
			if (gender != null) {
				searchRequest.gender = gender.value;
			}
			
			var age = Utilities.findPairByKey(_parameters.BaseFilters, _keys.Filter.Age);
			if (age != null) {
				searchRequest.age = age.value;
			}

			var taskContext = Utilities.findPairByKey(_parameters.BaseFilters, _keys.Filter.TaskContext);
			if (taskContext != null) {
				searchRequest.taskContext = taskContext.value;
			} else {
				searchRequest.taskContext = "PROBLISTREV";
			}
			
			var searchLanguage = Utilities.findPairByKey(_parameters.BaseFilters, _keys.Filter.SearchLanguage);
			if (searchLanguage != null) {
				searchRequest.searchLanguage = searchLanguage.value;
			} else {
				searchRequest.searchLanguage = LANG_EN;
			}
			
			var resultLanguage = Utilities.findPairByKey(_parameters.BaseFilters, _keys.Filter.ResultLanguage);
			if (resultLanguage != null) {
				searchRequest.resultLanguage = resultLanguage.value;
			} else {
				searchRequest.resultLanguage = LANG_EN;
			}
			
			// other defaults
			// - age.v.u: "a"
			// - mainSearchCriteria.v.ot: ""
			// - performer: "PROV"

		}

		function cleanSearchRequest(config) {
			for (var i = 0; i < _searchRequestList.length; i++) {
				var request = _searchRequestList[i];

				request.resultLanguage = cleanLanguage(request.resultLanguage);
				request.searchLanguage = cleanLanguage(request.searchLanguage);
				request.searchPhrase = cleanSearchPhrase(request.searchPhrase, config);
			}
		}

	    function cleanLanguage(lang) {
			lang = lang ? lang.toLowerCase() : LANG_EN;
			switch (lang) {
				case LANG_ES:
				case LANG_EN:
					return lang;
				default:
					return LANG_EN;
			}
		}

		function cleanSearchPhrase(searchPhrase, config) {
			searchPhrase = unescape(searchPhrase).replace("\\\"", "\"");
			searchPhrase = $.trim(searchPhrase);
			searchPhrase = searchPhrase.replace(/"+"/g, " ");
			searchPhrase = searchPhrase.replace("%20", " ");
			searchPhrase = searchPhrase.replace("%2c", ",");
			searchPhrase = searchPhrase.replace("%2C", ",");
			searchPhrase = searchPhrase.replace(/\+/g, " ");
			
			// replace hyphens and both slashes with spaces
			searchPhrase = searchPhrase.replace("\\", " ");
			
			var charactersToReplace = ["-", "/"];
			$.each(charactersToReplace, function () {
				var charToReplace = this;
				var match = new RegExp(charToReplace, 'g');
				searchPhrase = searchPhrase.toLowerCase().replace(match, ' ');
			});
			
			$.each(config.phrasesToFilter, function () {
				var phraseToFilter = this;
				var match = new RegExp(phraseToFilter, 'g');
				searchPhrase = searchPhrase.toLowerCase().replace(match, '');
			});

			var phraseSegments = searchPhrase.split(" ");
			var wordList = [];
			$.each(phraseSegments, function (i, segment) {
				// filter out segments that are not alpha only (no numbers)
				// this will exclude segments like 1000mg, 30cc, etc
				// also filter applicable terms

				if (!/\d/.test(segment)) 
				{
					var matchesWord = false;
					for (var wordIndex = 0; wordIndex < config.wordsToFilter.length; wordIndex++) {
						if (segment.toLowerCase() == config.wordsToFilter[wordIndex].toLowerCase()) {
							matchesWord = true;
							break;
						}
					}

					if (!matchesWord && segment.length) {
						wordList.push(segment);
					}
				}
			});
			searchPhrase = wordList.join(" ");

			return searchPhrase;
		}

		return self;
	};

	Utilities.SearchManager = (function () {
		var self = {
			performSearch: performSearch,
			performGsaSearch: performGsaSearch
		};

		function performSearch(searchRequest, config) {
			if (typeof searchRequest == 'undefined'
			|| searchRequest === null
			|| searchRequest.resultsArea === null) {
				//console.log('Request not configured');
				return;
			}
			
			var resultsView = $('.resultsView', searchRequest.resultsArea);
			Utilities.DisplayManager.showLoader(resultsView);
			Utilities.DisplayManager.showTitle(resultsView, "Searching...");
			
			// go to hub page if applicable
			var hubPage = getHubPage(searchRequest.searchPhrase, config);
			if (hubPage != null) {
				Utilities.HubPageManager.displayHubPage(hubPage);
				return;
			}

			// perform infoButton search, if possible
			if (searchRequest.codeSystem.length && searchRequest.code.length) {
				performInfoButtonSearch(searchRequest);
				return;
			}
			
			// attempt gsa search
			if (searchRequest.searchPhrase.length) {
				performGsaSearch(searchRequest);
				return;
			}

			Utilities.DisplayManager.displayResultsHtml(resultsView, "Request not recognized");
		}

		function getHubPage(searchPhrase, config) {
			return null;

			if (!searchPhrase.length) {
				return null;
			}
			
			for (var hubPageIndex = 0; hubPageIndex < config.hubPages.length; hubPageIndex++) {
				var hubPage = hubPages[hubPageIndex];

				for (var taxonomyIndex = 0; taxonomyIndex < hubPage.taxonomies.length; taxonomyIndex++) {
					var taxonomy = hubPage.taxonomies[taxonomyIndex];
					
					// this logic has issues - leave since we're going to be redoing nex iteration
					//if (taxonomy.value == searchPhrase && _searchBy.toLowerCase() == taxonomy.key) {
					//	return hubPage;
					//}
				}
			}

			return null;
		}

		function performInfoButtonSearch(searchRequest) {
			var request = buildInfoButtonRequestString(searchRequest);

			writeOutRequests(request);
			Utilities.performAjaxGet(
				request,
				function (data) {
					Utilities.DisplayManager.displaySearchResults(searchRequest, data);
				});
		}
		
		function performGsaSearch(searchRequest) {
		    var request = _gsaSearchBasic.replace("__SEARCHTERM__", searchRequest.searchPhrase.replace(/\"/g, '^'));
			request = request.replace("__LANGCODE__", searchRequest.resultLanguage);
			var gender = searchRequest.gender;
			if (searchRequest.gender == 'a') {
				gender = "";
			} 
			request = request.replace("__GENDER__", gender);
			request = request.replace("__AGE__", searchRequest.age);
			
			writeOutRequests(request);
			Utilities.performAjaxGet(
				request,
				function (data) {
					Utilities.DisplayManager.displaySearchResults(searchRequest, data);
				});
			if (typeof infoButtonWarningMessage !== "undefined") {
				if (searchRequest.resultsArea.find('.warning').length > 0) {
					searchRequest.resultsArea.find('.warning').remove();
				}
				infoButtonWarningMessage.Show('', searchRequest.resultsArea.find('.resultsTitleBar'), 'search', 'after');
			}
		}

		function buildInfoButtonRequestString(searchRequest) {
			var request = '/Services/UCRContent.svc/InfoButtonSearch?XMLRequest=';
			request += '<knowledgeRequestNotification><effectiveTime value="20060706001023"/><subject1>';
			request += '<mainSearchCriteria>';
			request += '__MAIN_SEARCH_CRITERIA__';
			request += '</mainSearchCriteria>';
			request += '</subject1><performer><healthCareProvider><healthCarePerson><languageCommunication><languageCode code="' + searchRequest.searchLanguage + '"/></languageCommunication>';
			request += '</healthCarePerson></healthCareProvider></performer>';
			request += '<patientContext>__GENDER__';
			request += '__AGE__';
			request += '</patientContext>';
			request += '<informationRecipient><patient><patientPerson>';
			request += '<languageCommunication><languageCode code="' + searchRequest.resultLanguage + '" /></languageCommunication>';
			request += '</patientPerson></patient></informationRecipient></knowledgeRequestNotification>';

			// address gender
			var genderNode = '<patientPerson><administrativeGenderCode code="__GENDER__" codeSystem="" codeSystemName="" displayName=""/></patientPerson>';
			genderNode = genderNode.replace("__GENDER__", searchRequest.gender);
			request = request.replace("__GENDER__", genderNode);

			// address main search criteria
			var mainSearchCriteriaString = "";
			if (searchRequest.codeSystem.length && searchRequest.code.length) {
                mainSearchCriteriaString += "<value code='" + searchRequest.code + "' codeSystem='" + searchRequest.codeSystem + "'></value>";
			}
			if (searchRequest.searchPhrase.length) {

			    mainSearchCriteriaString += "<value code='' codeSystem=''><originalText>" + cleanInfoButtonSearchRequest(searchRequest.searchPhrase) + "</originalText></value>";
			}
			request = request.replace("__MAIN_SEARCH_CRITERIA__", mainSearchCriteriaString);

			// only pass age if age provide and not searching by ndc 
			var ageNode = "";
			if (searchRequest.age.length && searchRequest.codeSystem != _obCodeSystems.ndc.code) {
				ageNode = '<subjectOf><age><code code="30525-0" codeSystem="2.16.840.1.113883.6.1" codeSystemName="LN" displayName="AGE"/><value value="' + searchRequest.age + '" unit="a"/></age></subjectOf>';
			}
			request = request.replace("__AGE__", ageNode);

			return request;
		}

		function cleanInfoButtonSearchRequest(searchString) {
		    return searchString.replace(/&/g, '%26');
		}

	    function writeOutRequests(request) {
			if (!Utilities.getValueForKey(_queryStringParameters, 'debug').length) {
				return;
			}
			
			var requestForDisplay = request.toString();
			requestForDisplay = requestForDisplay.replace(/>/g, "&gt;");
			requestForDisplay = requestForDisplay.replace(/</g, "&lt;");
			$("#debugOutput").append("<div style='margin-bottom: 20px;'><strong>Request:</strong><br /><code>http://" + document.domain + requestForDisplay + "</code></div>").show();
		}

		return self;
	})();

	Utilities.DisplayManager = (function () {
		var self = {
			showTitle: showTitle,
			showLoader: showLoader,
			setErrorMessage: setErrorMessage,
			displayTabs: displayTabs,
			displayResultsHtml: displayResultsHtml,
			displaySearchResults: displaySearchResults,
			displayDocumentFromDirectRequest: displayDocumentFromDirectRequest
		};

		function showTitle(container, title, subtitle) {
			if (title)
				$(".mainTitle", container).html(title);
			if (subtitle)
				$(".mainSubtitle", container).html(subtitle);
		}

		function setErrorMessage(message) {
			var messageContainer = $('#errorMessage');
			messageContainer.text(message);
			if (message.length) {
				messageContainer.show();
				$('#tabsContainer').hide();
				$('#tabAreas').hide();
			} else {
				messageContainer.hide();
				$('#tabsContainer').show();
				$('#tabAreas').show();
			}
		}

		function showLoader(container) {
			var html = "<div id = 'loading'>Loading Data... Please Wait.<img id = 'loaderImg' src = 'loading.gif'></div>";
			$(".resultsBody", container).html(html);
		}
		
		function displayTabs(searchRequestList) {
			if (searchRequestList == null || !searchRequestList.length) {
				return;
			}
			var tabs = [];
			for (var requestIndex = 0; requestIndex < searchRequestList.length; requestIndex++) {
				var request = searchRequestList[requestIndex];
				
				var tabContext = Utilities.getSearchedForString(request);
				var tabName;
				if (tabContext.length) {
					tabName = tabContext;
				} else {
					tabName = "Search #" + (requestIndex + 1);
				}

				var tabArea = $('#templates .tabArea').clone();
				tabs.push(new dynamicTabs.Tab(tabName, tabArea));
				request.resultsArea = tabArea;
				if (request.isContentSearch) {
					BindAdhawkSearchEvent(request);
				}
			}
			
			var tabsContainer = $("#tabsContainer");
			tabsContainer.dynamicTabs("init", {
				tabList: tabs,
				tabLoadedCallback: function (tabItem) {
					tabItem.TabNode.attr("data-kswid", "resultTab");
					$("#tabAreas").append(tabItem.ContentArea);
					$(".resultsView", tabItem.ContentArea).show();
					if (tabItem.Text == 'Search Results') {
						tabItem.TabNode.attr("id", "SearchResultsTab");
					}
				}
			});

			tabsContainer.dynamicTabs("selectTab", tabs[0]);
			$('#SearchResultsTab').hide();
			if (tabsContainer.children().length > 2) {
				tabsContainer.show();
			} else {
				tabsContainer.hide();
			}
		}
		
		function BindAdhawkSearchEvent(request) {
		    var requestProvider = new Utilities.SearchRequestProvider();
		    $("#contentSearchButton").off().on("click", function () {
				// Make search request here and bind data to search result tabarea.
			    var searchPhrase = $('#contentSearchInput').val();
			    // clean phrase
			    request.searchPhrase = requestProvider.cleanSearchPhrase(searchPhrase, config);
				Utilities.SearchManager.performGsaSearch(request);
				//Show Tab
				$('#tabsContainer').show();
				$('#SearchResultsTab').show();
				$('#SearchResultsTab').click();
				// Clean up styling:
				$('#contentSearchContainer').addClass('search');
				$('#patientPortalButton').addClass('search');
			});
		}

		function displayResultsHtml(container, html) {
			$(".resultsBody", container).empty().html(html);
		}

		function displaySearchResults(searchRequest, xml) {
			
			// get the results
			var isInfoButtonRequest = $('ContentList', xml).length > 0;
			var contentNodes = isInfoButtonRequest
				? $('ContentObject', xml)
				: $('GsaResultItem', xml);

			var resultsView = $('.resultsView', searchRequest.resultsArea);
			if (!contentNodes.length) {
				if (isInfoButtonRequest && searchRequest.searchPhrase.length) {
					Utilities.SearchManager.performGsaSearch(searchRequest);
				} else {
					Utilities.DisplayManager.showTitle(resultsView, "No results found.");
					Utilities.DisplayManager.displayResultsHtml(resultsView, "No results found.");
				}
				
				return;
			}

			// display title
			var searchResultsTitle = getSearchResultsTitleString(searchRequest);
			Utilities.DisplayManager.showTitle(resultsView, "Search Results", searchResultsTitle);

			// show number of results
			var numResults = $('numResults', resultsView);
			if (contentNodes.length) {
				var plural = contentNodes.length != 1 ? "s" : "";
				numResults.html(contentNodes.length + " Result" + plural);
				numResults.show();
			} else {
				numResults.hide();
			}

			// collect contents
			var contentItemList = getContentItemsFromResults(contentNodes, isInfoButtonRequest);
			
			// display contents
			var resultsBody = $(".resultsBody", searchRequest.resultsArea);
			resultsBody.empty();
			for (var i = 0; i < contentItemList.length; i++) {
				var contentItem = contentItemList[i];
				var contentItemRow = getContentItemRow(searchRequest, contentItem);
				resultsBody.append(contentItemRow);
			}
			$("div:nth-child(odd)", resultsBody).addClass('odd');
		    // adjust lang dropdown if there are tabs
			if ($('#tabsContainer').is(":visible")) {
			    var langDropdowns = $(".docLangDDContainer");
			    $.each(langDropdowns, function (index) {
			        $(langDropdowns[index]).css('top', '-44px');
			    });
		        
		    }
		    applyPagination(resultsView, contentItemList.length);
		}

		function applyPagination(container, countOfTotalItems) {
			$(".pagination", container).show();

			container.pajinate({
				items_per_page: numResultsPerPage,
				item_container_id: '.resultsBody', 
				nav_panel_id: '.pagination', 
				num_page_links_to_display: 10,
				abort_on_small_lists: true
			});

			displayCurrentPageNumber(container, numResultsPerPage, countOfTotalItems);
			
			$(".pagination a", container).click(function () {
				displayCurrentPageNumber(container, numResultsPerPage, countOfTotalItems);
			});
		}

		function displayCurrentPageNumber(container, numberOfResultsPerPage, countOfTotalItems) {
			var numberOfPages = Math.ceil(countOfTotalItems / numberOfResultsPerPage);
			
			var currentPageNumber = $(".active_page", container).text();
			var comma = ", ";
			if (!currentPageNumber.length) {
				comma = "";
				currentPageNumber = 1;
			}
			
			$(".pageIndicator", container).remove();
			$(".info_text", container).append("<span class='pageIndicator'>" + comma + "Page " + currentPageNumber + " of " + numberOfPages + "</span>");
		}

		function getContentItemRow(searchRequest, contentItem) {
			var contentItemRow = $("<div class='contentItem'></div>");
			contentItemRow.html(contentItem.title);

			if (contentItem.isVideo) {
				contentItemRow.append("<img class='vidIcon' alt='View Video' src='vidIcon.png' />");
			}
			
			contentItemRow.click(function () {
				displayDocument(
					searchRequest.resultsArea, 
					contentItem.title, 
					contentItem.contentTypeId, 
					contentItem.contentId,
					false);
			});

			return contentItemRow;
		}

		function getContentItemsFromResults(contentNodes, isInfoButtonRequest) {
			var contentItemList = [];
			for (var i = 0; i < contentNodes.length; i++) {
				var contentNode = $(contentNodes[i]);
				
				// set content Ids
				var contentTypeId = contentNode.attr("ContentTypeId");
				var contentId = contentNode.attr("ContentId");
				var isVideo = Utilities.isContentTypeIdForVideo(contentTypeId);
				
				// set title
				var title;
				if (isInfoButtonRequest) {
					var strTitle = contentNode.find("InvertedTitle:first").text().length
						? contentNode.find("InvertedTitle:first").text()
						: contentNode.find("RegularTitle:first").text();
					title = strTitle;
				} else {
					title = contentNode.attr("Title");
				}
				
				contentItemList.push(new Entities.ContentItem(title, contentTypeId, contentId, isVideo));
			}

			return contentItemList;
		}
		
		function getSearchResultsTitleString(searchRequest) {
			if (document.location.href.indexOf("InfoButtonSearchIFrame") > -1) {
				return "Suggested Information for You:";
			} else {
				var searchedFor = Utilities.getSearchedForString(searchRequest); 
				var strAge = searchRequest.age.length ? ", age " + searchRequest.age : "";
				return "Searched for "
					+ "\"" + searchedFor + "\", "
					+ Utilities.getGenderString(searchRequest.gender) + strAge
					+ " (" + searchRequest.searchLanguage.toUpperCase() + "/"
					+ searchRequest.resultLanguage.toUpperCase() + ")";
			}
		}
		
		function configurePrint(container, contentTypeId, contentId) {
			
			var printPage = $(".printPage", container);
			printPage.unbind('click');
			printPage.click(function () {
				window.open("/" + contentTypeId + "," + contentId + "?PrinterFriendly=true");
			});
		}

		function displayDocumentFromDirectRequest(contentTypeId, contentId) {
			var resultsArea = $('#templates .tabArea').clone();
			$('#tabAreas').append(resultsArea);
			$('#tabsContainer').hide();

			resultsArea.show();
			displayDocument(resultsArea, "", contentTypeId, contentId, true);
		}

		function displayDocument(resultsArea, title, contentTypeId, contentId, isContentPageRequest) {
			var contentView = $('.contentView', resultsArea);

			// configure the header
			if (title.length) {
				showTitle(contentView, title, "<em>Loading...</em>");
			} else {
				showTitle(contentView, "Please wait", "<em>Loading...</em>");
			}
			showLoader(contentView);
			configurePrint(contentView, contentTypeId, contentId);
			
			// toggle the view
			var resultsView = $('.resultsView', resultsArea);
			resultsView.hide();
			contentView.show();

			// config the back button 
			if (!isContentPageRequest) {
				var backToResultsLink = $(".backToResultsSearchPage", contentView);
				backToResultsLink.unbind('click');
				backToResultsLink.click(function () {
					resultsView.show();
					contentView.hide();
				});

				backToResultsLink.show();
			}

			// display the doc			
			var isContentTypeIdForVideo = Utilities.isContentTypeIdForVideo(contentTypeId);
			if (!isContentTypeIdForVideo) {
				Utilities.performAjaxGet(
					"/" + contentTypeId + "," + contentId,
					function (data) {
						var contentContainer = $(".resultsBody", contentView);
						contentContainer.html(data);
						$(".source", contentContainer).remove();
						
						if (title.length) {
							showTitle(contentView, title, "&nbsp;");
						} else {
						    var newTitle = $(".resultsBody", contentView).find("title").text();
						    if (newTitle.length == 0) {
						        var matches = data.match(/<title[^>]*>([\s\S]*?)<\/title>/);
						        if (matches == null) {
						            newTitle = 'Document Not Found';
						        } else {
						            for (var i = 0; i < matches.length; i++) {
						                if (matches[i].length > 0) {
						                    newTitle = matches[1].replace('<title>', '').replace('</title>', '');
						                    if (newTitle.length > 0) {
						                        break;
						                    }
						                }
						            }
						        }
						    }
						    showTitle(contentView, newTitle, "&nbsp;");
						}
					},
					"html");
			}
			
			// also load the document in the background to determine available langs: (for all content type ids including video)
			Utilities.performAjaxGet(
				"Services/UCRContent.svc/GetContent?ContentTypeId=" + contentTypeId + "&ContentId=" + contentId + "&IncludeBlocked=false&GetOriginal=true",
				function (data) {
					configureLanguageSelector(resultsArea, isContentPageRequest, data);
					
					if (isContentTypeIdForVideo) {
						displayVideoContent(resultsArea, data);
					}
				});
		}

	    function configureLanguageSelector(resultsArea, isContentPageRequest, xml) {
			
			var node = $(xml).find("ContentObject");
			var languageDropDownContainer = $('.ddDL', resultsArea);
			languageDropDownContainer.empty();
			
			var languageDropDown = $("<select class='ddDocLangs'></select>");
			languageDropDownContainer.append(languageDropDown);
			if (typeof xml == "undefined" || $(xml).length == 0) {
			    return;
			}
	        // set the current language
			var langNode = $(xml).find("Language:first");
			var langCode = langNode.attr("Code");
			languageDropDown.append("<option value='" + node.attr("ContentTypeId") + "," + node.attr("ContentId") + "'>" + obLangs[langCode.toLowerCase()] + "</option>");

			// gather additional languages
			var languages = [];
			$(xml).find("OtherLanguages ContentObject").each(function (i, v) {
				var lang = obLangs[$(this).find("Language").attr("Code").toLowerCase()];
				languages.push({
					contentTypeId: $(this).attr("ContentTypeId"),
					contentId: $(this).attr("ContentId"),
					lang: lang,
					title: lang
				});
			});

			// sort
			languages.sort(function (a, b) {
				if (a.title && b.title) {
					var A = ('' + a.title).toLowerCase(); // ie8 sort weirdness
					var B = ('' + b.title).toLowerCase();
					return parseInt((A < B) ? -1 : ((A > B) ? 1 : 0));
				}
				return 0;
			});
			
			// add additional to the drop down and configure
			$.each($(languages), function (i, lang) {
				languageDropDown.append("<option value='" + lang.contentTypeId + "," + lang.contentId + "'>" + lang.lang + "</option>");
			});

			languageDropDown.selectmenu();
			languageDropDown.change(function () {
				var arr = $(this).val().split(",");
				displayDocument(resultsArea, "", arr[0], arr[1], isContentPageRequest);
			});
			
			if ($("option", languageDropDown).length == 1)
				$(".docLangDDContainer").hide();
			else
				$(".docLangDDContainer").show();

		}

		function displayVideoContent(resultsArea, xml) {
			var contentView = $('.contentView', resultsArea);
			
			var videoData = {};
			var contentObject = $(xml).find('ContentObject:first');
			videoData.contentTypeId = contentObject.attr("ContentTypeId");
			videoData.contentId = contentObject.attr("ContentId");
			videoData.blurb = contentObject.find("Blurb:first").text();
			videoData.title = contentObject.find("InvertedTitle:first").text().length
				? contentObject.find("InvertedTitle:first").text()
				: contentObject.find("RegularTitle:first").text();

			var isNewVideoType = Utilities.isContentTypeIdForVideo(videoData.contentTypeId, true);
				
			if (isNewVideoType) {
				videoData.duration = Utilities.formatVideoDuration(parseInt(contentObject.attr("RunningTime")));
				videoData.thumbnailUrl = contentObject.attr("ThumbnailId") + ".img";
				contentObject.find("Format").each(function (ii, vv) {
					if ($(vv).attr("MimeType") == "video/x-flv")
						videoData.flvUrl = $(vv).attr("Url");
				});
			} else {
				videoData.flvUrl = contentObject.find("media").attr("mediaurl");
			}
			
			Utilities.DisplayManager.showTitle(contentView, videoData.title, "&nbsp;");

			if (videoData.flvUrl)
				videoData.mp4Url = videoData.flvUrl.replace("rtmp://staywell.flash.internapcdn.net/staywell/_definst_/", "http://staywell.http.internapcdn.net/staywell/video/").replace(".flv", ".mp4");

			var videoPlayerId = 'videoPlayer_' + (Math.random());
			var videoPlayer = $("<div class='videoPlayer' id='" + videoPlayerId + "'></div>");
			videoPlayer.width(_vidWidth);
			videoPlayer.height(_vidHeight);
			
			$(".resultsBody", contentView).empty().append(videoPlayer);

			var videoBlurb = $("<div class='videoBlurb'><div>");
			videoBlurb.html("<h3>" + videoData.title + "</h3>" + videoData.blurb);
			$(".resultsBody", contentView).append(videoBlurb);
			
			var agent = navigator.userAgent.toLowerCase();
			var isHtml5 = (agent.indexOf("iphone") > -1 || agent.indexOf("ipad") > -1);
			if (isHtml5) {
				var videoHtml = "<video src='" + videoData.mp4Url + "' controls='controls' width = '" + _vidWidth + "' height = '" + _vidHeight + "'></video>";
				videoPlayer.html(videoHtml);
			} else {
				playFlashVideo(videoData.flvUrl, videoPlayerId);
			}

			_currentVideoData = videoData;
		}
		
		function playFlashVideo(url, playerId) {
			var flashVars =
			{
				sequence: url,
				logoUrl: "",
				logoPos: "tl",
				disclaimerImage: "",
				disclaimerDisplaySeconds: 0,
				dfxpUrl: "service",
				logging: "yes"
			};
			var flashParams =
			{
				allowFullScreen: "true",
				wmode: "opaque",
				quality: "high",
				bgcolor: "#000000",
				allowScriptAccess: "always"
			};
			var flashAttributes = {};
			swfobject.embedSWF("KramesStaywellVideoPlayer640x360.swf", playerId, _vidWidth, _vidHeight, "10.0.0", "expressInstall.swf", flashVars, flashParams, flashAttributes);
		}

		return self;
	})();

	Utilities.HubPageManager = (function () {
		var self = {displayHubPage : displayHubPage};

		function displayHubPage(hubPage) {
			// ---------this is incomplete ------------
			
			//if (!hubPage.collectionIds.length) {
			//	parent.location.href = 'InfobuttonHubPage.pg';
			//	return;
			//}
			
			//var subtopicNodes = "";
			//$.each(hubPage.collectionIds, function(i, id) {
			//	subtopicNodes += "<Subtopic RootSubtopicId = \"" + id + "\" />";
			//});

			//subtopicNodes += "";

			//var req = _wsCallSearchContent.replace("__MAX_NUM_SEARCH_DOCS__", defaults.hubPageMaxArticlesToLoad.toString());
			//req = req.replace("__LANG_CODE__", _resultLang);
			//req = req.replace("__SUBTOPIC_IDS__", subtopicNodes);

			
			//Utilities.DisplayManager.showLoader(); // this needs resultsArea context
			////Utilities.performAjaxGet(req, methods.renderHubPage);
			//// proxy call not available... load from XML for now.
			//$.get("copdCollectionContents.config.xml", {}, function(xml) {
				
			//	// this logic assumes master node has children two levels deep (topic->sub->sub)
			//	$("Subtopic", xml).each(function(i, v) {
			//		hubPage.title = $(v).find("Name:first").text();
			//		$(v).children().each(function(ii, vv) // primary topics
			//		{
			//			if ($(vv).attr("SubtopicId")) {
			//				var ob =
			//				{
			//					title: $(vv).find("Name:first").text(),
			//					desc: $(vv).find("Description:first").text(),
			//					subtopicId: $(vv).attr("SubtopicId"),
			//					arrTopics: [],
			//					arrItems: [] // hard coded config values for demo
			//				};

			//				$(vv).find("item").each(function(index, val) {
			//					ob.arrItems.push({ title: $(val).attr("title"), desc: $(val).text() });
			//				});

			//				hubPage.topics.push(ob);

			//				$(vv).children().each(function(iii, vvv) {
			//					if ($(vvv).attr("SubtopicId")) {
			//						var ob2 =
			//						{
			//							title: $(vvv).find("Name").text(),
			//							subtopicId: $(vvv).attr("SubtopicId")
			//						};
			//						hubPage.topics[hubPage.topics.length - 1].topics.push(ob2);
			//					}
			//				});
			//			}
			//		});
			//	});
			//	methods.renderHubPage();
			//});
		}
		
		function renderHubPage () {
			// --- this is incomplete

			////console.log("render page done " + document.location.href);
			//$("#hubPageTitle h1").html(hubPage.title);

			//// set topic indexes
			//_obHubPage.topicIndex = 0;
			//_obHubPage.subTopicIndex = 0;

			//methods.renderHubPageSlider();
			//methods.renderHubPageSubNav();
			//methods.renderHubPageAccordion();

			//$("#results").css("display", "none");
			//$("#hubPageContainer").css("display", "block");
		}
		
		function renderHubPageSlider() {
			// ---- this is incomplete

			//var mu = "<div class = 'hubPageSlidesContainer'>";
			//$.each(_obHubPage.arrTopics, function(i, v) {
			//	mu += "<div class = 'hubPageSlide'>";
			//	mu += "     <div class = 'hubPageSlideImage " + ((i % 2) ? "hubPageSlideImage1" : "hubPageSlideImage2") + "'></div>";
			//	mu += "     <div class = 'hubPageSlideText'>";
			//	mu += "         <div class = 'hubPageSlideTitle'>" + v.title + "</div>";
			//	mu += "         <div class = 'hubPageSlideDesc'>" + v.desc + "</div>";
			//	//mu += "         <div class = 'hubPageSlideLink'><a href = 'http://' target = '_blank'>Read More</a></div>";    
			//	mu += "         <div class = 'hubPageSlideLink'><a href = '#'>Read More</a></div>";
			//	mu += "     </div>";
			//	mu += "</div>";
			//});
			//mu += "</div>";
			//$("#hubPageSlider").css('overflow', 'hidden').html(mu);
			//$("#hubPageSlider").slides(
			//	{
			//		preload: true,
			//		play: 5000,
			//		pagination: true,
			//		generatePagination: true,
			//		slideSpeed: 600,
			//		paginationClass: 'hubPagePagination',
			//		hoverPause: true,
			//		container: 'hubPageSlidesContainer'
			//	});
		}
		
		function renderHubPageSubNav() {
			// --- this is incomplete

			//// other nav
			//var nav = "";
			//var arrow = "<img class = 'hubPageNavItemArrow' src = 'hubPageNavArrow.png' />";
			//$.each(_obHubPage.arrTopics, function(i, v) {

			//	nav += "<div class = 'hubPageNavItem' data-index='" + i + "'><span class = 'hubPageNavItemTitle'>" + v.title + "</span>" + (v.title.length < 35 ? arrow : "") + "</div>";

			//	if (i < _obHubPage.arrTopics.length - 1)
			//		nav += "<div class = 'hubPageNavItemSeparator'></div>";
			//});

			//$("#hubPageCollectionNav").html(nav);

			////var w = Math.floor($("#hubPageCollectionNavContainer").width() / _obHubPage.arrTopics.length) - ($(".hubPageNavItemSeparator").width() * 2);
			////$(".hubPageNavItem").width(w);

			//$(".hubPageNavItem").click(function() {
			//	_obHubPage.topicIndex = parseInt($(this).attr("data-index"));
			//	_obHubPage.subTopicIndex = 0;
			//	methods.renderHubPageAccordion();
			//});
		}
		
		function renderHubPageAccordion() {
			// --- this is incomplete

			//// THIS IS NOT AN ACCORDION. FYI.
			//var mu = "<div id = 'hubPageAccordionTitle'>" + _obHubPage.arrTopics[_obHubPage.topicIndex].title + "</div>";
			///*
            //    if(_obHubPage.arrTopics[_obHubPage.topicIndex].arrTopics.length)
            //    {
            //        $.each(_obHubPage.arrTopics[_obHubPage.topicIndex].arrTopics, function(i,v)
            //        {
            //            mu += "<div class = 'hubPageAccordionContentItem'><span class = 'hubPageAccordionContentItemTitle'>" + v.title + "</span><span>" + defaults.comingSoon + "</span></div>";
            //        });
            //    } 
            //    */
			//if (_obHubPage.arrTopics[_obHubPage.topicIndex].arrItems.length) {
			//	$.each(_obHubPage.arrTopics[_obHubPage.topicIndex].arrItems, function(i, v) {
			//		mu += "<div class = 'hubPageAccordionContentItem'><span class = 'hubPageAccordionContentItemTitle'>" + v.title + "</span><span>" + v.desc + "</span></div>";
			//		if (i == 3)
			//			return false;
			//	});
			//}
			//$("#hubPageCollectionNavContent").html(mu);
		}

		return self;
	})();

	var _queryStringParameters = [];
	var LANG_EN = "en";
	var LANG_ES = "es";
	var SEARCH_BY_TERM = "term";
    
	var GENDER_M = "M";
	var GENDER_F = "F";
	var GENDER_A = "A";
	var numResultsPerPage = 17;
	
	var obLangs = { en: "English", es: "Spanish", zh: "Chinese", vi: "Vietnamese", ru: "Russian", hy: "Armenian", fa: "Farsi (Persian)", km: "Khmer", ko: "Korean", hmn: "Hmong", tgl: "Tagalog", de: "German", fr: "French", it: "Italian", so: "Somali", aa: "Arabic", po: "Portuguese", pl: "Polish" };
	var _currentVideoData;
	var _vidWidth = 640; // keep these dims @ 16:9
	var _vidHeight = Math.round(_vidWidth / 16 * 9);
	var _wsBase = "/Services/UcrContent.svc/";
	var _gsaSearchBasic = _wsBase + "GsaSearchAdvanced?SearchTerm=__SEARCHTERM__&GsaCollections=ucr_documents|ucr_streaming_media&Language=__LANGCODE__&Gender=__GENDER__&Age=__AGE__&StartIndex=0&PageSize=999&IncludeClientContent=false";
    
	var arrButtons = // sample/example buttons
	[
			 { title: "Diabetes Type 2, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=diabetes%20type%202" }
			,{ title: "Heart Attack, Male, Age 62 (English Results)", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=m&age.v.v=62&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Heart%20Attack" }
			,{ title: "Heart Attack, Male, Age 62 (Spanish Results)", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=m&age.v.v=62&performer.languageCode.c=en&informationRecipient.languageCode.c=es&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Heart%20Attack" }
			,{ title: "Aspirin, Male/Female, Age 35", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=a&age.v.v=35&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=aspirin" }
			,{ title: "Cystitis, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=cystitis" }
			//,{ title: "Neurofibromatosis, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Neurofibromatosis" }
			,{ title: "Haloperidol, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Haloperidol" }
			,{ title: "Rosiglitazone, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Rosiglitazone" }
			,{ title: "Warfarin, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Warfarin" }
			,{ title: "Clopidogrel, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Clopidogrel" }
			,{ title: "Digoxin, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=Digoxin" }
			,{ title: "HbA1c, Female, Age 47", link: "?representedOrganization.id.root=1.3.6.1.4.1.3768&patientPerson.administrativeGenderCode.c=f&age.v.v=47&performer.languageCode.c=en&informationRecipient.languageCode.c=en&mainSearchCriteria.v.c=10535-3&mainSearchCriteria.v.dn=HbA1c" }
	];
	var _obCodeSystems =
	{
		 term:		{ code: "", label: SEARCH_BY_TERM, arrListenForCodes: [] }
		,icd9: 		{ code: "2.16.840.1.113883.6.42", label: "ICD9", arrListenForCodes: ["2.16.840.1.113883.6.103", "2.16.840.1.113883.6.104"] } 				// International Classification of Diseases revision 9 (ICD-9)
		,icd10cm:	{ code: "2.16.840.1.113883.6.3", label: "ICD-10-CM", arrListenForCodes: [] }
		,icd10pcs:	{ code: "2.16.840.1.113883.6.4", label: "ICD-10-PCS", arrListenForCodes: [] }
		,cpt: 		{ code: "2.16.840.1.113883.6.82", label: "CPT", arrListenForCodes: [] }
		,ndc: 		{ code: "2.16.840.1.113883.6.69", label: "NDC", arrListenForCodes: [] }
		,loinc: 		{ code: "2.16.840.1.113883.6.1", label: "LOINC", arrListenForCodes: [] }					// Logical Observation Identifier Names and Codes
		,snomed: 	{ code: "2.16.840.1.113883.6.96", label: "SNOMED", arrListenForCodes: [] }				// SNOMED Controlled Terminology
		,rxnorm: 	{ code: "2.16.840.1.113883.6.88", label: "RxNORM", arrListenForCodes: [] }				// RxNorm
		,hcpcs:		{ code: "2.16.840.1.113883.6.14", label: "HCPCS", arrListenForCodes: [] }
		,mesh:		{ code: "2.16.840.1.113883.6.177", label: "MeSH", arrListenForCodes: ["2.16.840.1.113883.6.1"] }
	};

	// these values can all be overridden:
	var defaults =
	{
		sendLang: LANG_EN
		,receiveLang: LANG_EN
		,invalidParamsMessage: "Invalid or no parameters passed to search on."
		,arrVideoContentTypeIds: [137,138,139] // we display video content differently.
		,arrVideoContentTypeIds_OLD: [106] // we display video content differently.
        ,hubPageMaxArticlesToLoad: 5
        ,comingSoon: "This text coming soon... This text coming soon... This text coming soon... This text coming soon... This text coming soon... "
		,resultsPerPage: 17 
	};
    var config;
    var methods =
    {
        /* Use this method to override the defaults above (if need be) - pass an object with matching parameters as defined in the defaults object above. */
        setDefaults: function(obDefaults) {
            for (var i in obDefaults) {
                if (defaults[i]) {
                    //alert("KSInfoButtonSearch.js -- OVERRIDING " + i + " ('" + defaults[i] + "') and setting it to: '" + obDefaults[i] + "'");
                    defaults[i] = obDefaults[i];
                }
            }
        },
        /* initializes the 'KSInfoButton' plugin */
        init: function() {
            _queryStringParameters = Utilities.getQueryStringParameters();
            // check for UCR Search Document
            methods.checkForUcrContentInUrl(_queryStringParameters);
            $.get("infobutton.config.xml", {}, function(xml) {
                config = Utilities.getConfiguration(xml, LANG_EN);
                methods.main(config);
            });
            methods.setupButtonsAndEvents();
        },
        getQueryStringRequest: function() {
            var querystring = window.location.search;
            if (querystring.indexOf('?') == -1) {
                return '';
            }
            return "?" + querystring.split("?")[1];
        },
        setupButtonsAndEvents: function() {
            // Patient Portal Button
            $("#patientPortalButton").remove();
            var patientPortalButton = "<div id = 'patientPortalButton' class='patientPortalButton' style='display:none;' >Patient Portal</div>";
            $("#results").prepend(patientPortalButton);
            $("#patientPortalButton").off().on("click", function() {
                var url = "http://clinical35.staywellsolutionsonline.com/infobutton/search.pg" + methods.getQueryStringRequest();
                window.open(url, "infobuttonsearch");
            });
            if (window.KswGlobalEvents) {
                window.KswGlobalEvents.listen("TABS_CREATED", function(sender, eventArgs) {
                    if (eventArgs.data > 2) {
                        $("#patientPortalButton").addClass("search");
                        $("#contentSearchContainer").addClass("search");
                    }
                });
            }
            // Content Search
            // Setup enter event for the searchbox
            $('#contentSearchInput').off().on("keypress", function(e) {
                if (e.keyCode == 13) {
                    $('#contentSearchButton').click();
                    return false;
                }
                return true;
            });

        },
        main: function(config) {
            // display examples
            var showExamples = (Utilities.getValueForKey(_queryStringParameters, "showExamples").length);
            if (showExamples || _queryStringParameters == '') {
                var samplesContainer = $('#samples');
                samplesContainer.show();
                $('#results').hide();

                Utilities.DisplayManager.showTitle(samplesContainer, "InfoButton Samples", "Click the info button to be taken to the results page.");
                var samplesHtml = "";
                $.each(arrButtons, function(i, v) {
                    samplesHtml += "<div class='contentItem doSearch'><a href='" + v.link + "'><div class='infobuttonTitle'>" + v.title + "</div><img class='infobutton' src='infobutton_icon.png' /></a></div>";
                });

                Utilities.DisplayManager.displayResultsHtml(samplesContainer, samplesHtml);
                $(".contentItem:nth-child(odd)", samplesContainer).addClass('odd');
                return;
            }

            // display UCR content 
            var contentTypeId = Utilities.getValueForKey(_queryStringParameters, 'ctid');
            var contentId = Utilities.getValueForKey(_queryStringParameters, 'cid');
            if (contentTypeId.length && contentId.length) {
                Utilities.DisplayManager.displayDocumentFromDirectRequest(contentTypeId, contentId);
                $('#patientPortalButton').css('cssText', 'display: none !IMPORTANT;');
                $('#contentSearchContainer').hide();
                return;
            }

            // perform search
            methods.doSearch(config);
        },
        doSearch: function(config) {

            var requestProvider = new Utilities.SearchRequestProvider();
            requestProvider.initialize(_queryStringParameters, config);

            var searchRequestList = requestProvider.getSearchRequestList();

            if (searchRequestList == null || !searchRequestList.length) {
                Utilities.DisplayManager.setErrorMessage("No requests found.");
                return;
            }

            for (var i = 0; i < searchRequestList.length; i++) {
                if (searchRequestList[i] == null) {
                    Utilities.DisplayManager.setErrorMessage("One or more requests not configured.");
                    return;
                }
            }

            Utilities.DisplayManager.displayTabs(searchRequestList);

            for (var requestIndex = 0; requestIndex < searchRequestList.length; requestIndex++) {
                Utilities.SearchManager.performSearch(searchRequestList[requestIndex], config);
            }
        },
        getVideoData: function() {
            if (_currentVideoData)
                return _currentVideoData;
        },
        checkForUcrContentInUrl: function (queryStringParams) {
            var matches = new RegExp(/(.*)-(.*)(?=\?)/).exec(window.location.href);
            if (matches == null)
                matches = new RegExp(/(.*)-(.*)/).exec(window.location.href);
            if (matches == null || matches.length < 1)
                return;
            var splitParams = matches[matches.length - 1].split(',');
            if (splitParams.length == 2) {
                if (Utilities.getValueForKey(queryStringParams, 'ctid') == '') {
                    queryStringParams.push(new Entities.Pair('ctid', splitParams[0]));
                }
                if (Utilities.getValueForKey(queryStringParams, 'cid') == '') {
                    queryStringParams.push(new Entities.Pair('cid', splitParams[1]));
                }
            }
        }
}; 

	$.fn.KSInfoButtonSearch = function( method ) {
		if (methods[method])
		{
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		}
		else if ( typeof method === 'object' || ! method )
		{
			return methods.init.apply( this, arguments );
		}
		else
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.KSInfoButtonSearch' );
		}
	};
	
	
})(jQuery);


