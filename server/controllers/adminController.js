const admin = require('firebase-admin');

const db = admin.firestore();

async function getRoleById(req, res) {
    const id = req.params.id;
    if (!id) {
        res.status(400).send('User ID is required');
        return;
    }
    try {
        const doc = await db.collection('Users').doc(id).get();
        if (!doc.exists) {
            res.status(404).send('No user found for the given ID');
        } else {
            res.status(200).send(doc.data().role);
        }
    } catch (error) {
        console.error("Error fetching role: ", error);
        res.status(500).send("Error fetching role");
    }
}

module.exports = {
    getRoleById
};
