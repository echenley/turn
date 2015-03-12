'use strict';

const _ = require('lodash');

class Cursor extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    render() {
        // let cx = React.addons.classSet;
        let dimensions = this.props.dimensions;
        let position = this.props.position;

        let transform = 'translateX(' + (position.x * dimensions.width) + 'px)';
        transform += 'translateY(' + (position.y * dimensions.height) + 'px)';

        let cursorStyle = _.assign({
                transform: transform,
                WebkitTransform: transform
            }, dimensions);
        return (
            <div className='cursor' style={ cursorStyle } />
        );
    }
}

export default Cursor;
