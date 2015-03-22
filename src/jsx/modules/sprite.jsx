'use strict';

const _ = require('lodash');
let moveTimer;

import Vectors from './vectors.js';

class Sprite extends React.Component {

    constructor(props) {
        super(props);
        this.state = _.assign({
            speed: 1000, // ms between each move
            position: props.sprite.start
        }, props);
    }

    move() {
        // moves the sprite in the direction of the tile beneath it
        let tiles = this.props.tiles;
        let from = this.state.position;
        let direction = Vectors.getVector(tiles[from.y][from.x]);
        let to = {
            x: from.x + direction.x,
            y: from.y + direction.y
        };

        // TODO - check if sprite moves off board

        this.setState({
            position: to
        });
    }

    componentDidMount() {
        moveTimer = setInterval(this.move.bind(this), this.state.speed);
    }

    componentWillUnmount() {
        clearInterval(moveTimer);
    }

    render() {
        let dimensions = this.props.dimensions;
        let sprite = this.props.sprite;
        let position = this.state.position;

        let spriteCx = 'sprite ' + sprite.type;

        let transform = 'translateX(' + (position.x * dimensions.width) + 'px)';
        transform += ' translateY(' + (position.y * dimensions.height) + 'px)';

        let transition = 'transform ' + this.state.speed + 'ms';

        let spriteStyle = _.assign({
            transition: transition,
            WebkitTransition: '-webkit-' + transition,
            transform: transform,
            WebkitTransform: transform
        }, dimensions);

        return (
            <div className={ spriteCx } style={ spriteStyle } />
        );
    }
}

export default Sprite;
