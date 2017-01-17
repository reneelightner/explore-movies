$( document ).ready(() => {

	const dateStrToYear = d3.time.format("%Y").parse;
   
    //Load JSON-encoded data using a GET HTTP request
	function getData(url) {
      	return $.getJSON(url); 
    }

    //Class declaration
	class MovieViz {

	    constructor(opts) {
	        this.data = opts.data;
	        this.element = opts.element;
	        this.xDomain = opts.xDomain;
	        this.chartHeight = opts.chartHeight;
	        this.genres = opts.genres;

	        this.draw();
	    }

	    draw () {

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
	        svg.attr('width',  this.width + this.margin.left + this.margin.right);
	        svg.attr('height', this.height + this.margin.top + this.margin.bottom);

	        // we'll actually be appending to a <g class='baseGroup'> element
	        this.baseGroup = svg
	          .append('g')
	          .attr("class", "baseGroup")
	          .attr('transform','translate('+this.margin.left+','+this.margin.top+')');
		}
	}

	getData('./admin/movies.json')
    	//then() method takes to params: callback functions for the success and failure cases of the Promise
      	.then(function(data) {
	        //add the total number of movies
	        $(".dek span").html(data.movies.length);

	        const testMovieViz = new MovieViz({
				element: document.querySelector('#viz'),
				data: data.movies,
			    xDomain: [1,3.5], 
			    chartHeight: 400,
			    genres: 'all'
			}); 

			console.log(data);
      	});
});

