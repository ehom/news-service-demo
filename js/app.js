'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TITLE = "World News Headlines";

var getResource = function getResource(locale) {
  var _locale$split = locale.split('-'),
      _locale$split2 = _slicedToArray(_locale$split, 2),
      notUsed = _locale$split2[0],
      countryCode = _locale$split2[1];

  return 'https://raw.githubusercontent.com/ehom/external-data/master/news-api-org/' + countryCode.toLowerCase() + '-headlines.json';
};

var RESOURCES = [getResource('en-US'), 'https://raw.githubusercontent.com/ehom/external-data/master/news-api-org/countries.json'];

var URLs = {
  RTS_CSS: 'https://cdn.rtlcss.com/bootstrap/v4.5.3/css/bootstrap.min.css',
  LTR_CSS: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css'
};

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.sessionStorage = window.sessionStorage;

    _this.state = {
      locale: _this.props.locale,
      headlines: [],
      countries: {}
    };
    console.debug("ctor");
    return _this;
  }

  _createClass(App, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      console.debug("componentDidMount()");

      var FETCH_JSONS = "fetchJsonS";
      var cache = this.sessionStorage;

      console.debug("cache:", cache);

      if (cache.getItem('countries') && cache.getItem('locale')) {
        var locale = cache.getItem('locale');
        console.debug("use locale from cache:", locale);

        this.setState({
          countries: JSON.parse(cache.getItem('countries')),
          locale: locale,
          headlines: JSON.parse(cache.getItem(locale))
        });
      } else {
        console.time(FETCH_JSONS);
        console.timeLog(FETCH_JSONS);

        fetchJsonS(RESOURCES).then(function (data) {
          console.timeEnd(FETCH_JSONS);

          var _data = _slicedToArray(data, 2),
              headlines = _data[0],
              countries = _data[1];

          cache.setItem(_this2.state.locale, JSON.stringify(headlines));
          cache.setItem('countries', JSON.stringify(countries));
          cache.setItem('locale', _this2.state.locale);
          _this2.setState({
            headlines: headlines,
            countries: countries,
            locale: _this2.state.locale
          });
        });
      }
    }
  }, {
    key: 'fetchHeadlines',
    value: function fetchHeadlines(locale) {
      var _this3 = this;

      var cache = this.sessionStorage;

      if (cache.getItem(locale)) {
        console.debug("Use cache copy of headlines for: ", locale);
        cache.setItem('locale', locale);
        this.setState({
          locale: locale,
          headlines: JSON.parse(cache.getItem(locale))
        });
      } else {
        var resource = getResource(locale);
        console.debug("fetch headlines: ", resource);

        fetchJson(resource).then(function (json) {
          cache.setItem(locale, JSON.stringify(json));
          cache.setItem('locale', locale);

          _this3.setState({
            locale: locale,
            headlines: json
          });
        }).catch(function (error) {
          return console.log(error);
        });
      }
    }
  }, {
    key: 'changeHandler',
    value: function changeHandler(event) {
      var locale = event.target.value;
      this.fetchHeadlines(locale);
    }
  }, {
    key: 'getDir',
    value: function getDir(lang) {
      var langsRTL = ['ar', 'he'];
      return langsRTL.includes(lang) ? "rtl" : "ltr";
    }
  }, {
    key: 'setPageOrientation',
    value: function setPageOrientation(locale) {
      var _locale$split3 = locale.split('-'),
          _locale$split4 = _slicedToArray(_locale$split3, 2),
          lang = _locale$split4[0],
          _country = _locale$split4[1];

      var docElement = document.documentElement;

      docElement.lang = lang;
      docElement.dir = this.getDir(lang);

      var cssLinkElement = document.getElementById('bootstrap');

      cssLinkElement.href = docElement.dir === 'rtl' ? URLs.RTS_CSS : URLs.LTR_CSS;
    }
  }, {
    key: 'render',
    value: function render() {
      console.debug("about to render...");
      var style = { fontFamily: 'serif', fontWeight: 'bold', fontStyle: 'italic' };

      this.setPageOrientation(this.state.locale);

      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          'nav',
          { className: 'navbar navbar-light bg-light mb-3' },
          React.createElement(
            'h3',
            { className: 'navbar-text', style: style },
            TITLE
          ),
          React.createElement(
            'span',
            { className: 'navbar-text float-right' },
            React.createElement(Today, { locale: this.state.locale })
          )
        ),
        React.createElement(
          'div',
          { className: 'container mb-3' },
          React.createElement(
            'div',
            { className: 'row' },
            React.createElement('div', { className: 'col-md-7' }),
            React.createElement(
              'div',
              { className: 'col-md-5' },
              React.createElement(ItemSelector, { id: 'countrySelector', items: this.state.countries, onChange: this.changeHandler.bind(this),
                defaultValue: this.state.locale })
            )
          )
        ),
        React.createElement(
          'main',
          { role: 'main' },
          React.createElement(Headlines, {
            locale: this.state.locale, headlines: this.state.headlines
          })
        ),
        React.createElement(
          'footer',
          null,
          'This web app enables you to read news from around the world with the help of Google Translate.'
        )
      );
    }
  }]);

  return App;
}(React.Component);

App.defaultProps = {
  locale: 'en-US'
};

ReactDOM.render(React.createElement(App, null), document.getElementById("root"));