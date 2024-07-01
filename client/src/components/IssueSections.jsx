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
    progress: 0,
  });

  const [filterSelf, setFilterSelf] = useState({
    distance: '',
    severity: '',
    department: '',
    progress: 0,
  });

  const userId = auth.currentUser.uid;

  useEffect(() => {
    try{
      const fetchIssues = async () => {
        const allIssues = await getIssues();
        const myIssues = await getIssuesById(userId);
        setOtherIssues(allIssues.filter(issue => issue.data.user !== userId));
        setMyIssues(myIssues);
        console.log(allIssues);
        setLoading(false);
      };
      fetchIssues();
    }catch (e) {
      console.log(e.message);
    }finally{
      setLoading(false);
    }
  }, [userId]);

  const applyFilter = async () => {
    console.log('Applying filter:', filter);
    let allIssues = await getIssues();
    allIssues = allIssues.filter(issue => issue.data.user !== userId);
    if(filter.severity){
      allIssues = allIssues.filter(issue => issue.data.severity === filter.severity);
    }
    if(filter.department){
      allIssues = allIssues.filter(issue => issue.data.department === filter.department);
    }
    if(filter.progress > 0){
      allIssues = allIssues.filter(issue => issue.data.progress === filter.progress);
    }
    setOtherIssues(allIssues);
  };

  const clearFilter = async () => {
    setFilterSelf({ distance: '', severity: '', department: '', progress: 0});
    const allIssues = await getIssues();
    setOtherIssues(allIssues.filter(issue => issue.data.user !== userId));
  };

  const applyFilterSelf = async () => {
    console.log('Applying filter:', filter);
    let myIssuesLocal = await getIssuesById(userId);
    console.log(myIssuesLocal);
    if(filterSelf.severity){
      myIssuesLocal = myIssuesLocal.filter(issue => issue.data.severity === filterSelf.severity);
      console.log(`Stage 1: ${myIssuesLocal}`);
    }
    if(filterSelf.department){
      myIssuesLocal = myIssuesLocal.filter(issue => issue.data.department === filterSelf.department);
      console.log(`Stage 2: ${myIssuesLocal}`);
    }
    if(filterSelf.progress > 0){
      myIssuesLocal = myIssuesLocal.filter(issue => issue.data.progress === filterSelf.progress);
      console.log(`Stage 3: ${myIssuesLocal}`);
    }
    console.log(`Stage 4: ${myIssuesLocal}`);
    setMyIssues(myIssuesLocal);
  };

  const clearFilterSelf = async () => {
    setFilterSelf({ distance: '', severity: '', department: '', progress: 0});
    const myIssuesLocal = await getIssuesById(userId);
    setMyIssues(myIssuesLocal);
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
            <Filter filter={filterSelf} setFilter={setFilterSelf} applyFilter={applyFilterSelf} clearFilter={clearFilterSelf} />
          </Box>
          <Grid container spacing={3}>
            {myIssues.length > 0 ? (
              myIssues.map(issue => (
                <Grid item xs={12} sm={6} md={4} key={issue.id}>
                  <IssueCard issue={issue.data} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
                No issues reported by you.
              </Typography>
            )}
          </Grid>

          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Issues Reported by Others
            </Typography>
            <Filter filter={filter} setFilter={setFilter} applyFilter={applyFilter} clearFilter={clearFilter} />
          </Box>
          <Grid container spacing={3}>
            {otherIssues.length > 0 ? (
              otherIssues.map(issue => (
                <Grid item xs={12} sm={6} md={4} key={issue.id}>
                  <IssueCard issue={issue.data} />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
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
