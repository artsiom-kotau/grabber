var InfoButtonOptions = {};

InfoButtonOptions.WarningMessage = function() {
	var _self = {
		Initialize: Initialize,
		Show: Show
	};

	function Initialize() {
	}

	var DEFAULT_MESSAGE = 'Warning: The results below are the result of a best-match search (as opposed to an exact match) and are therefore not necessarily related to your specific condition.';

	function Show(message, parentContainer, additionalClass, appendSetting) {
		if (message.length == 0)
			message = DEFAULT_MESSAGE;
		var warningMessage = '<div class="warning ' + additionalClass + '" id="Warning">' + message + '</div>';

		if ($(parentContainer).length > 0) {
			switch (appendSetting) {
				case "before":
					$(parentContainer).before(warningMessage, $(parentContainer).firstChild);
					break;
				case "after":
					$(parentContainer).after(warningMessage, $(parentContainer).firstChild);
					break;
				default:
					$(parentContainer).append(warningMessage, $(parentContainer).firstChild);
					break;
			}
		}
	}

	return _self;
};

var infoButtonWarningMessage = new InfoButtonOptions.WarningMessage;
$(function () {
	if (typeof infoButtonWarningMessage !== 'undefined') {
		infoButtonWarningMessage.Initialize();
	}
});