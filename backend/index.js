const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { Gateway, Wallets } = require('fabric-network');
const bodyParser = require('body-parser');
const config = require('./config.json');
const app = express();
const port = process.env.PORT || 4001;
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT'], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials
  }));

// Use environment variables or defaults for connection
const PEER_HOST = process.env.PEER_HOST || 'localhost';
const PEER_PORT = process.env.PEER_PORT || '7051';
const CA_HOST = process.env.CA_HOST || 'localhost';
const CA_PORT = process.env.CA_PORT || '7054';

app.use(cors());
app.use(express.json());

async function connectToNetwork() {
    try {
        const ccpPath = path.resolve(__dirname, config.connectionProfilePath);
        console.log("Connection Profile Path:", ccpPath);
        
        const rawCCP = fs.readFileSync(ccpPath, 'utf8');
        console.log("Raw connection profile (first 100 chars):", rawCCP.substring(0, 100));
        
        const ccp = JSON.parse(rawCCP);
        console.log("Successfully parsed connection profile");

        const walletPath = path.join(__dirname, config.walletPath);
        console.log("Wallet Path:", walletPath);
        
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const gateway = new Gateway();
        
        await gateway.connect(ccp, { 
            wallet, 
            identity: 'admin',
            discovery: { enabled: false, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                endorseTimeout: 30
            }
        });

        console.log('Gateway connected, getting network...');
        const network = await gateway.getNetwork(config.channelName);
        console.log('Got network, getting contract...');
        const contract = network.getContract(config.chaincodeName);
        console.log('Got contract');

        return { gateway, contract };
    } catch (error) {
        console.error("Error in connectToNetwork:", error);
        throw error;
    }
}

// Add new evidence
app.post('/api/evidence', async (req, res) => {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    try {
        const { Name, Type, ID, GroupID, Location, Source, CID, Timestamp } = req.body;
        console.log('Evidence is being linked to Group ID:', GroupID);

        const { contract } = await connectToNetwork();
        console.log('Successfully connected to network');

        const args = [Name, Type, ID, Source, Location, Timestamp, CID, GroupID];
        console.log('Submitting transaction with args:', JSON.stringify(args, null, 2));

        try {
            const result = await contract.submitTransaction('CreateEvidence', ...args);
            console.log('Transaction submitted successfully. Result:', result.toString());
            res.json({ success: true, message: 'Evidence created successfully', txId: result.toString() });
        } catch (submitError) {
            console.error('Error in contract.submitTransaction:', submitError);
            console.error('Error details:', JSON.stringify(submitError, null, 2));
            throw submitError;
        }
    } catch (error) {
        console.error('Failed to create evidence:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/api/report', async (req, res) => {
    try {
        console.log('Received request:', req.body); // Log to check if GroupID is received

        const { Name, Type, Timestamp, CID, GroupID } = req.body;

        if (!Name || !Type ||  !Timestamp || !CID || !GroupID) {
            throw new Error('Missing required fields');
        }

        console.log('Report is being linked to Group ID:', GroupID); // Check this log

        res.json({ success: true, message: 'Report added successfully', data: req.body });
    } catch (error) {
        console.error('Failed to report:', error);
        res.status(500).json({ error: error.message });
    }
});


app.post('/api/record-request', (req, res) => {
    const { evidenceId, userId, timestamp} = req.body;
  
    // Log the request (for now, since blockchain isn't connected)
    console.log('Received request to record evidence access:', { evidenceId, userId, timestamp});
  
    // Simulate a successful response
    res.json({ success: true, message: 'Request recorded successfully' });
  });
  
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Make sure your Fabric network is running and the connection profile is correct`);
}); 
