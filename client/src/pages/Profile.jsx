import { signOut } from "supertokens-auth-react/recipe/session";

const Profile = () => {
  async function onLogout() {
    await signOut();
    window.location.href = "/";
  }
  return (
    <>
      <h1>Profile</h1>
      <button onClick={onLogout}>Log Out</button>
    </>
  );
};

export default Profile;
