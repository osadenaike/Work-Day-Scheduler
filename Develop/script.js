// Display date at top of page
var date = moment().format('dddd, MMMM Do');
$('#currentDay').text(date);

// GLOBALS
var containerEl = $('.container');
// specify range of work day
var dayStart = 9;
var dayEnd = 17;

// create an hour block for each hour in the workday
for (var i = dayStart; i <= dayEnd; i++) {
	createEvent(i);
}

// CREATE EVENT
function createEvent(time) {
	// create moment object for hour block at current iteration
	var hour = moment(time, 'h');
	// format as x:00AM/PM
	var hourDisplay = hour.format('hA');

	// build event block
	var inputGroupEl = $('<div>').addClass('input-group');
	var inputGroupPreEl = $('<div>').addClass('input-group-prepend');
	var timeSpanEl = $('<span>').addClass('input-group-text hour').text(hourDisplay);
	var eventEl = $('<textarea>').addClass('form-control').attr('data-id', time);
	var inputGroupAppEl = $('<div>').addClass('input-group-append');
	var saveBtnEl = $('<span>')
		.addClass('input-group-text saveBtn')
		.attr('data-id', time);
	var calendarIconEl = $('<i>').addClass('fas fa-calendar-plus');

	inputGroupAppEl.append(saveBtnEl);
	saveBtnEl.append(calendarIconEl);
	inputGroupPreEl.append(timeSpanEl);
	inputGroupEl.append(inputGroupPreEl, eventEl, inputGroupAppEl);
	containerEl.append(inputGroupEl);

	// pass current hour block and event block
	styleEventColor(hour, eventEl);
}

// dynamically style event backgrounds based on relationship to current time
function styleEventColor(eventHour, eventEl) {
	var now = moment();

	if (eventHour.isBefore(now, 'hour')) {
		eventEl.addClass('past');
	} else if (eventHour.isSame(now, 'hour')) {
		eventEl.addClass('present');
	} else {
		eventEl.addClass('future');
	}
}

// SAVE EVENTS TO ARRAY AND LOCAL STORAGE
$('.saveBtn').on('click', saveEvent);

var eventsArr = loadEvents() || [];

// save event to array and localStorage
function saveEvent() {
	// get text from textarea related to clicked saveBtn
	var eventText = $(this).parent().prev().val().trim();

	// build object with id value coming from saveBtn's data-id attribute
	var eventObj = {
		id        : $(this).attr('data-id'),
		eventText : eventText
	};

	// new objects are pushed even if an existing object with that id is already in the array.  so there are duplicate entries if an event is updated.  remove object before pushing it.
	// if the events array alredy has an object with the same id, splice it
	for (var i = 0; i < eventsArr.length; i++) {
		if (eventsArr[i].id === eventObj.id) {
			eventsArr.splice(i, 1);
		}
	}

	eventsArr.push(eventObj);

	localStorage.setItem('eventsLS', JSON.stringify(eventsArr));
}

// RETRIEVE EVENTS FROM LOCALSTORAGE AND POPULATE UI
function loadEvents() {
	var eventsLS = localStorage.getItem('eventsLS');
	eventsLS = JSON.parse(eventsLS);
	console.log(eventsLS);

	if (!eventsLS) {
		return false;
	}

	// loop over all events in LS array and poplulate event blocks that have data
	for (var i = 0; i < eventsLS.length; i++) {
		$('.form-control[data-id="' + eventsLS[i].id + '"]').val(eventsLS[i].eventText);
	}
	return eventsLS;
}