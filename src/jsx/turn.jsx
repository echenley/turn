'use strict';

// var Router        = require('react-router');
// var RouteHandler  = Router.RouteHandler;
// var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
// var DefaultRoute  = Router.DefaultRoute;
// var Link          = Router.Link;

const _ = require('lodash');

import Cursor from './modules/cursor.jsx';

class Turn extends React.Component {

    constructor(props) {
        super(props);
        let tileSize = 50;
        let boardSize = props.tiles[0].length * tileSize;
        this.state = {
            tileSize: tileSize,
            boardSize: boardSize,
            tiles: props.tiles,
            cursorPosition: {
                x: 0,
                y: 0
            }
        };
    }

    moveCursor(direction) {
        let position = this.state.cursorPosition;
        let to = {
            x: position.x + direction.x,
            y: position.y + direction.y
        };
        this.setState({
            cursorPosition: to
        });
    }

    getTileIndex(position) {
        let width = Math.sqrt(this.state.tiles.length);
        return (position.y + 1) * width + position.x;
    }

    rotateTile() {
        let tiles = this.state.tiles;
        let position = this.state.cursorPosition;
        tiles[position.y][position.x] += 1;
        this.setState({
            tiles: tiles
        });
    }

    handleKeyEvent(e) {
        let key = e.keyCode;
        if ([32, 37, 38, 39, 40].indexOf(key) !== -1) {
            if (e.metaKey || e.ctrlKey) {
                return;
            }
            e.preventDefault();
        }

        if (key === 32) { this.rotateTile(); }
        else if (key === 37) { this.moveCursor({x: -1, y: 0}); } // left
        else if (key === 38) { this.moveCursor({x: 0, y: -1}); } // up
        else if (key === 39) { this.moveCursor({x: 1, y: 0}); } // right
        else if (key === 40) { this.moveCursor({x: 0, y: 1}); } // down
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
        let map = _.flatten(tiles).map(function(tileType, i) {
            let tileStyle = _.assign({
                transform: 'rotate(' + (tileType * 90) + 'deg)',
                WebkitTransform: 'rotate(' + (tileType * 90) + 'deg)'
            }, tileDimensions);
            return <div style={ tileStyle } className={ 'tile arrow' } key={ i } />;
        });

        return (
            <div id="turn-board" style={ boardDimensions }>
                { map }
                <Cursor dimensions={ tileDimensions } position={ cursorPosition } />
            </div>
        );
    }
}
Turn.defaultProps = {
    tiles: [[1, 1, 1, 1, 2, 2],
            [1, 2, 1, 0, 3, 2],
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
