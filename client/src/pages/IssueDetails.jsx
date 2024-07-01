import { useEffect, useState } from 'react';
import { auth } from '../components/firebase.jsx';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// import CustomizedSteppers from '../helper/progressBar.jsx';
import Filter from '../components/Filter.jsx'; 
import IssueSections from '../components/IssueSections.jsx';
const IssueDetails = () => {

  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [filter, setFilter] = useState(null);

  useEffect(() => {
    const usingSwal = () => {
      withReactContent(Swal).fire({
        icon: "error",
        title: "User Not Logged In",
        text: "Please sign in to view Issue Detail",
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Log In',
        cancelButtonText: 'Close',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        } else {
          navigate('/');
        }
      })
    };
    auth.onAuthStateChanged((user) => {
      if (!user) {
        usingSwal();
      }else{
        setLoggedIn(true);
      }
    });
  },[navigate]);

  const handleFilter = (filterData) => {
    setFilter(filterData);
    // Implement logic to filter issues based on filterData
  };

  return (
    <>
      {loggedIn && <div>
        {/* <Filter onFilter={handleFilter} /> */}
        <IssueSections filter={filter} />
      </div> }
    
    </>
  );
};

export default IssueDetails;
