import { useState } from 'react';
import { Typography, TextField, MenuItem, Button, Box, FormControl, InputLabel, Select } from '@mui/material';
import { storage } from '../components/firebase.jsx';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { SwalSuccess, SwalError } from '../helper/swal.js';
import Loader from '../components/loader.jsx';
import { bugReportApi } from '../helper/api.js';

const ReportBug = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [severity, setSeverity] = useState('');
  const [attachments, setAttachments] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !steps || !expected || !actual || !severity) {
      toast.error('All fields are required.', {
        position: "bottom-center",
      });
      return;
    }

    setIsLoading(true);

    try {
      let downloadURL = '';
      if (attachments) {
        const storageRef = ref(storage, `bugs/attachments/${attachments.name}`);
        await uploadBytes(storageRef, attachments);
        downloadURL = await getDownloadURL(storageRef);
      }

      const bugReport = {
        title,
        description, 
        steps,
        expected,
        actual,
        severity,
        imageURL: downloadURL,
      };

      console.log('Bug report submitted:', bugReport);
      await bugReportApi(bugReport);
      setTitle('');
      setDescription('');
      setSteps('');
      setExpected('');
      setActual('');
      setSeverity('');
      setAttachments(null);
      SwalSuccess();
    } catch (error) {
      console.error('Error submitting bug report:', error);
      SwalError();
    }

    setIsLoading(false);
  };

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file && /^image\/(png|jpeg|webp|heic|heif)$/.test(file.type)) {
      setAttachments(file);
    } else {
      toast.error('Invalid file type. Please select an image (PNG, JPEG, WEBP, HEIC, HEIF).', {
        position: "bottom-center",
      });
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Box
        className="container"
        component="form"
        onSubmit={handleSubmit}
        sx={{marginTop:6 ,p: 3, bgcolor: 'background.paper', borderRadius: 3, boxShadow: 3, width: { sm: 500, md: 600, lg:800 } }}
      >
        <Typography variant="h4" gutterBottom>
          Report a Bug
        </Typography>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Steps to Reproduce"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Expected Behavior"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            label="Actual Behavior"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="severity-label">Severity</InputLabel>
          <Select
            labelId="severity-label"
            label="Severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <MenuItem value=""><em>Select severity</em></MenuItem>
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            type="file"
            label="Attachments"
            InputLabelProps={{ shrink: true }}
            inputProps={{ accept: "image/png, image/jpeg, image/webp, image/heic, image/heif" }}
            fullWidth
            onChange={handleAttachmentChange}
          />
        </FormControl>
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ReportBug;
