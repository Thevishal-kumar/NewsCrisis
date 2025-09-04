import { Router } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Report from '../models/report.models.js';

const router = Router();

// POST /api/v1/verify
router.post("/", (req, res) => {
    const { url, text, submittedBy } = req.body;
    const contentToAnalyze = url || text;

    if (!contentToAnalyze) {
        return res.status(400).json({ error: 'No URL or text provided' });
    }

    // --- ROBUST PATH CALCULATION ---
    // This calculates the correct path from this file to your project root and then down to the ml script.
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // From this file's directory (.../server/src/routes), go up three levels to the project root,
    // then navigate down into the 'ml' folder.
    const pythonScriptPath = path.resolve(__dirname, '../../../ml/predict.py');

    console.log(`Attempting to execute Python script at: ${pythonScriptPath}`);

    // --- FILE EXISTENCE CHECK ---
    // This synchronous check confirms the file exists before spawning a process.
    try {
        fs.accessSync(pythonScriptPath);
    } catch (e) {
        console.error(`ERROR: Python script not found at the specified path: ${pythonScriptPath}`);
        return res.status(500).json({
            error: 'Server Configuration Error: Python script not found.',
            details: `The server could not locate the required analysis script. Please check the server configuration. Path tried: ${pythonScriptPath}`
        });
    }

    // Use 'python3' as it's often more reliable. If that fails, change to 'python'.
    const pythonProcess = spawn('python', [pythonScriptPath, contentToAnalyze]);

    let resultData = '';
    let errorData = '';

    // Listen for data from the Python script's standard output
    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    // Listen for any errors from the Python script
    pythonProcess.stderr.on('data', (data) => {
        errorData += data.toString();
        console.error(`Python Script Error (stderr): ${data.toString()}`);
    });

    // Handle the script exit event
    pythonProcess.on('close', async (code) => {
        if (code !== 0) {
            console.error(`Python script exited with error code ${code}. Details: ${errorData}`);
            return res.status(500).json({
                error: 'Failed to analyze content due to a script error.',
                details: errorData || `The analysis script exited with a non-zero status code: ${code}`
            });
        }

        try {
            // It's possible the script output is captured before 'close' fires completely.
            if (!resultData) {
                throw new Error("Received no data from the analysis script.");
            }
            
            const result = JSON.parse(resultData);

            if (result.error) {
                console.error(`ML model returned an error: ${result.error}`);
                return res.status(500).json({ error: 'ML model processing error.', details: result.error });
            }

            // Save the successful analysis report to the database
            const newReport = await Report.create({
                sourceType: url ? 'url' : 'text',
                source: contentToAnalyze,
                label: result.label,
                score: result.score,
                submittedBy: submittedBy || 'unknown'
            });

            res.status(201).json(newReport);

        } catch (e) {
            console.error('Error parsing JSON from Python or saving to DB:', e.message);
            res.status(500).json({
                error: 'Failed to parse the analysis result or save it to the database.',
                details: e.message,
                rawDataFromScript: resultData
            });
        }
    });

    // Handle critical spawn errors (e.g., if the 'python' command itself is not found)
    pythonProcess.on('error', (err) => {
        console.error('Failed to start Python subprocess.', err);
        res.status(500).json({
            error: 'Failed to start the analysis process.',
            details: `Could not spawn the child process. Ensure 'python' is installed and available in the system's PATH. Error: ${err.message}`
        });
    });
});

export default router;
