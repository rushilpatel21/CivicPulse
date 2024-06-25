import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Session from 'supertokens-auth-react/recipe/session';

const UserDetails = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const sessionExists = await Session.doesSessionExist();
                if (sessionExists) {
                    const accessToken = await Session.getAccessToken();
                    const response = await axios.get(
                        'http://localhost:8000/user/user-details',
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        }
                    );
                    setUserDetails(response.data);
                } else {
                    setMessage('No valid session found.');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                setMessage('Failed to fetch user details.');
            }
        };

        fetchUserDetails();
    }, []);

    if (message) {
        return <div>{message}</div>;
    }

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Details</h1>
            <p>ID: {userDetails.id}</p>
            <p>Email: {userDetails.emails.join(', ')}</p>
            <p>Time Joined: {new Date(userDetails.timeJoined).toLocaleString()}</p>
            {/* Add more fields as needed */}
        </div>
    );
};

export default UserDetails;
