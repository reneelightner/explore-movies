#!/usr/bin/env python

"""Makejson.py: Output a json file from the data in movie_titles_metadata.txt. This json will be used in data viz prototype"""

__author__ = "Renee Lightner"

import json
import pprint
import ast

file = open('movie_titles_metadata.txt')

movieList = []

for line in file:
	movieList.append(line.split(" +++$+++ "))

finalMovieList = []
allGenres = {}
allYears = []
allVoteAmounts = []

for movie in movieList:
	movieDict = {}
	for i, val in enumerate(movie):
		if i == 0:
			movieDict["key"] = val
		if i == 1:
			movieDict["title"] = val
		if i == 2:
			year = val.replace("/I","")
			movieDict["year"] = year
			allYears.append( int(year) )
		if i == 3:
			movieDict["rating"] = val
		if i == 4:
			movieDict["votes"] = val
			allVoteAmounts.append( int(val) ) 
		if i == 5:
			genresAsList = ast.literal_eval(val)
			movieDict["genres"] = genresAsList
			for genre in genresAsList:
				if genre in allGenres.keys():
					break
				else:
					allGenres[genre] = 'true'
	finalMovieList.append(movieDict)

allGenres = allGenres.keys()

yearRange = []
yearRange.append(min(allYears))
yearRange.append(max(allYears))

votesRange = []
votesRange.append(min(allVoteAmounts))
votesRange.append(max(allVoteAmounts))

finalData = {}
finalData["yearRange"] = yearRange
finalData["votesRange"] = votesRange
finalData["genres"] = allGenres
finalData["movies"] = finalMovieList

pprint.pprint(allGenres)
pprint.pprint(yearRange)
pprint.pprint(votesRange)

with open('movies.json', 'w') as outfile:
    json.dump(finalData, outfile, encoding='latin-1') 

