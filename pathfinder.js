export default class PathFinder {
    constructor(gridElements) {
        this.gridElements = gridElements;
        this.corner = this.mapPosition(this.gridElements.find(elm => elm.getAttribute('x') === "0" && elm.getAttribute('x')));
    }

    getElement(x, y) {
        let elm = this.gridElements.find(elm => {
            if (parseInt(elm.getAttribute('x')) === x && parseInt(elm.getAttribute('y')) === y) {
                return true;
            }
            return false;
        });
        return elm;
    }

    findPath(start, end) {
        let startX = start.getAttribute('x');
        let startY = start.getAttribute('y');
        let endX = end.getAttribute('x');
        let endY = end.getAttribute('y');

        const openSet = new Set(this.gridElements); // should be every grid tile
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();

        // Initialize gScore and fScore for all elements
        for (let i = 0; i < this.gridElements.length; i++) {
            let pos = this.gridElements[i];
            gScore.set(pos, Infinity);
            fScore.set(pos, Infinity);
        }

        gScore.set(start, 0);
        fScore.set(start, this.heuristic(startX, startY, endX, endY));

        while (openSet.size > 0) {
            let current = this.getLowestFScore(openSet, fScore);

            if (current.getAttribute('x') == endX && current.getAttribute('y') == endY) {
                return this.reconstructPath(cameFrom, current);
            }

            openSet.delete(current);
            var nebs = this.neighbors(current.getAttribute('x'), current.getAttribute('y'));
            for (let neighbor of nebs) {
                let tentativeGScore = gScore.get(current) + 1;

                if (tentativeGScore < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(neighbor, gScore.get(neighbor) + this.heuristic(neighbor.getAttribute('x'), neighbor.getAttribute('y'), endX, endY));

                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        return null; // No path found
    }

    getLowestFScore(set, fScore) {
        let lowestScore = Infinity;
        let lowestElement = null;
        for (let element of set) {
            if (fScore.get(element) < lowestScore) {
                lowestScore = fScore.get(element);
                lowestElement = element;
            }
        }
        return lowestElement;
    }

    heuristic(x1, y1, x2, y2) {
        return Math.abs(parseInt(x1) - parseInt(x2)) + Math.abs(parseInt(y1) - parseInt(y2));
    }

    neighbors(a, b) {
        let neighbors = [];
        let x = parseInt(a);
        let y = parseInt(b);
        if (x > 0) {
            neighbors.push(this.getElement((x - 1), y));
        }
        if (x < this.gridElements.length - 1) {
            neighbors.push(this.getElement((x + 1), y));
        }
        if (y > 0) {
            neighbors.push(this.getElement(x, (y - 1)));
        }
        if (y < this.gridElements.length - 1) {
            neighbors.push(this.getElement(x, (y + 1)));
        }

        return neighbors;
    }

    reconstructPath(cameFrom, current) {
        const path = [current];
        while (cameFrom.has(current)) {
            current = cameFrom.get(current);
            path.push(current);
        }
        return path.reverse();
    }
    getTile(player) {
        return this.gridElements.find(tile => {
            if (player.getAttribute('x') === tile.getAttribute('x') && player.getAttribute('y') === tile.getAttribute('y')) {
                return true;
            }
        });
    }
    setTile(player) {
        return this.gridElements.find(tile => {

        });
    }
    mapPosition(tile) {
        return tile.getBoundingClientRect();
    }
    journey(tile, path) {
        const player = document.querySelector('div.player');
        const speed = 500;
        const corner = this.corner;
        window.playerPath = path;
        path.forEach((element, i, arr) => {
            const timer = i * speed / 2 || 250;
            setTimeout(() => {
                let top = element.offsetTop - 10;
                let left = element.offsetLeft - 10;
                let tileX = element.getAttribute('x');
                let tileY = element.getAttribute('y');
                player.setAttribute('x', tileX);
                player.setAttribute('y', tileY);
                player.setAttribute("style", `top:${top}px;left:${left}px;`);
                element.style.background = "#666";
            }, timer);
        });

    }

}