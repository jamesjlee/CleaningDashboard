var mongoose = require('mongoose');

var AppointmentsSchema = new mongoose.Schema({
	name: String,
	sharedDate: Date,
	address: String,
	notes: String,
	maid1: String,
	maid2: String,
	maid3: String,
	paid: Boolean,
	maidpaid: Boolean,
});

mongoose.model('Appointments', AppointmentsSchema);