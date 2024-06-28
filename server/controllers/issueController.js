const serviceAccount = require('../config/serviceAccountKey.json');
const admin = require('firebase-admin');

const db = admin.firestore();

async function getAll(req, res) {
    try {
        const issues = [];
        const snapshot = await db.collection('IssueDetails').get();
        snapshot.forEach((doc) => {
            issues.push({ id: doc.id, data: doc.data() });
        });
        res.send(issues);
    } catch (error) {
        console.error("Error fetching documents: ", error);
        res.status(500).send("Error fetching documents");
    }
}

async function getById(req, res) {
    const id = req.params.id;
    try {
        const snapshot = await db.collection('IssueDetails').where('user', '==', id).get();
        if (snapshot.empty) {
            res.status(404).send('No issues found for the given user');
        } else {
            const issues = [];
            snapshot.forEach((doc) => {
                issues.push({ id: doc.id, data: doc.data() });
            });
            res.send(issues);
        }
    } catch (error) {
        console.error("Error fetching documents: ", error);
        res.status(500).send("Error fetching documents");
    }
}

// async function updateById(req, res) {
//     const id = req.params.id;
//     const data = req.body;
//     try {
//         const snapshot = await db.collection('IssueDetails').where('user', '==', id).get();
//         if (snapshot.empty) {
//             res.status(404).send('No issues found for the given user');
//         } else {
//             snapshot.forEach(async (doc) => {
//                 await db.collection('IssueDetails').doc(doc.id).update(data);
//             });
//             res.send('Document(s) updated successfully');
//         }
//     } catch (error) {
//         console.error("Error updating document: ", error);
//         res.status(500).send("Error updating document");
//     }
// }

async function deleteById(req, res) {
    const id = req.params.id;
    try {
        const snapshot = await db.collection('IssueDetails').where('user', '==', id).get();
        if (snapshot.empty) {
            res.status(404).send('No issues found for the given user');
        } else {
            snapshot.forEach(async (doc) => {
                await db.collection('IssueDetails').doc(doc.id).delete();
            });
            res.send('Document(s) deleted successfully');
        }
    } catch (error) {
        console.error("Error deleting documents: ", error);
        res.status(500).send("Error deleting documents");
    }
}

module.exports = {
    getAll,
    getById,
    deleteById
};
