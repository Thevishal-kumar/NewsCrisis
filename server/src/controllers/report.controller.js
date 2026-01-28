import Report from '../models/report.models.js';
import axios from 'axios'; 

const VOTE_THRESHOLD = 1;
const runMLModel = async (text) => {
    try {
        // This talks to the terminal running 'python ml_server.py'
        const response = await axios.post('http://127.0.0.1:5000/predict', {
            text: text
        });

        // Return the data exactly as Python sent it ({ label: '...', score: ... })
        return response.data; 

    } catch (error) {
        console.error("ML Server Error:", error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.error("CRITICAL: Is 'ml_server.py' running? Connection refused.");
        }
        
        return { label: 'Unverified', score: 0 };
    }
};

export const createReport = async (req, res) => {
    try {
        const { url, text, submittedBy } = req.body;
        const inputContent = text || url;

        if (!inputContent) {
            return res.status(400).json({ error: 'Please provide text or a URL to analyze.' });
        }

        // Check for duplicates
        const existingReport = await Report.findOne({ source: inputContent });
        if (existingReport) {
            console.log(`Returning existing report.`);
            return res.status(200).json(existingReport);
        }

        // console.log(`[ML] Analyzing: "${inputContent.substring(0, 30)}..."`);

        // RUN ML MODEL (Fast Way)
        const mlResult = await runMLModel(inputContent);
        
        // console.log("[ML] Result received:", mlResult); 

        // SAVE TO DB
        const newReport = await Report.create({
            sourceType: url ? 'url' : 'text',
            source: inputContent,
            label: mlResult.label || 'Unverified', 
            score: mlResult.score || 0,
            submittedBy: submittedBy || 'Anonymous',
            status: 'pending',     
            approveVotes: 0,
            rejectVotes: 0,
            votedBy: []
        });

        res.status(201).json(newReport);

    } catch (error) {
        console.error("Error processing report:", error);
        res.status(500).json({ error: 'Server error during analysis.' });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({}).sort({ createdAt: -1 });
        res.status(200).json({ items: reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: 'Server error: Could not fetch reports.' });
    }
};

export const castVote = async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType, userId } = req.body; 
        
        const report = await Report.findById(id);

        if (!report) return res.status(404).json({ error: 'Report not found.' });
        
        if (report.votedBy && report.votedBy.includes(userId)) {
            return res.status(400).json({ error: 'You have already voted on this item.' });
        }

        if (voteType === 'approve') report.approveVotes += 1;
        else if (voteType === 'reject') report.rejectVotes += 1;
        
        report.votedBy.push(userId);

        const totalVotes = report.approveVotes + report.rejectVotes;
        if (totalVotes >= VOTE_THRESHOLD) {
            report.status = report.approveVotes > report.rejectVotes ? 'approved' : 'rejected';
        }

        await report.save();
        res.status(200).json(report);

    } catch (error) {
        console.error("Error casting vote:", error);
        res.status(500).json({ error: 'Server error while casting vote.' });
    }
};