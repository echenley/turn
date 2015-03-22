'use strict';

// var Router        = require('react-router');
// var RouteHandler  = Router.RouteHandler;
// var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
// var DefaultRoute  = Router.DefaultRoute;
// var Link          = Router.Link;

const _ = require('lodash');

import Cursor from './modules/cursor.jsx';
import Sprite from './modules/sprite.jsx';
import Vectors from './modules/vectors.js';

class Turn extends React.Component {

    constructor(props) {
        super(props);
        let tileSize = 50;
        let boardSize = props.tiles.length * tileSize;
        this.state = {
            tileSize: tileSize,
            boardSize: boardSize,
            tiles: props.tiles,
            sprites: [{
                type: 'circle',
                start: { x: 0, y: 0 }
            }],
            cursorPosition: {
                x: 0,
                y: 0
            }
        };
    }

    isValidMove(to) {
        var boardWidth = this.state.tiles.length;

        // edge of board
        if (to.x < 0 || to.x > boardWidth - 1 ||
            to.y < 0 || to.y > boardWidth - 1) {
            return false;
        }

        return true;
    }

    moveCursor(direction) {
        let from = this.state.cursorPosition;
        let to = {
            x: from.x + direction.x,
            y: from.y + direction.y
        };

        if (!this.isValidMove(to)) {
            return;
        }

        this.setState({
            cursorPosition: to
        });
    }

    rotateTile(clockwise) {
        let tiles = this.state.tiles;
        let position = this.state.cursorPosition;
        if (clockwise) {
            tiles[position.y][position.x] += 1;
        } else {
            tiles[position.y][position.x] -= 1;
        }
        this.setState({
            tiles: tiles
        });
    }

    handleKeyEvent(e) {
        let key = e.keyCode;

        if ([37, 38, 39, 40, 65, 68].indexOf(key) !== -1) {
            if (e.metaKey || e.ctrlKey) {
                return;
            }
            e.preventDefault();
        }

        if (key === 37) { this.moveCursor(Vectors[0]); }      // left
        else if (key === 38) { this.moveCursor(Vectors[1]); } // up
        else if (key === 39) { this.moveCursor(Vectors[2]); } // right
        else if (key === 40) { this.moveCursor(Vectors[3]); } // down
        else if (key === 68) { this.rotateTile(true); }       // D
        else if (key === 65) { this.rotateTile(false); }      // A
    }

    componentDidMount() {
        // Keyboard Events
        window.addEventListener('keydown', this.handleKeyEvent.bind(this));
        // window.addEventListener('keyup', () => {
        //     keyIsDown = false;
        // });
    }

    render() {
        // var cx = React.addons.classSet;
        let cursorPosition = this.state.cursorPosition;
        let tiles = this.state.tiles;
        let tileSize = this.state.tileSize;
        let boardSize = this.state.boardSize;
        let tileDimensions = {
            width: tileSize,
            height: tileSize
        };
        let boardDimensions = {
            width: boardSize,
            height: boardSize
        };

        // convert tile map into jsx
        let tileMap = _.flatten(tiles).map((tileType, i) => {
            let tileStyle = _.assign({
                transform: 'rotate(' + (tileType * 90) + 'deg)',
                WebkitTransform: 'rotate(' + (tileType * 90) + 'deg)'
            }, tileDimensions);
            return <div style={ tileStyle } className={ 'tile arrow' } key={ i } />;
        });

        let sprites = this.state.sprites.map((sprite, i) => (
            <Sprite sprite={ sprite } tiles={ tiles } dimensions={ tileDimensions } key={ i } />
        ));

        return (
            <div id="turn-board" style={ boardDimensions }>
                { tileMap }
                <Cursor dimensions={ tileDimensions } position={ cursorPosition } />
                { sprites }
            </div>
        );
    }
}
Turn.defaultProps = {
    tiles: [[2, 2, 2, 2, 2, 3],
            [1, 2, 1, 0, 3, 0],
            [1, 1, 2, 1, 0, 1],
            [1, 3, 1, 1, 0, 0],
            [1, 1, 2, 1, 1, 1],
            [1, 3, 1, 1, 0, 0]]
};

// var routes = (
//     <Route handler={ Turn }></Route>
// );

// Router.run(routes, function(Handler, state) {
//     React.render(<Handler params={ state.params } />, document.getElementById('container'));
// });

React.render(<Turn />, document.getElementById('container'));
