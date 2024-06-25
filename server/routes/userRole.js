const express = require('express');
const router = express.Router();
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const Session = require('supertokens-node/recipe/session');
const UserRoles = require('supertokens-node/recipe/userroles');

// // Function to create a role with permissions
// async function createRole(role, permissions) {
//     const response = await UserRoles.createNewRoleOrAddPermissions(role, permissions);

//     if (response.createdNewRole === false) {
//         console.log('The role already exists');
//     }
// }

// // Create role before assigning it to any user
// createRole('user', ['read', 'write']).catch(console.error); // Create role with 'read' and 'write' permissions

// Route to add a role to a user
router.post('/add-role', verifySession(), async (req, res) => {
    try {
        const userId = req.session.getUserId();
        const { role } = req.body; // role to be assigned

        const response = await UserRoles.addRoleToUser(userId, role);

        if (response.status === "UNKNOWN_ROLE_ERROR") {
            return res.status(400).json({ message: 'Role does not exist' });
        }

        if (response.didUserAlreadyHaveRole) {
            return res.status(200).json({ message: 'User already has this role' });
        }

        res.status(200).json({ message: 'Role added successfully' });
    } catch (error) {
        console.error('Error adding role to user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Example route to fetch user details after successful sign-in
router.get('/user-details', verifySession(), async (req, res) => {
    try {
        const userId = req.session.getUserId();
        const userInfo = await supertokens.getUser(userId);
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
