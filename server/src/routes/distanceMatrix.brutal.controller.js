const { addUserTotalQuery } = require("../models/userInfor.model")

const axios = require('axios');
const qs = require('qs');

const API_KEY = process.env.GOOGLE_MAP_API_KEY;
const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';

function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
  
    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;
        result.push(permutation.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    return result;
  }

function findDistanceFromDataRow(origin, destination, dataRow){
    for (let i = 0; i < dataRow.length; i++){
        if (dataRow[i]['origin'] === origin && dataRow[i]['destination'] === destination){
            return {
              distance: dataRow[i]['distance'],
              duration: dataRow[i]['time']
            }
        }
    }
}

function convertSecond (second){
  const seconds = second
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return hours + " hr " + minutes + " minute"
}
function bruteForce(dataRow, possibileCombination){
    let bestRoute = []
    let minimumDistance = Infinity
    let totalTravelTime = ''
    for (let i = 0; i < possibileCombination.length; i++){
        let route = possibileCombination[i]
        let distanceForThisRoute = 0
        let durationForThisRoute = 0

        for (let j = 0; j < route.length - 1; j++){
            origin = route[j]
            destination = route[j + 1]

            const result = findDistanceFromDataRow(origin, destination, dataRow)
            distanceForThisRoute += result.distance
            durationForThisRoute += result.duration
        }
        if (distanceForThisRoute < minimumDistance){
            minimumDistance = distanceForThisRoute
            bestRoute = route
            totalTravelTime = durationForThisRoute
        }
    }
    
    return {
      suggestRoute: bestRoute,
      totalDistance: minimumDistance,
      totalTravelTime: convertSecond(totalTravelTime)
    }
}

async function brutalForceTSP(req, res){
    const { startingPoint } = req.body
    const { dropPoints } = req.body

    const userID = req.user

    await addUserTotalQuery(userID)

    const locationPoints = [
        startingPoint,
    ];

    dropPoints.map(dropPoint => locationPoints.push(dropPoint))


  // Chunk the location point into 10 element for each request.
  const chunkSize = 10
  const chunkedLocationPoint = []

  for (let i = 0; i < locationPoints.length; i += chunkSize) {
      const chunk = locationPoints.slice(i, i + chunkSize);
      chunkedLocationPoint.push(chunk);
    }

  //  display chunkedLocationPoint
  //   for (let i = 0; i < chunkedLocationPoint.length; i++){
  //     console.log('---start--')
  //     console.log(chunkedLocationPoint[i])
  //   }

  // const params = {
  //     origins: locationPoints.map(locationPoint => `${locationPoint.coordinate.lat},${locationPoint.coordinate.lng}`).join('|'),
  //     destinations: locationPoints.map(locationPoint => `${locationPoint.coordinate.lat},${locationPoint.coordinate.lng}`).join('|'),
  //     key: API_KEY,
  // };

  const axiosRequests = [];

  for (let i = 0; i < chunkedLocationPoint.length; i++) {
    for (let j = 0; j < chunkedLocationPoint.length; j++) {
      const originPointsArray = chunkedLocationPoint[i];
      const destinationPointsArray = chunkedLocationPoint[j];

      const params = {
        origins: originPointsArray.map(locationPoint => `${locationPoint.coordinate.lat},${locationPoint.coordinate.lng}`).join('|'),
        destinations: destinationPointsArray.map(locationPoint => `${locationPoint.coordinate.lat},${locationPoint.coordinate.lng}`).join('|'),
        key: API_KEY,
      };

      const request = axios.get(`${url}?${qs.stringify(params)}`)
        .then(response => {
          const { data } = response;
          const { rows } = data;

          const results = [];

          rows.forEach((row, originIndex) => {
            const { elements } = row;
            const origin = originPointsArray[originIndex].index;

            elements.forEach((element, destinationIndex) => {
              const { distance, duration } = element;
              const destination = destinationPointsArray[destinationIndex].index;

              results.push({
                origin,
                destination,
                distance: distance.value,
                time: duration.value
              });

 
            });
          });
          return results;
      })
      .catch(error => {
        console.error('Error:', error.message);
        throw error;
      });
    axiosRequests.push(request);
    }
  }

  Promise.all(axiosRequests)
  .then(results => {
    const dataRow = [].concat(...results);
    console.log(dataRow)
    const permutationArray = []

    dropPoints.map(dropPoint => permutationArray.push(dropPoint['index']))
    const combination = permute(permutationArray);

    //   Add starting point and ending point the front and back of the array
      for (let i = 0; i < combination.length; i ++){
        combination[i].unshift(0)
        combination[i].push(0)
      }
      
      console.log(combination)
    // Calculating the minimum route taken place
    const result = bruteForce(dataRow, combination)
    res.json({
      suggestRoute: result.suggestRoute,
      totalDistance: result.totalDistance,
      totalDuration: result.totalTravelTime
    })
  })
    
}

module.exports = {
    brutalForceTSP
}