import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Radar from 'radar-sdk-js';

const IssueForm = () => {
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [severity, setSeverity] = useState('');

  useEffect(() => {
    Radar.initialize('prj_test_pk_77365fe4ac12e1c73c9ac314d30a8ae3605433e2');
  }, []);

  const handleSelection = (address) => {
    console.log('Selected address:', address);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleTagsChange = (e) => {
    const value = e.target.value.trim();
    if (e.key === ' ' && value) {
      setTags([...tags, value]);
      setCustomTag('');
    }
  };

  const handleCustomTagChange = (e) => {
    setCustomTag(e.target.value);
  };

  const handleTagDelete = (index) => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  const handleSeverityChange = (e) => {
    setSeverity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ location, photo, tags, severity });
    setLocation('');
    setPhoto(null);
    setTags([]);
    setCustomTag('');
    setSeverity('');
  };

  return (
    <div className="container">
      <h1>Report an Issue</h1>
      <form onSubmit={handleSubmit}>
        {/* <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input type="text" className="form-control" id="location" placeholder="Enter location"
            value={location} onChange={handleLocationChange} required />
        </div> */}
        <Autocomplete onSelection={handleSelection} />
        
        <div className="mb-3 visually-hidden">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className="form-control"
            id="location"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="photo" className="form-label">Upload Photo</label>
          <input type="file" className="form-control" id="photo" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input type="text" className="form-control" id="tags" placeholder="Enter tags"
            value={customTag} onChange={handleCustomTagChange} onKeyDown={handleTagsChange} />
          <small className="form-text text-muted">Separate tags with spaces.</small>
          <div>
            {tags.map((tag, index) => (
              <span key={index} className="badge bg-primary text-light mr-1">
                {tag}
                <button type="button" className="btn-close ms-1" aria-label="Close"
                  onClick={() => handleTagDelete(index)}></button>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="severity" className="form-label">Severity</label>
          <select className="form-select" id="severity" value={severity} onChange={handleSeverityChange} required>
            <option value="">Select severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

const Autocomplete = ({ onSelection }) => {
  useEffect(() => {
    Radar.ui.autocomplete({
      container: 'autocomplete',
      width: '100%',
      onSelection: onSelection,
    });
  }, [onSelection]);

  return (
    <div id="autocomplete" className="autocomplete-container" />
  );
};

Autocomplete.propTypes = {
  onSelection: PropTypes.func.isRequired,
};

export default IssueForm;
