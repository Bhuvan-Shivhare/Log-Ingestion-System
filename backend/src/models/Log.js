const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    level: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    resourceId: {
        type: String,
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
        index: -1 // Descending index for timestamp
    },
    traceId: {
        type: String,
        required: true,
        index: true
    },
    spanId: {
        type: String,
        required: true,
        index: true
    },
    commit: {
        type: String,
        required: true,
        index: true
    },
    metadata: {
        parentResourceId: {
            type: String,
            index: true
        }
    }
}, {
    timestamps: true
});

// Full-text search index on message
LogSchema.index({ message: 'text' });
// Compound index example if needed, but single field indexes are requested
// LogSchema.index({ timestamp: -1, level: 1 });

module.exports = mongoose.model('Log', LogSchema);
