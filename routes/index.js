var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Maids = mongoose.model('Maids');
var Clients = mongoose.model('Clients');
var Appointments = mongoose.model('Appointments');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.param('appointment', function(req, res, next, id) {
	console.log(id);
  var query = Appointments.findById(id);

  query.exec(function (err, appointment){
    if (err) { return next(err); }
    if (!appointment) { return next(new Error('can\'t find appointment')); }

    req.appointment = appointment;
    return next();
  });
});

router.get('/appointments', function(req, res) {
	Appointments.find({}).exec(function(err, appointments){
		if(err) {console.log(err);}
		res.json(appointments);
	});
});

router.post('/appointments', function(req, res) {
	var appointmentJSON = {
		name: req.body.name,
		sharedDate: req.body.sharedDate,
		address: req.body.address,
		maid1: req.body.maid1,
		maid2: req.body.maid2,
		maid3: req.body.maid3,
		paid: req.body.paid,
		maidpaid: req.body.maidpaid,
		notes: req.body.notes,
	}

	var appointment = new Appointments(appointmentJSON);
	appointment.save(function(err, returnedAppointment){
		// res.json({message: 'appointment saved'});
		res.json(returnedAppointment);
	});
});

router.get('/appointments/:appointment', function(req, res){
	res.json(req.appointment);
});

router.put('/appointments/:appointment', function(req, res){
	Appointments.update({'_id': req.appointment._id}, {$set: {
		'name': req.body.name,
		'sharedDate': req.body.sharedDate,
		'address': req.body.address,
		'maid1': req.body.maid1,
		'maid2': req.body.maid2,
		'maid3': req.body.maid3,
		'paid': req.body.paid,
		'maidpaid': req.body.maidpaid,
		'notes': req.body.notes,
	}}, function(err, appointment){
		if(err){console.log(err);}
		console.log(appointment);
		res.json({message: 'Successfully updated appointment'});
	});
});

router.put('/updateAppointmentName', function(req, res){
	Appointments.update({'name': req.query.oldName}, {$set: {
		'name': req.query.newName,
	}}, {multi: true}, function(err, appointment){
		if(err){console.log(err);}
		console.log(appointment);
		res.json({message: 'Successfully updated appointment'});
	});
});


router.delete('/appointments/:appointment', function(req, res){
	Appointments.remove({'_id': req.appointment._id}, function(err, metric){
		if(err){console.log(err);}
		res.json({message: 'Successfully deleted appointment'})
	});
});


router.param('maid', function(req, res, next, id) {
	console.log(id);
  var query = Maids.findById(id);

  query.exec(function (err, maid){
    if (err) { return next(err); }
    if (!maid) { return next(new Error('can\'t find maid')); }

    req.maid = maid;
    return next();
  });
});

router.get('/maids', function(req, res) {
	Maids.find({}).exec(function(err, maids){
		if(err) {console.log(err);}
		res.json(maids);
	});
});

router.post('/maids', function(req, res) {
	var maidJSON = {
		name: req.body.name,
		notes: req.body.notes,
	}

	var maid = new Maids(maidJSON);
	var query = Maids.find({name: req.body.name});
	query.exec(function(err, returnedMaid){
		if(returnedMaid.length === 0) {
			maid.save(function(err, returnedMaid){
				// res.json({message: 'Record saved'});
				res.json(returnedMaid);
			});
		} else {
			res.json({message: "Maid already exists!"})
		}
	});
});

router.get('/maids/:maid', function(req, res){
	res.json(req.maid);
});

router.put('/maids/:maid', function(req, res){
	Maids.update({'_id': req.maid._id}, {$set: {
		'name': req.body.name,
		'notes': req.body.notes,
	}}, function(err, maid){
		if(err){console.log(err);}
		console.log(maid);
		res.json({message: 'Successfully updated maid'});
	});
});

router.delete('/maids/:maid', function(req, res){
	Maids.remove({'_id': req.maid._id}, function(err, maid){
		if(err){console.log(err);}
		res.json({message: 'Successfully deleted maid'})
	});
});

router.param('client', function(req, res, next, id) {
	console.log(id);
  var query = Clients.findById(id);

  query.exec(function (err, client){
    if (err) { return next(err); }
    if (!client) { return next(new Error('can\'t find client')); }

    req.client = client;
    return next();
  });
});

router.get('/clients', function(req, res) {
	Clients.find({}).exec(function(err, clients){
		if(err) {console.log(err);}
		res.json(clients);
	});
});

router.post('/clients', function(req, res) {
	var clientJSON = {
		name: req.body.name,
		address: req.body.address,
		preferredPaymentType: req.body.preferredPaymentType,
		cleaningCost: req.body.cleaningCost,
		cleaningSchedule: req.body.cleaningSchedule,
		requestedMaid: req.body.requestedMaid,
		credit: req.body.credit,
		notes: req.body.notes,
	}

	var client = new Clients(clientJSON);

	var query = Clients.find({name: req.body.name});
	query.exec(function(err, returnedClient){
		if (returnedClient.length === 0) {
			client.save(function(err, returnedClient){
				// res.json({message: 'Record saved'});
				res.json(returnedClient);
			});
		} else {
			res.json({message: "Client already exists!"});
		}
	});
});

router.get('/clients/:client', function(req, res){
	res.json(req.client);
});

router.put('/clients/:client', function(req, res){
	if(req.body.name === req.client.name) {
		Clients.update({'_id': req.client._id}, {$set: {
			'name': req.body.name,
			'address': req.body.address,
			'cleaningCost': req.body.cleaningCost,
			'preferredPaymentType': req.body.preferredPaymentType,
			'cleaningSchedule': req.body.cleaningSchedule,
			'requestedMaid': req.body.requestedMaid,
			'credit': req.body.credit,
			'notes': req.body.notes,
		}}, function(err, client){
			if(err){console.log(err);}
			console.log(client);
			res.json(client);
			// res.json({message: 'Successfully updated client'});
		});
	} else {
		var query = Clients.find({name: req.body.name});
		query.exec(function(err, returnedClient){
			if(returnedClient.length === 0) {
				Clients.update({'_id': req.client._id}, {$set: {
					'name': req.body.name,
					'address': req.body.address,
					'cleaningCost': req.body.cleaningCost,
					'preferredPaymentType': req.body.preferredPaymentType,
					'cleaningSchedule': req.body.cleaningSchedule,
					'requestedMaid': req.body.requestedMaid,
					'credit': req.body.credit,
					'notes': req.body.notes,
				}}, function(err, client){
					if(err){console.log(err);}
					console.log(client);
					res.json(client);
					// res.json({message: 'Successfully updated client'});
				});
			} else {
				res.json({message: 'Client already exists!'});
			}
		});	
	}
});

router.post('/pushToClientsArr', function(req, res){
	console.log(req.body.sharedDate);
	Clients.update({name: req.body.name },
     {$push: { 'appointments' : req.body.sharedDate }},{upsert:true}, function(err, data) { 
    	if(err){console.log(err);}
    	res.json(data);	   
	});
});

router.post('/updateClientAppointments', function(req, res){
	console.log(req.body.oldDate);
	console.log(req.body.newDate);
	Clients.update({name: req.body.name, appointments: req.body.oldDate},
     {$set: { 'appointments.$': req.body.newDate}}, function(err, data) { 
    	if(err){console.log(err);}
    	res.json(data);
	});
});

router.post('/deleteClientAppointment', function(req, res){
	console.log(req.body.date);
	Clients.update({name: req.body.name},
     {$pull: { 'appointments': req.body.date}}, function(err, data) { 
    	if(err){console.log(err);}
    	res.json(data);
	});
});


router.delete('/clients/:client', function(req, res){
	Clients.remove({'_id': req.client._id}, function(err, client){
		if(err){console.log(err);}
		res.json({message: 'Successfully deleted client'})
	});
});

module.exports = router;
