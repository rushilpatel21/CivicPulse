import { useState } from 'react';
import { Button, Modal, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import FilterListIcon from '@mui/icons-material/FilterList';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Filter = ({ filter, setFilter, applyFilter, clearFilter }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleApplyFilter = () => {
    applyFilter();
    handleClose();
  };

  const handleClearFilter = () => {
    clearFilter();
    handleClose();
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen} startIcon={<FilterListIcon />}>
        Filter
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Severity</InputLabel>
            <Select name="severity" label="Severity" value={filter.severity} onChange={handleChange}>
              <MenuItem value="">No Filter</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Department</InputLabel>
            <Select name="department" label="Department" value={filter.department} onChange={handleChange}>
              <MenuItem value="">No Filter</MenuItem>
              <MenuItem value="Road">Road</MenuItem>
              <MenuItem value="Garden">Garden</MenuItem>
              <MenuItem value="Electricity">Electricity</MenuItem>
              <MenuItem value="Drainage">Drainage</MenuItem>
              <MenuItem value="Health & Hygiene">Health & Hygiene</MenuItem>
              <MenuItem value="Smart Toilet">Smart Toilet</MenuItem>
              <MenuItem value="Water">Water</MenuItem>
              <MenuItem value="Animals">Animals</MenuItem>
              <MenuItem value="Others">Others</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Progress</InputLabel>
            <Select name="progress" label="Progress" value={filter.progress} onChange={handleChange}>
              <MenuItem value={0}>No Filter</MenuItem>
              <MenuItem value={1}>Issue Submitted</MenuItem>
              <MenuItem value={2}>In Progress</MenuItem>
              <MenuItem value={3}>Issue Resolved</MenuItem>
            </Select>
          </FormControl>
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" onClick={handleApplyFilter}>
              Apply
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleClearFilter}>
              Clear
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

Filter.propTypes = {
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
  applyFilter: PropTypes.func.isRequired,
  clearFilter: PropTypes.func.isRequired,
};

export default Filter;
