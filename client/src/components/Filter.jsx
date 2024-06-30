import { useState } from 'react';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import PropTypes from 'prop-types';

const Filter = ({ onFilter }) => {
  const [filter, setFilter] = useState({
    name: '',
    distance: '',
    severity: '',
    department: '',
  });

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    onFilter(filter);
  };

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel>Name</InputLabel>
        <TextField name="name" value={filter.name} onChange={handleChange} />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Distance</InputLabel>
        <TextField name="distance" value={filter.distance} onChange={handleChange} />
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Severity</InputLabel>
        <Select name="severity" value={filter.severity} onChange={handleChange}>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Department</InputLabel>
        <Select name="department" value={filter.department} onChange={handleChange}>
          <MenuItem value="HR">HR</MenuItem>
          <MenuItem value="IT">IT</MenuItem>
          <MenuItem value="Finance">Finance</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleApplyFilter}>
        Apply Filter
      </Button>
    </div>
  );
};

Filter.propTypes = {
  onFilter: PropTypes.func.isRequired,
};

export default Filter;
