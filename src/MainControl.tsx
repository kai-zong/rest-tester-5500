import React, { useState } from 'react';
import { Box, Button, Paper, Stack, TextField, Typography, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import axios from 'axios';

/**
 * MainControl component manages CRUD operations and test execution for user-related endpoints.
 * It provides a UI for selecting endpoints, performing CRUD operations, and running test suites.
 */
const MainControl: React.FC = () => {
    // State variables to manage different endpoints and user data
    const [endpoint1, setEndpoint1] = useState('5001');
    const [endpoint2, setEndpoint2] = useState('5002');
    const [endpoint3, setEndpoint3] = useState('5003'); // CHANGEME to reflect the port number of the third endpoint
    const [endpoint4, setEndpoint4] = useState('5004'); // CHANGEME to reflect the port number of the fourth endpoint
    const [selectedEndpoint, setSelectedEndpoint] = useState('endpoint1');
    const [jsonResult, setJsonResult] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [hoursToAdd, setHoursToAdd] = useState('');
    const [testName, setTestName] = useState('');
    const [testWait, setTestWait] = useState(100); // Default wait time for tests
    const [isRunningTests, setIsRunningTests] = useState(false);

    /**
     * Returns the base URL for the selected endpoint.
     * If the selected endpoint is not provided, it alerts the user.
     * @returns {string} Base URL for the selected endpoint.
     */
    const getBaseUrl = (): string => {
        let port = '';

        // Determine which port to use based on selectedEndpoint
        switch (selectedEndpoint) {
            case 'endpoint1':
                if (!endpoint1) {
                    alert('Please provide an endpoint');
                    return '';
                }
                port = endpoint1;
                break;
            case 'endpoint2':
                if (!endpoint2) {
                    alert('Please provide an endpoint');
                    return '';
                }
                port = endpoint2;
                break;
            case 'endpoint3':
                if (!endpoint3) {
                    alert('Please provide an endpoint');
                    return '';
                }
                port = endpoint3;
                break;
            case 'endpoint4':
                if (!endpoint4) {
                    alert('Please provide an endpoint');
                    return '';
                }
                port = endpoint4;
                break;
            default:
                alert('Please provide an endpoint');
                return '';
        }

        const baseUrl = `http://localhost:${port}`;
        return baseUrl;
    };

    let resultTmp = '';

    /**
     * Handles CRUD operations for the user endpoints.
     * @param {string} method - The HTTP method to perform (GET_ALL, POST, PUT, DELETE, etc.).
     * @param {number} id - The user ID (optional, default is 0).
     * @param {string} name - The user name (optional).
     * @param {number} hours - Hours to add (optional, default is -1).
     * @param {boolean} checkWithUser - Whether to ask the user for confirmation before certain operations.
     */
    const handleCrudOperation = async (method: string, id: number = 0, name: string = '', hours: number = -1, checkWithUser: boolean = false) => {
        const baseUrl = getBaseUrl();
        if (!baseUrl) return;

        // Fallback to state values if parameters are not provided
        if (id === 0) id = Number(userId);
        if (name === '') name = userName;
        if (hours === -1) hours = Number(hoursToAdd);

        try {
            let response;
            // Switch case to handle different HTTP methods
            switch (method) {
                case 'GET_ALL':
                    response = await axios.get(`${baseUrl}/users`);
                    break;
                case 'DELETE_ALL':
                    if (checkWithUser && !window.confirm('Are you sure you want to delete all users?')) {
                        return;
                    }
                    response = await axios.delete(`${baseUrl}/users`);
                    break;
                case 'GET':
                    response = await axios.get(`${baseUrl}/users/${id}`);
                    break;
                case 'POST':
                    response = await axios.post(`${baseUrl}/users`, { name: name });
                    break;
                case 'PUT':
                    response = await axios.put(`${baseUrl}/users/${id}`, { name: name });
                    break;
                case 'PATCH':
                    response = await axios.patch(`${baseUrl}/users/${id}`, { hoursToAdd: Number(hours) });
                    break;
                case 'DELETE':
                    if (checkWithUser && !window.confirm('Are you sure you want to delete user?')) {
                        return;
                    }
                    response = await axios.delete(`${baseUrl}/users/${id}`);
                    break;
                default:
                    throw new Error('Unsupported operation');
            }
            // Format the response data as JSON and update state
            const jsonTmp = JSON.stringify(response.data, null, 2);
            console.log(jsonTmp);
            resultTmp = jsonTmp;
            setJsonResult(jsonTmp);
        } catch (error) {
            const err = error as any;
            setJsonResult(`Error: ${err.response ? err.response.data : err.message}`);
        }
    };

    /**
     * Adds a delay in the execution.
     * @param {number} ms - The number of milliseconds to wait.
     * @returns {Promise<void>} A promise that resolves after the delay.
     */
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    /**
     * Runs a single test by performing a CRUD operation and comparing the result with expected values.
     * @param {string} testName - Name of the test.
     * @param {string} operation - CRUD operation to perform.
     * @param {number} id - User ID for the operation.
     * @param {string} name - User name for the operation.
     * @param {number} hours - Hours to add for the operation.
     * @param {string} expected - Expected result string.
     * @param {string} notExpected - A result string that should not be found.
     */
    const runTest = async (testName: string, operation: string, id: number, name: string, hours: number, expected: string = '', notExpected: string = '') => {
        if (expected === '' && notExpected === '') {
            alert('Please provide expected or notExpected value');
            return;
        }
        if (expected !== '' && notExpected !== '') {
            alert('Please provide either expected or notExpected value, not both');
            return;
        }

        setTestName(testName);
        await handleCrudOperation(operation, id, name, hours);

        // Verify the result
        if (expected !== '' && !resultTmp.includes(expected)) {
            alert(`Failed test ${testName}: Expected ${expected} but got ${resultTmp}`);
        }
        if (notExpected !== '' && resultTmp.includes(notExpected)) {
            alert(`Failed test ${testName}: Not expecting ${notExpected} but got ${resultTmp}`);
        }
        await delay(testWait);
    };

    /**
     * Runs a suite of tests in sequence.
     * It includes operations like adding, updating, and deleting users.
     */
    const runTestSuite = async () => {
        setIsRunningTests(true);
        const baseUrl = getBaseUrl();
        if (!baseUrl) {
            setIsRunningTests(false);
            return;
        }

        try {
            await runTest('DELETE ALL USERS', 'DELETE_ALL', 0, '', 0, '[]');
            await runTest('GET ALL USERS', 'GET_ALL', 0, '', 0, '[]');
            await runTest('ADD USER', 'POST', 0, 'Test User', 0, 'Test User');
            await runTest('GET USER', 'GET', 1, '', 0, 'Test User');
            await runTest('ADD USER', 'POST', 0, 'Another User', 0, 'Another User');
            await runTest('UPDATE USER', 'PUT', 1, 'Updated User', 0, 'Updated User');
            await runTest('ADD HOURS', 'PATCH', 1, '', 5, '5');

            // Add 10 users
            for (let i = 0; i < 10; i++) {
                await runTest('ADD USER', 'POST', 0, `User ${i}`, 0, `User ${i}`);
            }

            // Check that the 10th user is in the list
            await runTest('GET ALL USERS', 'GET_ALL', 0, '', 0, 'User 9');

            // Test DELETE returns the deleted user
            await runTest('DELETE USER', 'DELETE', 12, '', 0, 'User 9');

            // Test DELETE has actually deleted the user
            await runTest('GET ALL USERS', 'GET_ALL', 0, '', 0, 'User 8');

            setTestName('Test Suite Completed');
        } catch (error) {
            const err = error as any;
            setJsonResult(`Error: ${err.response ? err.response.data : err.message}`);
        }
        setIsRunningTests(false);
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Stack direction="row" spacing={3}>
                <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                    <Typography variant="h6">Endpoints</Typography>
                    <RadioGroup
                        value={selectedEndpoint}
                        onChange={(e) => setSelectedEndpoint(e.target.value)}
                    >
                        {/* Radio buttons for selecting endpoints */}
                        <Stack direction="row" alignItems="center">
                            <FormControlLabel value="endpoint1" control={<Radio />} label="Typescript" />
                            <TextField
                                label="Typescript Port"
                                value={endpoint1}
                                onChange={(e) => setEndpoint1(e.target.value)}
                                fullWidth
                                margin="normal"
                                slotProps={{
                                    input: {
                                        readOnly: true
                                    }
                                }}
                            />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormControlLabel value="endpoint2" control={<Radio />} label="Python" />
                            <TextField
                                label="Python Port"
                                value={endpoint2}
                                onChange={(e) => setEndpoint2(e.target.value)}
                                fullWidth
                                margin="normal"
                                slotProps={{
                                    input: {
                                        readOnly: true
                                    }
                                }}
                            />
                        </Stack>
                        {/* Additional endpoints  change the names below. CHANGEME */}
                        <Stack direction="row" alignItems="center">
                            <FormControlLabel value="endpoint3" control={<Radio />} label="Go" />
                            <TextField
                                label="Go"
                                value={endpoint3}
                                onChange={(e) => setEndpoint3(e.target.value)}
                                fullWidth
                                margin="normal"

                            />
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <FormControlLabel value="endpoint4" control={<Radio />} label="Endpoint 4" />
                            <TextField
                                label="5004"
                                value={endpoint4}
                                onChange={(e) => setEndpoint4(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                        </Stack>
                    </RadioGroup>

                    {/* Test suite controls */}
                    <Typography variant="h6">Test Manager</Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        {isRunningTests ? (
                            <Button variant="contained" color="primary" onClick={() => setIsRunningTests(false)}>
                                STOP TEST SUITE
                            </Button>
                        ) : (
                            <Button variant="contained" color="primary" onClick={runTestSuite}>
                                RUN TEST SUITE
                            </Button>
                        )}
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h6">Current Test: {testName}</Typography>
                    </Stack>
                </Paper>

                {/* CRUD Operations controls */}
                <Paper elevation={3} sx={{ padding: 2, flex: 1 }}>
                    <Typography variant="h6">CRUD Operations</Typography>
                    <Stack spacing={2}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('GET_ALL')}>
                                GET ALL USERS
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('DELETE_ALL', 0, '', 0, true)}>
                                DELETE ALL USERS
                            </Button>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('GET')}>
                                GET USER
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('POST')}>
                                ADD USER
                            </Button>
                            <TextField
                                label="User Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('PUT')}>
                                UPDATE USER
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="User Name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="primary" onClick={() => handleCrudOperation('PATCH')}>
                                ADD HOURS
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                            <TextField
                                label="Hours to Add"
                                value={hoursToAdd}
                                onChange={(e) => setHoursToAdd(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" color="secondary" onClick={() => handleCrudOperation('DELETE', 0, '', 0, true)}>
                                DELETE USER
                            </Button>
                            <TextField
                                label="User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                margin="normal"
                            />
                        </Stack>
                    </Stack>
                </Paper>

                {/* JSON results display */}
                <Paper elevation={3} sx={{ padding: 2, flex: 1, maxHeight: 600, overflow: 'auto' }}>
                    <Typography variant="h6">JSON Results</Typography>
                    <pre>{jsonResult}</pre>
                </Paper>
            </Stack>
        </Box>
    );
};

export default MainControl;
