
exports.getPrivateChatKey = (familyId, userA, userB) => {
    const sorted = [userA, userB].sort();
    return `chat:${familyId}:${sorted[0]}-${sorted[1]}`;
};