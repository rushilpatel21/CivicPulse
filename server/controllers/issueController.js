const admin = require('firebase-admin');

const db = admin.firestore();

// Helper function to calculate clearance statistics
async function getClearanceStatistics() {
    try {
        const snapshot = await db.collection('IssueDetails').get();
        const clearanceCount = new Map();
        clearanceCount.set('1', 0);
        clearanceCount.set('2', 0);
        clearanceCount.set('3', 0);
        snapshot.forEach((doc) => {
            const data = doc.data();
            const clearance = data.progress;
            clearanceCount.set(clearance, (clearanceCount.get(clearance) || 0) + 1);
        });
        return Object.fromEntries(clearanceCount);
    } catch (error) {
        console.error("Error calculating clearance statistics: ", error);
        return { '1': 0, '2': 0, '3': 0 };
    }
}

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
            res.status(200).send([]);
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

async function deleteByIssueId(req, res) {
    const id = req.params.id;
    try {
        const snapshot = await db.collection('IssueDetails').doc(id).get();
        if (snapshot.empty) {
            res.status(404).send('No issues found for the given user');
        } else {
            await db.collection('IssueDetails').doc(id).delete();
            res.send('Document deleted successfully');
        }
    } catch (error) {
        console.error("Error deleting documents: ", error);
        res.status(500).send("Error deleting documents");
    }
}

async function getByDep(req,res) {
    const dep = req.params.dep;
    try {
        const snapshot = await db.collection('IssueDetails').where('department', '==', dep).get();
        if (snapshot.empty) {
            res.status(200).send([]);
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

async function updateProgress(req, res) {
    const id = req.params.id;
    const {progress} = req.body;
    try {
        const snapshot = await db.collection('IssueDetails').doc(id).get();
        if (snapshot.empty) {
            res.status(404).send('No issues found for the given issue id');
        } else {
            // Get the old progress for comparison
            const oldData = snapshot.data();
            const oldProgress = oldData.progress;
            
            // Update the document
            await db.collection('IssueDetails').doc(id).update({
                progress,
            });
            
            // Get socket.io instance from request
            const io = req.io;
            if (io) {
                // Calculate updated statistics
                const updatedStats = await getClearanceStatistics();
                
                // Emit real-time updates
                io.emit('issue_progress_updated', {
                    issueId: id,
                    oldProgress: oldProgress,
                    newProgress: progress,
                    timestamp: new Date().toISOString()
                });
                
                // Emit dashboard statistics update
                io.emit('dashboard_stats_updated', {
                    open: updatedStats[1] || 0,
                    inProgress: updatedStats[2] || 0,
                    resolved: updatedStats[3] || 0
                });
                
                console.log(`📡 Socket events emitted - Progress updated for issue ${id}: ${oldProgress} -> ${progress}`);
                console.log(`📊 Dashboard stats: Open: ${updatedStats[1]}, InProgress: ${updatedStats[2]}, Resolved: ${updatedStats[3]}`);
            }
            
            res.send('Document updated successfully');
        }
    } catch (error) {
        console.error("Error updating document: ", error);
        res.status(500).send("Error updating document");
    }
}

// async function getAllIssuesByMonth(req, res) {
//     try {
//         const today = new Date();
//         const month = today.getMonth();
//         const year = today.getFullYear();
//         const snapshot = await db.collection('IssueDetails').get();
//         const issues = [];
//         const allowedMonth = [];
//         const allowedYear = [];
//         const finalMonth = [];
//         const finalCount = [];
//         const monthMap = new Map();
//         const countMap = new Map();

//         monthMap.set(0,'Jan');
//         monthMap.set(1,'Feb');
//         monthMap.set(2,'Mar');
//         monthMap.set(3,'Apr');
//         monthMap.set(4,'May');
//         monthMap.set(5,'Jun');
//         monthMap.set(6,'Jul');
//         monthMap.set(7,'Aug');
//         monthMap.set(8,'Sep');
//         monthMap.set(9,'Oct');
//         monthMap.set(10,'Nov');
//         monthMap.set(11,'Dec');
        
//         for(i=0;i<6;i++){
//             allowedMonth.push((month-i)%12);
//             finalMonth.push(monthMap.get((month-i)%12));
//             if((month-i)%12 <= month){
//                 allowedYear.push(year);
//             }else{
//                 allowedYear.push(year-1);
//             }
//         }
//         snapshot.forEach((doc) => {
//             const data = doc.data();
//             const date = data.date.toDate();

//             for(i=0 ;i<6;i++){
//                 if(date.getMonth() === allowedMonth[i] && date.getFullYear() === allowedYear[i]){
//                     issues.push({ id: doc.id, data: doc.data() });
//                     countMap.set(finalMonth[i], (countMap.get(finalMonth[i]) || 0)+ 1);
//                 }
//             }
//         });
//         for(i=0;i<6;i++){
//             finalCount.push(countMap.get(finalMonth[i]) || 0);
//         }
//         res.send({finalMonth,finalCount});
//     } catch {
//         console.error("Error fetching documents: ", error);
//         res.status(500).send("Error fetching documents");
//     }
// }

async function getAllIssuesByMonth(req, res) {
    try {
        const today = new Date();
        const month = today.getMonth();
        const year = today.getFullYear();
        
        const snapshot = await db.collection('IssueDetails').get();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const countMap = new Map();

        const allowedMonths = Array.from({ length: 6 }, (_, i) => {
            const adjustedMonth = (month - i + 12) % 12;
            const adjustedYear = (month - i >= 0) ? year : year - 1;
            return { month: adjustedMonth, year: adjustedYear };
        });

        allowedMonths.forEach(({ month }) => {
            const monthName = monthNames[month];
            countMap.set(monthName, 0);
        });

        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = data.date.toDate();
            const docMonth = date.getMonth();
            const docYear = date.getFullYear();
            const monthName = monthNames[docMonth];

            allowedMonths.forEach(({ month, year }) => {
                if (docMonth === month && docYear === year) {
                    countMap.set(monthName, (countMap.get(monthName) || 0) + 1);
                }
            });
        });

        const finalCounts = {};
        allowedMonths.forEach(({ month }) => {
            const monthName = monthNames[month];
            finalCounts[monthName] = countMap.get(monthName) || 0;
        });

        res.send(finalCounts);
    } catch (error) {
        console.error("Error fetching documents: ", error);
        res.status(500).send("Error fetching documents");
    }
}


async function getAllIssuesByDepartment(req, res) {
    try {
        const snapshot = await db.collection('IssueDetails').get();
        const deptCount = new Map();

        deptCount.set('Road', 0);
        deptCount.set('Garden', 0);
        deptCount.set('Electricity', 0);
        deptCount.set('Drainage', 0);
        deptCount.set('Health & Hygiene', 0);
        deptCount.set('Smart Toilet', 0);
        deptCount.set('Water', 0);
        deptCount.set('Animals', 0);
        deptCount.set('Others', 0);

        snapshot.forEach((doc) => {
            const data = doc.data();
            const department = data.department;
            deptCount.set(department, (deptCount.get(department) || 0)+ 1);
        });
        const deptCountObj = Object.fromEntries(deptCount);
        res.send(deptCountObj);
    } catch {
        console.error("Error fetching documents: ", error);
        res.status(500).send("Error fetching documents");
    }
}

async function getAllIssuesByClearance(req, res) {
    try {
        const clearanceCountObj = await getClearanceStatistics();
        res.send(clearanceCountObj);
    } catch (error) {
        console.error("Error fetching documents: ", error);
        res.status(500).send("Error fetching documents");
    }
}

async function getHeatmapData(req, res) {
    try {
        const snapshot = await db.collection('IssueDetails').get();
        const heatmapData = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            heatmapData.push({
                lat: parseFloat(data.lat) || 0,
                lng: parseFloat(data.lng) || 0,
                weight: 500
            });
        });
        res.send(heatmapData);
    } catch {
        console.error("Error fetching documents: ", error);
        res.status(500).send("Error fetching documents");
    }
}

module.exports = {
    getAll,
    getById,
    deleteById,
    getByDep,
    updateProgress,
    deleteByIssueId,
    getAllIssuesByMonth,
    getAllIssuesByDepartment,
    getAllIssuesByClearance,
    getHeatmapData
};
