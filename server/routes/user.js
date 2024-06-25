const express = require('express');
const router = express.Router();
const { supertokens } = require("supertokens-node");

// Example route to fetch user details after successful sign-in
router.get("/", async (req, res) => {
    try {
        // Verify the session
        const session = await supertokens.getSession(req, res, true);

        if (session != undefined) {
            // Access user details
            const userId = session.getUserId(); // Get user ID
            const userInfo = await getUserDetailsFromDatabase(userId); // Example function to fetch user details
            console.log(userInfo);
            res.json(userInfo);
        } else {
            res.status(401).json({ error: "Session not found or invalid" });
        }
    } catch (err) {
        console.error("Error fetching user details:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

async function getUserDetailsFromDatabase(userId) {
    // Example function to fetch user details from a database
    // Replace with your actual implementation to fetch user details
    return { userId: userId, username: "example", email: "example@example.com" };
}

module.exports = router;