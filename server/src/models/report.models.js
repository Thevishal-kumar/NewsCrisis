import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  sourceType: {
    type: String,
    enum: ['url', 'text'],
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  status: { 
    type: String, 
    default: 'pending' // Can be 'pending', 'approved', or 'rejected'
  },
  approveVotes: { 
    type: Number, 
    default: 0 
  },
   w3wAddress: { type: String, required: false },
  rejectVotes: { 
    type: Number, 
    default: 0 
  },
  votedBy: [{ 
    type: String // Stores identifiers (like IP addresses or user IDs) of who has voted
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model('Report', ReportSchema);

export default Report;
