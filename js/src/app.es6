$( document ).ready(() => {

	//GLOBAL variables
	const dateStrToYear = d3.time.format("%Y").parse;
	var yearsDomain, votesDomain, allGenres;
	var testMovieViz;
   
    //Load JSON-encoded data using a GET HTTP request
	function getData(url) {
      	return $.getJSON(url); 
    }

    //Class declaration for a visualization instance
	class MovieViz {

	    constructor(opts) {
	        this.element = opts.element;
	        this.data = opts.data;
	        this.xDomain = opts.xDomain;
	        this.xScaleType = opts.xScaleType;
	        this.yDomain = opts.yDomain;
	        this.chartHeight = opts.chartHeight;
	        this.genres = opts.genres;

	        this.draw();
	    }

	    draw () {

	        this.chartWidth = $(this.element).width();
	      
	        // define width, height with the margin
	        this.margin = {
	            top: 5,
	            right: 150,
	            bottom: 20,
	            left: 40
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

	        // 'rating' label
	        this.baseGroup.append("text")
	        	.text("IMDB Rating")
	        	.style("text-anchor", "middle")
     			.attr("dx", (this.height/2)*-1)
     			.attr("dy", "-30")
	        	.attr("transform", "rotate(-90)");

	        // create the other stuff
		    this.createYaxis();
		    this.createXaxis();
		    this.createCircles();
		}

		createYaxis () {
			// y scale to be used in y axis
        	this.yScale = d3.scale.linear()
            	.range([this.height, 0])
            	.domain(this.yDomain);

        	// create axis element
	        var yAxis = d3.svg.axis()
	            .scale(this.yScale)
	            .tickSize(-this.width)
	            .orient("left");

	        // add the y axis to the main chart
	        this.baseGroup
	          	.append("g")
	          	.attr("class", "y axis")
	          	.call(yAxis);

		}

		createXaxis () {

			d3.select("g.x.axis").remove();

			// x scale to be used in x axis
			if(this.xScaleType == 'year'){
				this.xScale = d3.time.scale()
	            	.range([0, this.width])
	            	.domain(this.xDomain);
			}else{
				this.xScale = d3.scale.linear()
					.range([0, this.width])
	            	.domain(this.xDomain);
			}

            // create axis element
	        var xAxis = d3.svg.axis()
	            .scale(this.xScale)
	            .orient("bottom");

	        // add the x axis to the chart
	        this.baseGroup
	            .append("g")
	            .attr("class", "x axis")
	            .attr("transform", "translate(0," + this.height + ")")
	            .call(xAxis);
		}

		createCircles() {

			// remove all previous circles and hover text
			d3.selectAll("circle.movie-circle").remove();
			d3.select("text.hover-text").remove();

			//filter the circle data
			var circlesData = [];
			if(this.genres !== 'all'){
				this.data.forEach(y => {
					var hasgenre = y.genres.find(x => x === this.genres);
					if(hasgenre){
						circlesData.push(y);
					}
				});
			}else{
				circlesData = this.data;
			}

			var mouseover = (circleIndex) => {
				d3.select("text.hover-text")
					.attr("opacity", 1)
					.text(circlesData[circleIndex].title)
					.attr("dx", () => this.xScale(circlesData[circleIndex][this.xScaleType])+5)
					.attr("dy", () => this.yScale(circlesData[circleIndex].rating));
			};

			var mouseout = (circleIndex) => {
				d3.select("text.hover-text")
					.attr("opacity", 0);
			};

			// add circles
			this.baseGroup.selectAll("circle")
		        .data(circlesData)
		        .enter()
		        .append("circle")
		        .attr("class", "movie-circle") 
		        .attr("genre", this.genres)
		        .attr("cy", d =>  this.yScale(d.rating)  )
		        .attr("cx", d => this.xScale(d[this.xScaleType])  )
		        .attr("r", 5)
		        .on("mouseover", (d,i) => mouseover(i))
		        .on("mouseout", (d,i) => mouseout(i));

		    this.baseGroup.append("text")
	        	.attr("class", "hover-text");    
		}

		moveCircles(){

			// move circles to their new position according to the new x axis/scale
			d3.selectAll("circle.movie-circle")
				.transition()
				.duration(1000)
				.attr("cx", d => this.xScale(d[this.xScaleType]));
		}
	}

	// adding buttons/listeners for filterign by genre and adjusting the x-axis
	function makeButtons(genres){

		$(".genres-buttons").append("<button class='btn btn-default btn-primary btn-xs' genre='all'>ALL</button>");

		for(let genre of genres){
			$(".genres-buttons").append("<button class='btn btn-default btn-xs' genre="+genre+">"+genre+"</button>");
		}

		$(".genres-buttons button.btn").on("click", function(){
			$(".genres-buttons button.btn").removeClass('btn-primary');
			$(this).addClass('btn-primary');
			let theGenreClicked = $(this).attr('genre');
			testMovieViz.genres = theGenreClicked;
			testMovieViz.createCircles();
		});

		$(".xaxis-buttons button.btn").on("click", function(){
			$(".xaxis-buttons button.btn").removeClass('btn-primary');
			$(this).addClass('btn-primary');
			let thexAxisClicked = $(this).attr('xaxis');
			testMovieViz.xScaleType = thexAxisClicked;
			testMovieViz.xDomain = thexAxisClicked == 'votes' ? votesDomain : yearsDomain;
			testMovieViz.createXaxis();
			testMovieViz.moveCircles();
		});

	}


	getData('./admin/movies.json')
    // then() method takes to params: callback functions for the success and failure cases of the Promise
    .then((data) => {
    	// years get parse into data objects for d3.js
    	// turn voes and ratings to numbers from strings
    	data.movies.forEach(obj => {
    		obj.year = dateStrToYear(obj.year);
    		obj.rating = +obj.rating;
    		obj.votes = +obj.votes;
    	});
	    // add the total number of movies to the dek
	    $(".dek span").html(data.movies.length);
	    // assign these global variables
	    yearsDomain = [dateStrToYear(data.yearRange[0].toString()),dateStrToYear(data.yearRange[1].toString())];
	    votesDomain = data.votesRange;
	    allGenres = data.genres;
	    // create a new data viz object
	    testMovieViz = new MovieViz({
			element: document.querySelector('#viz'),
			data: data.movies,
			xDomain: yearsDomain, // or votesDomain
			xScaleType: 'year', // or 'votes'
			yDomain: [1,10],
			chartHeight: 350,
			genres: 'all'
		});
	    // make the buttons and add their click listener
		makeButtons(allGenres);
    });

});

