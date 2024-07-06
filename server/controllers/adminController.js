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

// TODO: Figure out how to get last signed in and created date from firebase auth.

async function getAllUsers(req, res) {
    try {
        const users = [];
        const snapshot = await db.collection('Users').get();
        for (const doc of snapshot.docs) {
            const userData = doc.data();
            const reportsCount = await getReportsCount(doc.id);
            users.push({
                ...userData,
                reportsCount: reportsCount
            });
        }
        res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).send("Error fetching users");
    }
}

async function getReportsCount(userId) {
    try {
        const reportsSnapshot = await db.collection('IssueDetails').where('user', '==', userId).get();
        return reportsSnapshot.size;
    } catch (error) {
        console.error("Error fetching reports: ", error);
        throw error;
    }
}   



module.exports = {
    getRoleById,
    getAllUsers
};
