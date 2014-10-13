
/* A list view in intervals of one week
----------------------------------------------------------------------------------------------------------------------*/

fcViews.listWeek = ListWeekView; // register this view

function ListWeekView(calendar) {
	ListView.call(this, calendar); // call the super-constructor
}

ListWeekView.prototype = createObject(ListView.prototype); // define the super-class
	$.extend(ListWeekView.prototype, {

	name: 'listWeek',

	incrementDate: function(date, delta) {
		return date.clone().stripTime().add(delta, 'weeks').startOf('week');
	},


	render: function(date) {

		this.intervalStart = date.clone().stripTime().startOf('week');
		this.intervalEnd = this.intervalStart.clone().add(1, 'weeks');

		this.start = this.skipHiddenDays(this.intervalStart);
		this.end = this.skipHiddenDays(this.intervalEnd, -1, true);

		this.title = this.calendar.formatRange(
			this.start,
			this.end.clone().subtract(1), // make inclusive by subtracting 1 ms
			this.opt('titleFormat'),
			' \u2014 ' // emphasized dash
		);

		this.trigger('viewRender', this, this, this.el);
	}
});
