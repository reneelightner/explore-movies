'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(document).ready(function () {

	var dateStrToYear = d3.time.format("%Y").parse;

	//Load JSON-encoded data using a GET HTTP request
	function getData(url) {
		return $.getJSON(url);
	}

	//Class declaration

	var MovieViz = function () {
		function MovieViz(opts) {
			_classCallCheck(this, MovieViz);

			this.data = opts.data;
			this.element = opts.element;
			this.xDomain = opts.xDomain;
			this.chartHeight = opts.chartHeight;
			this.genres = opts.genres;

			this.draw();
		}

		_createClass(MovieViz, [{
			key: 'draw',
			value: function draw() {

				this.chartWidth = $(this.element).width();

				// define width, height with the margin
				this.margin = {
					top: 5,
					right: 20,
					bottom: 20,
					left: 20
				};
				this.width = this.chartWidth - this.margin.left - this.margin.right;
				this.height = this.chartHeight - this.margin.top - this.margin.bottom;

				// set up parent element and SVG
				this.element.innerHTML = '';
				var svg = d3.select(this.element).append('svg');
				svg.attr('width', this.width + this.margin.left + this.margin.right);
				svg.attr('height', this.height + this.margin.top + this.margin.bottom);

				// we'll actually be appending to a <g class='baseGroup'> element
				this.baseGroup = svg.append('g').attr("class", "baseGroup").attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
			}
		}]);

		return MovieViz;
	}();

	getData('./admin/movies.json')
	//then() method takes to params: callback functions for the success and failure cases of the Promise
	.then(function (data) {
		//add the total number of movies
		$(".dek span").html(data.movies.length);

		var testMovieViz = new MovieViz({
			element: document.querySelector('#viz'),
			data: data.movies,
			xDomain: [1, 3.5],
			chartHeight: 400,
			genres: 'all'
		});

		console.log(data);
	});
});

//# sourceMappingURL=script.js.map