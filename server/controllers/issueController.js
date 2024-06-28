const serviceAccount = require('../config/serviceAccountKey.json');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function getAll(req, res) {
  
}

async function getById(req, res) {
  
}

async function updateById(req, res) {
  
}

async function deleteById(req, res) {

}

module.exports = {
    getAll,
    getById,
    updateById,
    deleteById
};
