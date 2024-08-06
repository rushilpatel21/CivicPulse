import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import PropTypes from 'prop-types';
import CustomizedSteppers from '../helper/progressBar.jsx';

const severityColors = {
  low: 'green',
  medium: 'yellow',
  high: 'red',
};

const IssueCard = ({ issue }) => {
  const { severity, tags, photoUrl, location, department, progress, date } = issue;
  const dateObject = new Date(date._seconds * 1000 + date._nanoseconds / 1000000);
  const formattedDate = dateObject.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

  return (
    <Card 
      sx={{ 
        marginBottom: 2, 
        borderLeft: `6px solid ${severityColors[severity]}`,
        height: { xs: '350px', sm: '350px', md: '350px', lg: '350px' },
        minHeight: '300px',
        width: { xs: '100%', sm: '100%', md: '100%', lg: '100%'},
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Department: {department}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Reported on: {formattedDate}
            </Typography>
            <Box sx={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                Location: {location}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ flex: '1 1 auto', maxWidth: '170px', width: '170px', marginLeft: 2, height: '140px', maxHeight: '140px', overflow: 'hidden' }}>
            <img src={photoUrl} alt="Issue" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginY: 1 }}>
          {tags.split(',').map((tag, index) => (
            <Chip key={index} label={tag} />
          ))}
        </Box>
      </CardContent>
      <Box sx={{ padding: 2 }}>
        <CustomizedSteppers prog={progress} />
      </Box>
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
  }).isRequired,
};

export default IssueCard;
