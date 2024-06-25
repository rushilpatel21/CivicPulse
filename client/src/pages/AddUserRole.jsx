import { useState } from 'react';
import axios from 'axios';
import Session from 'supertokens-auth-react/recipe/session';

const AddUserRole = () => {
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');

    const handleAddRole = async () => {
        try {
            const sessionExists = await Session.doesSessionExist();
            if (sessionExists) {
                const accessToken = await Session.getAccessToken();
                const response = await axios.post(
                    'http://localhost:8000/user/add-role',
                    { role },
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    }
                );
                setMessage(response.data.message);
            } else {
                setMessage('No valid session found.');
            }
        } catch (error) {
            console.error('Error adding role to user:', error);
            setMessage('Failed to add role.');
        }
    };

    return (
        <div>
            <h1>Add Role to User</h1>
            <input
                type="text"
                placeholder="Enter role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
            />
            <button onClick={handleAddRole}>Add Role</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddUserRole;
