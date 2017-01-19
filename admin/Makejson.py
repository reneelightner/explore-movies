#!/usr/bin/env python

"""Makejson.py: Output a json file from the data in movie_titles_metadata.txt. This json will be used in data viz prototype"""

__author__ = "Renee Lightner"

import json
import pprint
import ast

# open the text file
file = open('movie_titles_metadata.txt')

# create an empty list where each line (movie) of the text file will go
movieList = []

# loop where each line (movie) of the file is made into a list of strings 
# (separated by +++$+++) and appended onto the movieList list
for line in file:
	movieList.append(line.split(" +++$+++ "))

# these lists or dictionaries will be filled in in the loop below
finalMovieList = []
allGenres = {}
allYears = []
allVoteAmounts = []

# loop through each sub list (movie) in movieList
for movie in movieList:
	# create an empty dictionary to be filled in with the data for this movie
	movieDict = {}
	# an inner loop to get the index number and value for this sub list (movie) in movieList 
	for i, val in enumerate(movie):
		# the first item in the sub list (movie) will be the key, add it to the empty movieDict...
		if i == 0:
			movieDict["key"] = val
		# ... do the same for the next item in the sub list (movie)
		if i == 1:
			movieDict["title"] = val
		if i == 2:
			year = val.replace("/I","")
			movieDict["year"] = year
			# add the year of this movie to the allYears list (used later to find max and min of all years)
			allYears.append( int(year) )
		if i == 3:
			movieDict["rating"] = val
		if i == 4:
			movieDict["votes"] = val
			# add the votes for of this movie to the allVoteAmounts list (used later to find max and min)
			allVoteAmounts.append( int(val) ) 
		if i == 5:
			# turn the genres value into a list
			genresAsList = ast.literal_eval(val)
			movieDict["genres"] = genresAsList
			# loop through the genres list...
			for genre in genresAsList:
				#.. if this genre hasn't already been added to the allGenres dictionary then add it
				if genre in allGenres.keys():
					break
				else:
					allGenres[genre] = 'true'
	# now that movieDict is filled in for this movie, append it to finalMovieList
	finalMovieList.append(movieDict)

# make a list from the keys in the allGenres dictionary
allGenres = allGenres.keys()

# make a list with the min and max years (use this for the x-scale in the viz)
yearRange = []
yearRange.append(min(allYears))
yearRange.append(max(allYears))

# make a list with the min and max votes (use this for the x-scale in the viz)
votesRange = []
votesRange.append(min(allVoteAmounts))
votesRange.append(max(allVoteAmounts))

# finalData will have everything we output to the  json file
finalData = {}
# fill in the finalData dictionary using keys to describe each set of data
finalData["yearRange"] = yearRange
finalData["votesRange"] = votesRange
finalData["genres"] = allGenres
finalData["movies"] = finalMovieList

# printing to the console for testing
pprint.pprint(allGenres)
pprint.pprint(yearRange)
pprint.pprint(votesRange)

# write the final data an JSON
with open('movies.json', 'w') as outfile:
    json.dump(finalData, outfile, encoding='latin-1') 

