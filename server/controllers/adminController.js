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

async function getAllUsers(req, res) {
    try {
        const users = [];
        const snapshot = await db.collection('Users').get();
        for (const doc of snapshot.docs) {
            const userData = doc.data();
            const reportsCount = await getReportsCount(doc.id);
            users.push({
                ...userData,
                reportsCount: reportsCount,
                id: doc.id
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

async function changeRoleById(req, res){
    const id = req.params.id;
    const role = req.body.role;
    if(!id) {
        res.status(400).send('User ID is required');
        return;
    }
    if(!role) {
        res.status(400).send('Role is required');
        return;
    }
    try{
        await db.collection('Users').doc(id).update({
            role: role
        });
        res.status(200).send('Role updated successfully');
    }catch(error) {
        console.error("Error updating role: ", error);
        res.status(500).send("Error updating role");
    }
}

async function deleteId(req,res){
    const id = req.params.id;
    if(!id) {
        res.status(400).send('User ID is required');
        return;
    }
    try{
        const user = await admin.auth().getUser(id);
        await admin.auth().deleteUser(user.uid);
        console.log("Stage 0 Clear");
        const issues = await deleteById(id);
        console.log("Issues deleted:", issues);
        console.log("Stage 1 Clear");
        await db.collection('Users').doc(id).delete();
        res.status(200).send('User deleted successfully');
    }catch(error) {
        console.error("Error deleting user: ", error);
        res.status(500).send("Error deleting user");
    }
}

async function deleteById(id) {
    try {
        const snapshot = await db.collection('IssueDetails').where('user', '==', id).get();
        if (snapshot.empty) {
            return;
        } else {
            snapshot.forEach(async (doc) => {
                await db.collection('IssueDetails').doc(doc.id).delete();
            });
            return;
        }
    } catch (error) {
        console.error("Error deleting documents: ", error);
        return;
    }
}

async function disableUser(req, res){
    const id = req.params.id;
    if(!id) {
        res.status(400).send('User ID is required');
        return;
    }
    try{
        const user = await admin.auth().getUser(id);
        await admin.auth().updateUser(user.uid, {
            disabled: true
        });
        await db.collection('Users').doc(id).update({
            isEnabled: false
        });
        res.status(200).send('User disabled successfully');
    }catch(error) {
        console.error("Error disabling user: ", error);
        res.status(500).send("Error disabling user");
    }
}

async function enableUser(req, res){
    const id = req.params.id;
    if(!id) {
        res.status(400).send('User ID is required');
        return;
    }
    try{
        const user = await admin.auth().getUser(id);
        await admin.auth().updateUser(user.uid, {
            disabled: false
        });
        await db.collection('Users').doc(id).update({
            isEnabled: true
        });
        res.status(200).send('User enabled successfully');
    }catch(error) {
        console.error("Error enabling user: ", error);
        res.status(500).send("Error enabling user");
    }
}

module.exports = {
    getRoleById,
    getAllUsers,
    changeRoleById,
    deleteId,
    disableUser,
    enableUser
};
