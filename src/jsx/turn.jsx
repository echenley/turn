'use strict';

var Router        = require('react-router');
// var RouteHandler  = Router.RouteHandler;
var Route         = Router.Route;
// var NotFoundRoute = Router.NotFoundRoute;
// var DefaultRoute  = Router.DefaultRoute;
// var Link          = Router.Link;

var Turn = React.createClass({

    render: function() {
        return (
            <div />
        );
    }

});

var routes = (
    <Route handler={ Turn }></Route>
);

Router.run(routes, function(Handler, state) {
    React.render(<Handler params={ state.params } />, document.getElementById('container'));
});