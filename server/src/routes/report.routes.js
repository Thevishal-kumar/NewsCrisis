import { Router } from 'express';
import { 
    getAllReports, 
    createReport, 
    castVote 
} from '../controllers/report.controller.js';
 
const router = Router();

// Route to get all reports
router.route("/").get(getAllReports);

// Route to create a new report (this should match your verification endpoint)
router.route("/verify").post(createReport);

// Route to cast a vote on a specific report by its ID
router.route("/:id/vote").post(castVote);

export default router;