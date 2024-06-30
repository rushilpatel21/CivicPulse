import { useEffect, useState } from 'react';
import { getIssues } from '../helper/api.js'; 
import IssueCard from './IssueCard.jsx'; 
import PropTypes from 'prop-types';

const IssueSections = ({ filter }) => {
  const [issues, setIssues] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [otherIssues, setOtherIssues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      const allIssues = await getIssues();
      console.log('Fetched Issues:', allIssues);
      setIssues(allIssues);

      const userId = 'currentUserId'; 
      setMyIssues(allIssues.filter(issue => issue.data.user === userId));
      setOtherIssues(allIssues.filter(issue => issue.data.user !== userId));
    };

    fetchIssues();
  }, []);

  return (
    <div>
      <h2>Issues Reported by Me</h2>
      {myIssues.length > 0 ? (
        myIssues.map(issue => (
          <IssueCard key={issue.id} issue={issue.data} />
        ))
      ) : (
        <p>No issues reported by you.</p>
      )}
      <h2>Issues Reported by Others</h2>
      {otherIssues.length > 0 ? (
        otherIssues.map(issue => (
          <IssueCard key={issue.id} issue={issue.data} />
        ))
      ) : (
        <p>No issues reported by others.</p>
      )}
    </div>
  );
};

IssueSections.propTypes = {
  filter: PropTypes.object,
};

export default IssueSections;
