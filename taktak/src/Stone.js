export default class Stone {
    constructor(player, type) {
        this.player = player; // Either 1 or 2 indicating the player
        this.type = type; // 'flat', 'standing', or 'capstone'
    }

    isCapstone() {
        return this.type === "capstone";
    }

    isStanding() {
        return this.type === "standing";
    }
}
