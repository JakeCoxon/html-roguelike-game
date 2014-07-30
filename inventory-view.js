

var InventoryView = React.createClass({

    render: function( ) {

        var gold = React.DOM.p( {}, "Money: \u00A3" + this.props.model.player.money );

        var inventory = _.map( this.props.model.player.inventory, function( item, i ) {

            return React.DOM.div( { key: i }, ( i + 1 ) + ". " + item.name );

        });

        return React.DOM.div( {}, gold, inventory );

    }

});