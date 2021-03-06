import {PACMAN} from './Constants';
import Level from './Level'
let BLOCK_SIZE = 10;
class Map {
    constructor(context, size = BLOCK_SIZE) {
        this.level = Level;
        this.context = context;
        this.blockSize = size;
        this.pillSize = 0;
        this.pillSizeCounter = 0.3;
        this.reset();
    }

    reset() {
        this.map = [];
        this.level.MAP.forEach(line => this.map.push(Object.assign([], line)));
        this.height = this.level.MAP.length;
        this.width = this.level.MAP[0].length;
    }

    withinBounds(x, y) {
        return y >= 0 && y < this.height && x >= 0 && x < this.width;
    }

    isWallSpace(position) {
        return this.withinBounds(position.x, position.y) && this.map[position.y][position.x] === PACMAN.WALL;
    }

    isFloorSpace(position) {
        if (!this.withinBounds(position.x, position.y)) {
            return false;
        }
        let piece = this.map[position.y][position.x];
        return piece === PACMAN.EMPTY || piece === PACMAN.CAKE || piece === PACMAN.PILL;
    }

    draw(context = this.context) {
        let i, j, size = this.blockSize;
        context.fillStyle = Level.GENERAL_OPTIONS.background;
        context.fillRect(0, 0, this.width * size, this.height * size);
        this.drawWall(context);
        for (i = 0; i < this.height; i++) {
            for (j = 0; j < this.width; j++) {
                this.drawBlock(i, j, context);
            }
        }
    }

    getFreeCell() {
        const y = Math.floor(Math.random() * (this.map.length - 1)) + 1;
        const line = this.map[y];
        let cell = null;
        let count = 0;
        while (cell === null && count < 10) {
            const x = Math.floor(Math.random() * (line.length - 1)) + 1;
            const tmpCell = line[x];
            if (tmpCell !== PACMAN.BOX && tmpCell !== PACMAN.WALL) {
                return {x: x, y: y};
            }
            count++;
        }
        return cell;
    }

    drawWall(context) {
        context.strokeStyle = this.level.WALLS_OPTION.strokeStyle;
        context.lineWidth = this.level.WALLS_OPTION.lineWidth;
        context.lineCap = this.level.WALLS_OPTION.lineCap;
        Level.WALLS.forEach((line)=> {
            context.beginPath();
            line.forEach((p) => {
                if (p.move) {
                    context.moveTo(p.move[0] * this.blockSize, p.move[1] * this.blockSize);
                } else if (p.line) {
                    context.lineTo(p.line[0] * this.blockSize, p.line[1] * this.blockSize);
                } else if (p.curve) {
                    context.quadraticCurveTo(p.curve[0] * this.blockSize,
                        p.curve[1] * this.blockSize,
                        p.curve[2] * this.blockSize,
                        p.curve[3] * this.blockSize);
                }
            });
            context.stroke();
        });
    }

    block(position) {
        return this.map[position.y][position.x];
    }

    setBlock(position, type) {
        this.map[position.y][position.x] = type;
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    drawPills(context = this.context) {
        let i, j;
        this.pillSize += this.pillSizeCounter;
        if (this.pillSize > 6 || this.pillSize < 0.3) {
            this.pillSizeCounter = -this.pillSizeCounter;
        }
        for (i = 0; i < this.height; i += 1) {
            for (j = 0; j < this.width; j += 1) {
                if (this.map[i][j] === PACMAN.PILL) {
                    context.beginPath();

                    context.fillStyle = Level.GENERAL_OPTIONS.background;
                    context.fillRect((j * this.blockSize), (i * this.blockSize),
                        this.blockSize, this.blockSize);
                    const x = (j * this.blockSize) + this.blockSize / 2;
                    const y = (i * this.blockSize) + this.blockSize / 2;
                    const r = Math.abs(7 - (this.pillSize / 3))+2;
                    const gradient = context.createRadialGradient(x, y, 0, x, y, r);
                    gradient.addColorStop(0, Level.GENERAL_OPTIONS.pillColor.start);
                    gradient.addColorStop(0.7, Level.GENERAL_OPTIONS.pillColor.end);
                    gradient.addColorStop(1, Level.GENERAL_OPTIONS.pillColor.shadow);
                    context.arc(x, y, r, 0, Math.PI * 2, false);
                    context.fillStyle = gradient;
                    context.fill();
                    context.closePath();
                }
            }
        }
    }

    getBlockSize() {
        return this.blockSize;
    }

    drawBlock(y, x, context = this.context) {
        let layout = this.map[y][x];

        if (layout === PACMAN.PILL) {
            return;
        }
        context.beginPath();
        if (layout === PACMAN.EMPTY || layout === PACMAN.BOX ||
            layout === PACMAN.CAKE) {

            context.fillStyle = Level.GENERAL_OPTIONS.background;
            context.fillRect((x * this.blockSize), (y * this.blockSize),
                this.blockSize, this.blockSize);

            if (layout === PACMAN.CAKE) {
                context.fillStyle = Level.GENERAL_OPTIONS.blockColor;

                this.context.beginPath();
                this.context.arc((x * this.blockSize) + (this.blockSize / 2),
                    (y * this.blockSize) + (this.blockSize / 2),
                    this.blockSize / 12,
                    0, 2 * Math.PI, false);
                this.context.fill();
                this.context.closePath();

            }
        }
    }
}

export default Map;