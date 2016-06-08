var mongoose = require('mongoose');

var ClientsSchema = new mongoose.Schema({
	name: { type: String, index: { unique: true }},
	address: String,
	preferredPaymentType: String,
	cleaningCost: {type: Number, default: null},
	cleaningSchedule: String,
	requestedMaid: String,
	credit: {type: Number, default: null},
	appointments: [Date],
	notes: String,
});

mongoose.model('Clients', ClientsSchema);