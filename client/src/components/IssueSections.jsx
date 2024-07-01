import { useEffect, useState } from 'react';
import { getIssues, getIssuesById } from '../helper/api.js'; 
import IssueCard from './IssueCard.jsx'; 
import PropTypes from 'prop-types';
import { Grid, Box, Typography } from '@mui/material';
import { auth } from './firebase.jsx';
import Loader from './loader.jsx';
import Filter from './Filter.jsx';

const IssueSections = () => {
  const [loading, setLoading] = useState(true);
  const [myIssues, setMyIssues] = useState([]);
  const [otherIssues, setOtherIssues] = useState([]);
  const [filter, setFilter] = useState({
    distance: '',
    severity: '',
    department: '',
  });

  useEffect(() => {
    const fetchIssues = async () => {
      const allIssues = await getIssues();
      const user = auth.currentUser;
      const userId = user.uid; 
      const myIssues = await getIssuesById(userId);
      setMyIssues(myIssues);
      setOtherIssues(allIssues.filter(issue => issue.data.user !== userId));
      setLoading(false);
    };

    fetchIssues();
  }, []);

  const applyFilter = () => {
    
    console.log('Applying filter:', filter);
  };

  const clearFilter = () => {
    setFilter({ distance: '', severity: '', department: '' });
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Issues Reported by Me
            </Typography>
            <Filter filter={filter} setFilter={setFilter} applyFilter={applyFilter} clearFilter={clearFilter} />
          </Box>
          <Grid container spacing={3}>
            {myIssues.length > 0 ? (
              myIssues.map(issue => (
                <Grid item xs={12} sm={6} md={4} key={issue.id}>
                  <IssueCard issue={issue.data} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" component="p">
                No issues reported by you.
              </Typography>
            )}
          </Grid>

          <Typography variant="h4" component="div" mt={4}>
            Issues Reported by Others
          </Typography>
          <Grid container spacing={3}>
            {otherIssues.length > 0 ? (
              otherIssues.map(issue => (
                <Grid item xs={12} sm={6} md={4} key={issue.id}>
                  <IssueCard issue={issue.data} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" component="p">
                No issues reported by others.
              </Typography>
            )}
          </Grid>
        </div>
      )}
    </>
  );
};

IssueSections.propTypes = {
  filter: PropTypes.object,
};

export default IssueSections;
