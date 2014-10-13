
/* A list view in intervals of one month
----------------------------------------------------------------------------------------------------------------------*/

fcViews.listMonth = ListMonthView; // register this view

function ListMonthView(calendar) {
	ListView.call(this, calendar); // call the super-constructor
}


ListMonthView.prototype = createObject(ListView.prototype); // define the super-class
	$.extend(ListMonthView.prototype, {

	name: 'listMonth',

	incrementDate: function(date, delta) {
		return date.clone().stripTime().add(delta, 'months').startOf('month');
	},


	render: function(date) {

		this.intervalStart = date.clone().stripTime().startOf('month');
		this.intervalEnd = this.intervalStart.clone().add(1, 'months');

		this.start = this.intervalStart.clone();
		this.start = this.skipHiddenDays(this.start); // move past the first week if no visible days
		this.start.startOf('week');
		this.start = this.skipHiddenDays(this.start); // move past the first invisible days of the week

		this.end = this.intervalEnd.clone();
		this.end = this.skipHiddenDays(this.end, -1, true); // move in from the last week if no visible days
		this.end.add((7 - this.end.weekday()) % 7, 'days'); // move to end of week if not already
		this.end = this.skipHiddenDays(this.end, -1, true); // move in from the last invisible days of the week

		this.title = this.calendar.formatDate(this.intervalStart, this.opt('titleFormat'));

		this.trigger('viewRender', this, this, this.el);
	}
});
