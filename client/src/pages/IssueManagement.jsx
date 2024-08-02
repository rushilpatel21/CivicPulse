import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem } from '@mui/material';
import { getIssues, updateIssueProgress, deleteIssueByIssueId } from '../helper/api.js';

const AdminIssueManagement = () => {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState({
        name: '',
        department: '',
        severity: '',
        status: ''
    });

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await getIssues();
            setIssues(response);
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    const applyFilters = async () => {
        let filteredIssues = await getIssues();

        if (filter.name) {
            filteredIssues = filteredIssues.filter(issue => issue.id.toLowerCase().includes(filter.name.toLowerCase()));
        }

        if (filter.department) {
            filteredIssues = filteredIssues.filter(issue => issue.data.department === filter.department);
        }

        if (filter.severity) {
            filteredIssues = filteredIssues.filter(issue => issue.data.severity === filter.severity);
        }

        if (filter.status) {
            filteredIssues = filteredIssues.filter(issue => issue.data.progress === parseInt(filter.status));
        }

        setIssues(filteredIssues);
    };

    const handleDelete = async (id) => {
        try {
            await deleteIssueByIssueId(id);
            fetchIssues();
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateIssueProgress(id, parseInt(newStatus));
            fetchIssues();
        } catch (error) {
            console.error('Error updating issue status:', error);
        }
    };

    return (
        <Paper>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', marginTop: '50px' }}>
                <TextField
                    name="id"
                    label="ID"
                    value={filter.name}
                    onChange={handleFilterChange}
                    variant="outlined"
                    size="small"
                    style={{ marginRight: '10px' }}
                />
                <Select
                    name="department"
                    value={filter.department}
                    onChange={handleFilterChange}
                    displayEmpty
                    size="small"
                    style={{ marginRight: '10px' }}
                >
                    <MenuItem value="">All Departments</MenuItem>
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
                <Select
                    name="severity"
                    value={filter.severity}
                    onChange={handleFilterChange}
                    displayEmpty
                    size="small"
                    style={{ marginRight: '10px' }}
                >
                    <MenuItem value="">All Severities</MenuItem>
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </Select>
                <Select
                    name="status"
                    value={filter.status}
                    onChange={handleFilterChange}
                    displayEmpty
                    size="small"
                    style={{ marginRight: '10px' }}
                >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="1">Open</MenuItem>
                    <MenuItem value="2">In Progress</MenuItem>
                    <MenuItem value="3">Resolved</MenuItem>
                </Select>
                <Button variant="contained" onClick={applyFilters}>Apply Filters</Button>
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Severity</TableCell>
                            <TableCell>Tags</TableCell>
                            <TableCell>Progress</TableCell>
                            <TableCell>Photo</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {issues.map(issue => (
                            <TableRow key={issue.id}>
                                <TableCell>{issue.id}</TableCell>
                                <TableCell>{issue.data.department}</TableCell>
                                <TableCell>{issue.data.severity}</TableCell>
                                <TableCell>{issue.data.tags}</TableCell>
                                <TableCell>
                                    <Select
                                        value={issue.data.progress || ''}
                                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                        sx={{ width: 130, height: 40 }}
                                    >
                                        <MenuItem value="1">Open</MenuItem>
                                        <MenuItem value="2">In Progress</MenuItem>
                                        <MenuItem value="3">Resolved</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <img src={issue.data.photoUrl} alt="Issue" style={{ width: '100px' }} />
                                </TableCell>
                                <TableCell>
                                    <Button color="secondary" onClick={() => handleDelete(issue.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default AdminIssueManagement;
