var mongoose = require('mongoose');

var AppointmentsSchema = new mongoose.Schema({
	name: String,
	date: Date,
	address: String,
	notes: String,
	paid: Boolean,
});

mongoose.model('Appointments', AppointmentsSchema);