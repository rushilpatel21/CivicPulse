import { useEffect, useState } from 'react';
import { getIssues } from '../helper/api.js'; 
import IssueCard from './IssueCard.jsx'; 
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
import { auth } from './firebase.jsx';

const IssueSections = ({ filter }) => {
  const [issues, setIssues] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [otherIssues, setOtherIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const allIssues = await getIssues();
      setIssues(allIssues);

      const user = auth.currentUser;
      const userId = user.uid; 
      setMyIssues(allIssues.filter(issue => issue.data.user === userId));
      setOtherIssues(allIssues.filter(issue => issue.data.user !== userId));
    };

    fetchIssues();
  }, []);

  return (
    <div>
      <h2>Issues Reported by Me</h2>
      <Grid container spacing={3}>
        {myIssues.length > 0 ? (
          myIssues.map(issue => (
            <Grid item xs={12} sm={6} md={4} key={issue.id}>
              <IssueCard issue={issue.data} />
            </Grid>
          ))
        ) : (
          <p>No issues reported by you.</p>
        )}
      </Grid>

      <h2>Issues Reported by Others</h2>
      <Grid container spacing={3}>
        {otherIssues.length > 0 ? (
          otherIssues.map(issue => (
            <Grid item xs={12} sm={6} md={4} key={issue.id}>
              <IssueCard issue={issue.data} />
            </Grid>
          ))
        ) : (
          <p>No issues reported by others.</p>
        )}
      </Grid>
    </div>
  );
};

IssueSections.propTypes = {
  filter: PropTypes.object,
};

export default IssueSections;
