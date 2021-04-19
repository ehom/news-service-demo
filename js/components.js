"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Today = function Today(_ref) {
  var locale = _ref.locale;

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };

  var today = new Intl.DateTimeFormat(locale, options).format(new Date());
  return React.createElement(
    React.Fragment,
    null,
    today
  );
};

Today.defaultProps = {
  locale: navigator.language
};

var Headlines = function (_React$Component) {
  _inherits(Headlines, _React$Component);

  function Headlines(props) {
    _classCallCheck(this, Headlines);

    return _possibleConstructorReturn(this, (Headlines.__proto__ || Object.getPrototypeOf(Headlines)).call(this, props));
  }

  _createClass(Headlines, [{
    key: "render",
    value: function render() {
      console.debug(this.props);

      var isEmpty = function isEmpty(a) {
        return a.length === 0;
      };

      if (isEmpty(this.props.headlines)) {
        return null;
      }

      moment.locale(this.props.locale);
      var thisMoment = moment(new Date());

      // TODO
      // rewrite this to use a loop instead of calling map?

      var headlines = this.props.headlines.articles.map(function (article) {
        var hasNoDesc = function hasNoDesc(object) {
          return object.description === null || object.description.length === 0;
        };

        var published = moment(new Date(article.publishedAt));
        var howLongAgo = published.from(thisMoment);

        var description = article.description;
        if (hasNoDesc(article)) {
          description = article.source.name;
        }

        console.debug("description:", description);
        console.debug("UTF16:\n", new Utf16String(description).toHexString());

        return React.createElement(
          "div",
          { className: "card mb-5 col-sm-4 app-headline" },
          React.createElement("img", { className: "card-img-top", src: article.urlToImage }),
          React.createElement(
            "div",
            { className: "card-body", dir: "auto" },
            React.createElement(
              "h5",
              { className: "card-title" },
              article.title
            ),
            React.createElement(
              "a",
              { href: article.url, target: "_blank" },
              Util.decodeHtml(description)
            )
          ),
          React.createElement(
            "ul",
            { className: "list-group list-group-flush" },
            React.createElement(
              "li",
              { className: "list-group-item" },
              howLongAgo
            )
          )
        );
      });

      return React.createElement(
        "div",
        { "class": "row" },
        headlines
      );
    }
  }]);

  return Headlines;
}(React.Component);

Headlines.defaultProps = {
  headlines: [],
  locale: navigator.language
};

function Utf16String(s) {
  var LOWER_BYTE = function LOWER_BYTE(code) {
    return code & 0xff;
  };
  var HIGH_BYTE = function HIGH_BYTE(code) {
    return code >> 8;
  };

  this.hexValues = [].concat(_toConsumableArray(s)).map(function (word) {
    return "U+" + word.charCodeAt(0).toString(16).padStart(4, '0');
  });

  // to do
  // detect if utf-16 string is in little or big endian
  // return utf string in bytes
}

Utf16String.prototype.toHexString = function () {
  return this.hexValues.join(' ');
};