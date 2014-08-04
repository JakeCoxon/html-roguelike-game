

var DialogView = React.createClass({

    getInitialState: function( ) {
        return { scrollIndex: 0 };
    },

    render: function( ) {

        if ( !this.props.dialog ) return React.DOM.div( { style: { display: 'none' } }, "" );

        var message = this.props.dialog.message;

        var options = _.map( this.props.dialog.options, function( option, idx ) {

            var style = {
                backgroundColor: this.state.scrollIndex == idx ? "#ffaa00" : "white"
            };

            return React.DOM.li( { style: style }, option.message );

        }.bind( this ) );

        return React.DOM.div( {}, message, options );

    },

    scroll: function( dy ) {
        var newScroll = 
          Math.min( Math.max( this.state.scrollIndex + dy, 0 ), this.props.dialog.options.length - 1 );

        if ( newScroll != this.state.scrollIndex )
            this.setState( { scrollIndex: newScroll } );
    },

    hasDialog: function( ) {
        return !!this.props.dialog;
    },

    handleKeyEvent: function( ev ) {

        if ( !this.props.dialog ) return false;

        var dy = ( ev.keyCode == 40 ) - ( ev.keyCode == 38 );

        if ( dy ) {
            this.scroll( dy );
            return true;
        }

        if ( ev.keyCode == 13 ) {
            var option = this.props.dialog.options[ this.state.scrollIndex ];
            this.close();
            if (option.callback) option.callback();
            return true;
        }

    },

    close: function() {
        this.setProps( { dialog: undefined } );
    }

});