var KswGlobalEvents = {
	callbacks: {},
	listen: function (eventType, callback) {
		// Lazy-load callbacks for provided event type
		var eventTypeCallbacks = KswGlobalEvents.callbacks[eventType];

		if (eventTypeCallbacks == null) {
			eventTypeCallbacks = KswGlobalEvents.callbacks[eventType] = [];
		}

		// Register the callback for the event type
		eventTypeCallbacks.push(callback);
	},
	raise: function (eventType, data, sender) {
		// Attempt to load callbacks for provided event type
		var eventTypeCallbacks = KswGlobalEvents.callbacks[eventType];

		if (eventTypeCallbacks == null) {
			return;
		}

		// Use sender or default
		if (sender == null) {
			sender = document;
		}

		// Iterate through and invoke each callback
		for (var index = 0; index < eventTypeCallbacks.length; index++) {
			var eventArgs = {
				data: data,
				eventType: eventType
			};

			eventTypeCallbacks[index](sender, eventArgs);
		}
	}
};