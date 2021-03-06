import Level from './Level.js';
class Bonus {
    constructor(game, map, bonusString = '') {
        this.game = game;
        this.map = map;
        this.bonusString = bonusString;
        this.resetBonuses();
    }

    resetBonuses() {
        this.oldScore = 0;
        const width = [22,20,17,21,10,4];
        this.bonusArray = this.bonusString.split('').map((bonusItem, index) => {
            return {
                caption: bonusItem,
                fill: Level.GENERAL_OPTIONS.bonusColors[index % Level.GENERAL_OPTIONS.bonusColors.length],
                width: width[(index -1) % width.length]
            }
        });
        this.index = 0;
        this.bonusIndex = -1;
        this.currentBonus = null;
    }

    handleBonus(score) {
        if (score - this.oldScore > 500 && !this.currentBonus && this.index < this.bonusArray.length) {
            this.oldScore = score;
            this.position = this.calculateBonusPosition(this.map);
            if (this.position) {
                this.currentBonus = this.bonusArray[this.index];
                this.index += 1;
            }
        }
    }

    getState() {
        return {index: this.bonusIndex, array: this.bonusArray};
    }

    calculateBonusPosition(map) {
        return map.getFreeCell();
    }

    getPosition() {
        if (this.position) {
            return {x: this.position.x * 10, y: this.position.y * 10}
        }
        else {
            return null;
        }
    }

    getCurrent() {
        return this.currentBonus;
    }

    eatBonus() {
        if (this.index === this.bonusArray.length) {
            this.game.showCard();
        }
        this.bonusIndex = this.index - 1;
        this.currentBonus = null;
        this.position = null;
    }

    draw(context) {
        if (this.position && this.currentBonus) {
            const {x,y} = this.position;

            context.fillStyle = this.currentBonus.fill;
            const font = Level.FONTS.bonus,
                text = this.currentBonus.caption.toUpperCase();
            context.font = `${font.size}px ${font.family}`;
            context.fillText(text, (x + 0.5) * this.map.blockSize - 7, (y + 0.5) * this.map.blockSize + 5);
        }
    }
}

export default Bonus;