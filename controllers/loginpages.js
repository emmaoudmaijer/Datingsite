require('dotenv').config();
const express = require('express');
const router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_DB;
const client = new MongoClient(uri, { useNewUrlParser: true });

let collection = null;
client.connect(err => {
	collection = client.db(process.env.DB_NAME).collection('accounts');
});

router
	.post('/loginverify', loginverify)
	.get('/', login)
	.get('/logout', logout);

function loginverify(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	collection.find({'name':username}).toArray(function(err, data) {  
		if (err) throw err;

		if(data.length > 0 && data[0].wachtwoord == password){
			req.session.user = {username: username};
  
			res.redirect('/');
		} else{
			res.redirect('/login');
		}
	});
}

function login(req, res) {
	if(!req.session.user){
		res.render('login.pug', {'user': {'username':''} });
	} else{
		res.render('index.pug', {'user': req.session.user});
	}
        
}

function logout(req, res, next) {
	req.session.destroy(function (err) {
		if (err) {
			next(err)
		} else {
			res.redirect('/')
		}
	})
}

module.exports = router;