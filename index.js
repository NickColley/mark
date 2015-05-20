/* jshint node: true, browser: true */
var url = require('url');
var querystring = require('querystring');
var React = require('react');
var Marked = require('marked');

function getMarkdownState(){
  var markdownFromQuery = '# Click to create';
  var queryString = url.parse(window.location.href).query;
  if(queryString){
    var queryObject = querystring.parse(queryString)
    var valueString = queryObject.s.replace('/', '');
    markdownFromQuery =  window.atob(valueString);
  }
  return {
    editor: false,
    value: markdownFromQuery
  };
};

var MarkdownEditor = React.createClass({
    getInitialState: function() {
        return getMarkdownState();
    },
    _handleSubmit: function() {
      var value = React.findDOMNode(this.refs.textarea).value;
      // base64 it
      var base64EncodedValue = window.btoa(value);
      // url encode it
      var UriEncodedValue = window.encodeURIComponent(base64EncodedValue);
      // set it as the url
      window.location.href = window.location.origin + window.location.pathname + '?s=' + UriEncodedValue;

      this.setState({ editor: false });
    },
    _handleClick: function() {
        this.setState({ editor: true });
    },
    render: function(){
      var fullscreenStyle = {
          position: 'absolute',
          border: 'none',
          top: 0,
          left: 0,
          bottom: 0,
          width: '100%',
          boxSizing: 'border-box',
          padding: 50,
          fontSize: 16,
          fontFamily: 'monospace'
      };
        var editor = (
            <div>
              <button
                style={{
                  zIndex: 1,
                  position: 'absolute'
                }}
                onClick={this._handleSubmit}
              >Save</button>
              <textarea
                style={fullscreenStyle}
                ref="textarea"
                defaultValue={this.state.value}
                autoFocus
              />
            </div>
        );
        var markdown = (
          <div
              style={fullscreenStyle}
              onClick={this._handleClick}
              dangerouslySetInnerHTML={{
                  __html: Marked(this.state.value, {sanitize: true})
              }}
          />
        );
        return (
            <div>{this.state.editor ? editor : markdown}</div>
        );
    }
});

React.render(<MarkdownEditor />, document.body);
