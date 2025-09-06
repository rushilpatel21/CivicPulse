import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, Typography } from '@mui/material';
import { getIssues, updateIssueProgress, deleteIssueByIssueId } from '../helper/api.js';
import Loader from '../components/loader.jsx';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import socketService from '../services/socketService.js';

const IssueManagement = () => {
    const [issues, setIssues] = useState([]);
    const [filter, setFilter] = useState({
        name: '',
        department: '',
        severity: '',
        status: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchIssues();
        
        // Initialize socket connection for real-time updates
        socketService.connect();
        
        // Listen for real-time updates from other users/sessions
        const handleIssueProgressUpdate = (updateData) => {
            console.log('🔄 Received real-time issue update:', updateData);
            // Refresh issues list when someone else makes changes
            fetchIssues();
        };
        
        const handleIssueDeleted = (deletedIssueId) => {
            console.log('🗑️ Issue deleted by another user:', deletedIssueId);
            // Refresh issues list when someone else deletes an issue
            fetchIssues();
        };
        
        // Register socket event listeners
        socketService.onIssueProgressUpdate(handleIssueProgressUpdate);
        socketService.onIssueDeleted(handleIssueDeleted);
        
        // Cleanup function
        return () => {
            socketService.off('issue_progress_updated', handleIssueProgressUpdate);
            socketService.off('issue_deleted', handleIssueDeleted);
            socketService.disconnect();
        };
    }, []);

    const fetchIssues = async () => {
        try {
            setIsLoading(true);
            const response = await getIssues();
            setIssues(response);
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            setIsLoading(false);
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
        try {
            setIsLoading(true);
            let filteredIssues = await getIssues();

            if (filter.name) {
                filteredIssues = filteredIssues.filter(issue => issue.id.toLowerCase().includes(filter.name.toLowerCase()));
            }

            if (filter.location) {
                filteredIssues = filteredIssues.filter(issue => issue.data.location.toLowerCase().includes(filter.location.toLowerCase()));
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
        } catch (error) {
            console.error('Error applying filters:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const MySwal = withReactContent(Swal);

        try {
            const result = await MySwal.fire({
                title: 'Are you sure?',
                text: 'Issue will be Deleted',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it',
                reverseButtons: true
            });
    
            if (result.isConfirmed) {
                setIsLoading(true);
                await deleteIssueByIssueId(id);
                await fetchIssues();
                toast.success("Issue Deleted Successfully", { position: "bottom-center" });
            } else {
                MySwal.fire('Cancelled', 'Issue is safe :)', 'info');
            }
        } catch (error) {
            console.error('Error deleting issue:', error);
            toast.error("Error deleting issue", { position: "bottom-center" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setIsLoading(true);
            await updateIssueProgress(id, parseInt(newStatus));
            fetchIssues();
        } catch (error) {
            console.error('Error updating issue status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <Paper>
            <Typography style={{marginTop: '90px'}} variant="h4" gutterBottom>Issue Management</Typography>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', marginTop: '0px' }}>
                    <TextField
                        name="name"
                        label="ID"
                        value={filter.name}
                        onChange={handleFilterChange}
                        variant="outlined"
                        size="small"
                        style={{ marginRight: '10px' }}
                    />
                    <TextField
                        name="location"
                        label="location"
                        value={filter.location}
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
                                <TableCell>Location</TableCell>
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
                                    <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                        {issue.data.location}
                                    </TableCell>
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
        </>
    );
};

export default IssueManagement;
