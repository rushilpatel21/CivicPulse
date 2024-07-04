const admin = require('firebase-admin');
require('dotenv').config();

const db = admin.firestore();

async function reportBug(req, res) {
    try {
        const {
            title,
            description,
            steps,
            expected,
            actual,
            severity,
            imageURL,
        } = req.body;


        const date = new Date();

        await db.collection('BugDetails').add({
            title,
            description,
            steps,
            expected,
            actual,
            severity,
            imageURL,
            date,
        });

        res.status(200).send('Bug reported successfully');
    } catch (error) {
        console.error('Error submitting bug report:', error);
        res.status(500).send('Error submitting bug report');
    }
}

module.exports = {
    reportBug
}