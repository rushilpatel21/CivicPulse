import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import PropTypes from 'prop-types';
import CustomizedSteppers from '../helper/progressBar.jsx';

const IssueCard = ({ issue }) => {
  const { severity, tags, photoUrl, location, department, progress, user, date } = issue;

  console.log('Issue Data:', issue);

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{location}</Typography>
          <Typography variant="body2" color="textSecondary">
            {severity}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', marginY: 2 }}>
          <img src={photoUrl} alt="Issue" style={{ width: '100%', maxHeight: '200px' }} />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginY: 1 }}>
          {tags.split(',').map((tag, index) => (
            <Chip key={index} label={tag} />
          ))}
        </Box>
        <CustomizedSteppers prog={progress} />
        <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', marginY: 1 }}>
          {location}
        </Typography>
      </CardContent>
    </Card>
  );
};

IssueCard.propTypes = {
  issue: PropTypes.shape({
    date: PropTypes.shape({
      _seconds: PropTypes.number.isRequired,
      _nanoseconds: PropTypes.number.isRequired,
    }).isRequired,
    department: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    photoUrl: PropTypes.string.isRequired,
    progress: PropTypes.number.isRequired,
    severity: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    user: PropTypes.string.isRequired,
  }).isRequired,
};

export default IssueCard;
