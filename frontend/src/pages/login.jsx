import { GoogleLogin } from '@react-oauth/google';

function Login() {
  // This function will be called upon a successful login
  const handleSuccess = (credentialResponse) => {
    // If you are using the authorization code flow, you will receive a code to be exchanged for an access token
    const authorizationCode = credentialResponse.code;

    // Send the authorization code to your backend server
    fetch('/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: authorizationCode }),
    })
    .then(response => response.json())
    .then(data => {
      // Handle the response from your backend server
      console.log('Login successful, backend response:', data);
    })
    .catch(error => {
      // Handle errors in communicating with your backend server
      console.error('Error exchanging authorization code:', error);
    });
  };

  const handleError = (errorResponse) => {
    console.error('Google login failed', errorResponse);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        flow="auth-code"
      />
    </div>
  );
}

export default Login;
