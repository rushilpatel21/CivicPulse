import { useEffect, useState } from 'react';
import { getIssuesByDepartment, updateIssueProgress, deleteIssueById } from '../helper/api.js'; 
import { Card, CardContent, Typography, Chip, Box, MenuItem, Select, Button } from '@mui/material';
import PropTypes from 'prop-types';
import CustomizedSteppers from '../helper/progressBar.jsx';

const severityColors = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
};

const ShowIssue = ({ department }) => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const issuesByDept = await getIssuesByDepartment(department);
        setIssues(issuesByDept);
      } catch (error) {
        console.error("Error fetching issues: ", error);
      }
    };
    fetchIssues();
  }, [department]);

  const handleProgressChange = async (issueId, newProgress) => {
    try {
      await updateIssueProgress(issueId, newProgress);
      setIssues(issues.map(issue => issue.id === issueId ? { ...issue, progress: newProgress } : issue));
    } catch (error) {
      console.error("Error updating issue progress: ", error);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      await deleteIssueById(issueId);
      setIssues(issues.filter(issue => issue.id !== issueId));
    } catch (error) {
      console.error("Error deleting issue: ", error);
    }
  };

  return (
    <Box>
      {issues.map((issue, index) => (
        <Card key={index} sx={{ marginBottom: 2, borderLeft: `6px solid ${severityColors[issue.severity]}` }}>
          <CardContent sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                  Department: {issue.department}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                  Reported on: {new Date(issue.date._seconds * 1000).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                  Location: {issue.location}
                </Typography>
              </Box>
              <Box sx={{ flex: '1 1 auto', maxWidth: '180px', marginLeft: 2, height: 'auto', maxHeight: '190px', overflow: 'hidden' }}>
                <img src={issue.photoUrl} alt="Issue" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginY: 1 }}>
              {issue.tags.split(',').map((tag, index) => (
                <Chip key={index} label={tag} />
              ))}
            </Box>
          </CardContent>
          <Box sx={{ padding: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CustomizedSteppers prog={issue.progress} />
            <Select
              value={issue.progress}
              onChange={(e) => handleProgressChange(issue.id, e.target.value)}
            >
              <MenuItem value={1}>Issue Submitted</MenuItem>
              <MenuItem value={2}>Viewed by Admin</MenuItem>
              <MenuItem value={3}>Issue Resolved</MenuItem>
            </Select>
            <Button variant="contained" color="error" onClick={() => handleDeleteIssue(issue.id)}>X</Button>
          </Box>
        </Card>
      ))}
    </Box>
  );
};

ShowIssue.propTypes = {
  department: PropTypes.string.isRequired,
};

export default ShowIssue;
