$( document ).ready(function() {

	var dateStrToYear = d3.time.format("%Y").parse;
   
    //Load JSON-encoded data using a GET HTTP request
	function getData(url) {
      	return $.getJSON(url); 
    }

    getData('admin/movies.json')
    	//then() method takes to params: callback functions for the success and failure cases of the Promise
      	.then(function(data) {
	        //add the total number of movies
	        $(".dek span").html(data.movies.length);

/*	        var movieViz = new LineChart({
				element: document.querySelector('#viz'),
				data: data2.tier1.tiersdata,
			    yDomain: [1,3.5], 
			    lineClass: 'tierPath'
			}); */
      	});
});

