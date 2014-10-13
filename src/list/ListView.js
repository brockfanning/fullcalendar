/* An abstract class for the "list" views. Renders events in a vertical list grouped by day..
----------------------------------------------------------------------------------------------------------------------*/

function ListView(calendar) {
	View.call(this, calendar); // call the super-constructor
}


ListView.prototype = createObject(View.prototype); // define the super-class
	$.extend(ListView.prototype, {

	renderEvents: function renderListEvents(events) {

		var segs = [];

		var eventsCopy = events.slice().reverse(); //copy and reverse so we can modify while looping

		var tbody = $('<tbody></tbody>');

		this.scrollerEl = $('<div class="fc-scroller"></div>');

		this.el.html('')
			.append(this.scrollerEl).children()
			.append('<table class="fc-list-view" style="border: 0; width:100%"></table>').children()
			.append(tbody);

		var periodEnd = this.end.clone(); //clone so as to not accidentally modify

		var currentDayStart = this.start.clone();
		while (currentDayStart.isBefore(periodEnd)) {

			var didAddDayHeader = false;
			var currentDayEnd = currentDayStart.clone().add(1, 'days');

			//Assume events were ordered descending originally (notice we reversed them)
			for (var i = eventsCopy.length - 1; i >= 0; --i) {
				var e = eventsCopy[i];

				var eventStart = e.start.clone();
				var eventEnd = this.calendar.getEventEnd(e);

				if (currentDayStart.isAfter(eventEnd) || (currentDayStart.isSame(eventEnd) && !eventStart.isSame(eventEnd)) || periodEnd.isBefore(eventStart)) {
					eventsCopy.splice(i, 1);
				}
				else if (currentDayEnd.isAfter(eventStart)) {
					//We found an event to display

					if (!didAddDayHeader) {

						tbody.append((this.calendar.options.listDayHeader) ?
						this.calendar.options.listDayHeader(currentDayStart, this.calendar) :
						('' +
							'<tr>' +
								'<th>' +
									'<span class="fc-header-date">' + this.calendar.formatDate(currentDayStart, this.opt('columnFormat')) + '</span>' +
								'</th>' +
							'</tr>'));

						didAddDayHeader = true;
					}
					var segEl = $('' +
					'<a class="fc-event"' + (e.url ? ' href="' + htmlEscape(e.url) + '"' : '') + '>' +
						'<span class="fc-time">' + (e.allDay ? this.opt('allDayText') : this.getEventTimeText(e)) + '</span>' +
						'<span class="fc-title">' + e.title + '</span>' +
					'</a>');

					segEl = this.resolveEventEl(e, segEl);
					if (segEl) {
						tbody.append(segEl);
						tbody.find(segEl).wrap('<tr><td class="fc-event-container">');
						segs.push({ el: segEl, event: e });
					}
				}
			}

			currentDayStart.add(1, 'days');
		}

		this.updateHeight();

		this.segs = segs;

		View.prototype.renderEvents.call(this, events);

	},

	updateWidth: function() {
		this.scrollerEl.width(this.el.width());
	},

	setHeight: function(height, isAuto) {
		//only seems to happen at resize

		var diff = this.el.outerHeight() - this.scrollerEl.height();

		this.scrollerEl.height(height - diff);

		var contentHeight = 0;
		this.scrollerEl.children().each(function(index, child) {
			contentHeight += $(child).outerHeight();
		});


		if (height - diff > contentHeight) {
			this.scrollerEl.css('overflow-y', 'hidden');
		}
		else {
			this.scrollerEl.css('overflow-y', 'scroll');
		}

	},


	getSegs: function() {
		return this.segs || [];
	},


	renderDrag: function(start, end, seg) {
		// subclasses should implement
	},


	// Unrenders a visual indication of event hovering
	destroyDrag: function() {
		// subclasses should implement
	},


	// Renders a visual indication of the selection
	renderSelection: function(start, end) {
		// subclasses should implement
	},


	// Unrenders a visual indication of selection
	destroySelection: function() {
		// subclasses should implement
	}

});