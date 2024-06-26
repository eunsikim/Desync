function calculateCompatibility(player1, player2) {
    const roles = ["Infantry", "Medic", "Engineer", "Sniper"];
    const gameModes = [
        "Conquest",
        "Domination",
        "King of the Hill",
        "Capture the Flag",
    ];
    const communicationTypes = [
        "In-Game Voice Chat",
        "In-Game Text",
        "Discord Voice Chat",
        "Discord Text",
    ];

    // Calculate rank compatibility
    const rankDifference = Math.abs(player1.Rank - player2.Rank);
    const rankScore = Math.max(0, 1 - rankDifference / 2);

    // Calculate roles compatibility
    let roleScore = 0;
    roles.forEach((role) => {
        const p1Pref = player1.Roles[role];
        const p2Pref = player2.Roles[role];
        if ((p1Pref >= 75 && p2Pref <= 25) || (p2Pref >= 75 && p1Pref <= 25)) {
            roleScore += 1;
        } else if (
            (p1Pref < 25 && p2Pref < 25) ||
            (p1Pref > 75 && p2Pref > 75)
        ) {
            roleScore += 0;
        } else {
            roleScore += 1 - Math.abs(p1Pref - p2Pref) / 100;
        }
    });
    roleScore /= roles.length;

    // Calculate game modes compatibility
    let gameModeScore = 0;
    gameModes.forEach((mode) => {
        const p1Pref = player1["Game Mode"][mode];
        const p2Pref = player2["Game Mode"][mode];
        const preferenceDifference = Math.abs(p1Pref - p2Pref);
        if (p1Pref >= 50 && p2Pref >= 50) {
            gameModeScore += 1 - (preferenceDifference / 100) * 0.5 + 0.5;
        } else if (p1Pref <= 50 && p2Pref <= 50) {
            gameModeScore += 1 - (preferenceDifference / 100) * 0.5;
        } else {
            gameModeScore += Math.max(0, 1 - preferenceDifference / 100);
        }
    });
    gameModeScore /= gameModes.length;

    // Calculate communication compatibility
    let communicationScore = 0;
    communicationTypes.forEach((comm) => {
        const p1Pref = player1.Communication[comm];
        const p2Pref = player2.Communication[comm];
        const preferenceDifference = Math.abs(p1Pref - p2Pref);
        if (p1Pref >= 50 && p2Pref >= 50) {
            communicationScore += 1 - (preferenceDifference / 100) * 0.5 + 0.5;
        } else if (p1Pref <= 50 && p2Pref <= 50) {
            communicationScore += 1 - (preferenceDifference / 100) * 0.5;
        } else {
            communicationScore += Math.max(0, 1 - preferenceDifference / 100);
        }
    });
    communicationScore /= communicationTypes.length;

    // Calculate total compatibility score
    const totalScore =
        rankScore * 0.3 +
        roleScore * 0.3 +
        gameModeScore * 0.2 +
        communicationScore * 0.2;
    return {
        rankScore,
        roleScore,
        gameModeScore,
        communicationScore,
        totalScore,
    };
}

function findPlayerCompatibility(players, player) {
    const compatibilityResults = players
        .map((otherPlayer) => {
            const {
                rankScore,
                roleScore,
                gameModeScore,
                communicationScore,
                totalScore,
            } = calculateCompatibility(player, otherPlayer);
            return {
                name: otherPlayer.name,
                Rank: otherPlayer.Rank,
                Roles: otherPlayer.Roles,
                "Game Mode": otherPlayer["Game Mode"],
                Communication: otherPlayer.Communication,
                rankScore,
                roleScore,
                gameModeScore,
                communicationScore,
                totalCompatibility: totalScore,
            };
        })
        .sort((a, b) => b.totalCompatibility - a.totalCompatibility);

    return compatibilityResults;
}

export async function RunAlgo(params) {
    const { player, players } = params;

    const res = findPlayerCompatibility(players, player[0]);

    return res;
}
