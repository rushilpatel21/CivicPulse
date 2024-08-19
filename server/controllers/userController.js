const admin = require('firebase-admin');

const db = admin.firestore();

async function sendIp(req, res) {
    const data = req.body;
    const date = new Date();
    const forwardedIpsStr = req.header('x-forwarded-for');
    let IP = '';
    if (forwardedIpsStr) {
        IP = forwardedIpsStr.split(',')[0];
    } else {
        IP = req.connection.remoteAddress;
    }
    if (data) {
        data.ip = IP;
        data.date = date;
        console.log("Data: ", data);
        try {
            const docRef = await db.collection('VisitDetail').add(data);
            res.status(200).send(docRef.id);
        } catch (error) {
            console.error("Error inserting document: ", error);
            res.status(500).send("Error inserting document");
        }
    } else {
        console.error("Data is undefined in request body");
        res.status(400).send("Invalid request body");
    }
}


module.exports = {
    sendIp,
};