const buildQuery = (query) => {
    const {
        level,
        message,
        resourceId,
        traceId,
        spanId,
        commit,
        parentResourceId,
        from,
        to,
        regex,
    } = query;

    const mongoQuery = {};

    // Exact matches
    if (level) mongoQuery.level = level;
    if (resourceId) mongoQuery.resourceId = resourceId;
    if (traceId) mongoQuery.traceId = traceId;
    if (spanId) mongoQuery.spanId = spanId;
    if (commit) mongoQuery.commit = commit;
    if (parentResourceId) mongoQuery['metadata.parentResourceId'] = parentResourceId;

    // Text search OR Regex search
    // Note: Standard text search uses the text index. Regex search provides more flexibility but is slower.
    // Prioritize text search if 'message' param is provided directly for full-text search behavior
    if (message) {
        mongoQuery.$text = { $search: message };
    } else if (regex) {
        // If no full-text search, allow regex on message
        mongoQuery.message = { $regex: regex, $options: 'i' };
    }

    // Date range
    if (from || to) {
        mongoQuery.timestamp = {};
        if (from) mongoQuery.timestamp.$gte = new Date(from);
        if (to) mongoQuery.timestamp.$lte = new Date(to);
    }

    return mongoQuery;
};

module.exports = buildQuery;
