import Report from '../models/report.models.js';

const VOTE_THRESHOLD = 10; 

/**
 * @desc    Get all reports from the database
 * @route   GET /api/v1/reports
 * @access  Public
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
 * @desc    Create a new report (used by your analysis/verify endpoint)
 * @route   POST /api/v1/reports/verify
 * @access  Public
 */
export const createReport = async (req, res) => {
    try {
        const { sourceType, source, label, score } = req.body;

        if (!sourceType || !source || !label || score === undefined) {
            return res.status(400).json({ error: 'Missing required fields for report creation.' });
        }
        
        const newReport = await Report.create({
            sourceType,
            source,
            label,
            score,
            
        });

        res.status(201).json(newReport);
    } catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ error: 'Server error while creating report.' });
    }
};

/**
 * @desc    Cast a vote on a specific report
 * @route   POST /api/v1/reports/:id/vote
 * @access  Public (should be protected in a real application)
 */
export const castVote = async (req, res) => {
    try {
        const { id } = req.params;
        const { voteType } = req.body; 
        const userId = req.ip; 
        const report = await Report.findById(id);

        if (!report) {
            return res.status(404).json({ error: 'Report not found.' });
        }

        if (report.status !== 'pending') {
            return res.status(400).json({ error: 'This report has already been finalized.' });
        }

        // Prevent a user from voting twice on the same report
        if (report.votedBy.includes(userId)) {
            return res.status(400).json({ error: 'You have already voted on this item.' });
        }

        // Increment the appropriate vote count
        if (voteType === 'approve') {
            report.approveVotes += 1;
        } else if (voteType === 'reject') {
            report.rejectVotes += 1;
        } else {
            return res.status(400).json({ error: 'Invalid vote type specified.' });
        }
        
        report.votedBy.push(userId);

        // Check if the voting threshold has been met
        const totalVotes = report.approveVotes + report.rejectVotes;
        if (totalVotes >= VOTE_THRESHOLD) {
            // Finalize the status based on which side has more votes
            report.status = report.approveVotes > report.rejectVotes ? 'approved' : 'rejected';
        }

        await report.save();

        res.status(200).json(report); // Send back the updated report

    } catch (error) {
        console.error("Error casting vote:", error);
        res.status(500).json({ error: 'Server error while casting vote.' });
    }
};