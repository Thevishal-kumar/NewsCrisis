import Report from '../models/report.models.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
const VOTE_THRESHOLD = 1; 

// Helper to get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RUN PYTHON SCRIPT
const runMLModel = (text) => {
    return new Promise((resolve, reject) => {
        // 1. Path to your python script (Adjust 'ml_model' to your actual folder name if different)
        // Assuming structure: /backend/controllers/.. /ml_model/predict.py
        const scriptPath = path.join(__dirname, '../ml/predict.py'); 
        
        // 2. Spawn Python process
        const pythonProcess = spawn('python', [scriptPath, text]);

        let dataString = '';
        let errorString = '';

        // 3. Collect data from stdout
        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        // 4. Collect errors from stderr
        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        // 5. Handle process close
        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python script exited with code ${code}: ${errorString}`);
                return reject(new Error('ML Model execution failed'));
            }

            try {
                // 6. Parse the JSON result from Python
                const result = JSON.parse(dataString);
                if (result.error) {
                    reject(new Error(result.error));
                } else {
                    resolve(result);
                }
            } catch (err) {
                console.error("Failed to parse Python output:", dataString);
                reject(new Error('Invalid JSON from ML model'));
            }
        });
    });
};

/**
 * @desc    Create a new report (AND RUN ML ANALYSIS)
 * @route   POST /api/v1/verify
 * @access  Public
 */
export const createReport = async (req, res) => {
    try {
        const { url, text, submittedBy } = req.body;
        const inputContent = text || url;

        if (!inputContent) {
            return res.status(400).json({ error: 'Please provide text or a URL to analyze.' });
        }

        console.log(`Analyzing content: "${inputContent.substring(0, 50)}..."`);

        // --- STEP 1: RUN ML MODEL ---
        const mlResult = await runMLModel(inputContent);
        
        console.log("ML Result:", mlResult); // { label: 'Fake', score: 85.5 }

        // --- STEP 2: SAVE TO DB ---
        const newReport = await Report.create({
            sourceType: url ? 'url' : 'text',
            source: inputContent,
            label: mlResult.label, // 'Real' or 'Fake' from Python
            score: mlResult.score, // Confidence score from Python
            submittedBy: submittedBy || 'Anonymous',
            status: 'pending',     // Default status
            approveVotes: 0,
            rejectVotes: 0
        });

        res.status(201).json(newReport);

    } catch (error) {
        console.error("Error processing report:", error);
        res.status(500).json({ error: 'Server error during analysis.' });
    }
};

/**
 * @desc    Get all reports
 * @route   GET /api/v1/reports
 */
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({}).sort({ createdAt: -1 });
        res.status(200).json({ items: reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ error: 'Server error: Could not fetch reports.' });
    }
};

/**
 * @desc    Cast a vote
 * @route   POST /api/v1/reports/:id/vote
 */
export const castVote = async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType, userId } = req.body; 
        
        const report = await Report.findById(id);

        if (!report) return res.status(404).json({ error: 'Report not found.' });
        if (report.status !== 'pending') return res.status(400).json({ error: 'Report already finalized.' });
        if (report.votedBy.includes(userId)) return res.status(400).json({ error: 'You have already voted.' });

        // Update votes
        if (voteType === 'approve') report.approveVotes += 1;
        else if (voteType === 'reject') report.rejectVotes += 1;
        
        report.votedBy.push(userId);

        // Check Threshold
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