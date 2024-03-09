const axios = require('axios');
const qs = require('qs');


const API_KEY = process.env.GOOGLE_MAP_API_KEY;
const url = 'https://maps.googleapis.com/maps/api/distancematrix/json';


function tspCalculation(arrayData, startingPoint, locationPoints){
    const route = [ startingPoint ]
    let totalDistance = 0
    let previousPoint = startingPoint
    let temporaryMinDistancePoint = ''
    let minimumDistance = Infinity

    while (route.length !== locationPoints.length){
        arrayData.map(pairOfLocation => {
            if (pairOfLocation.origin === previousPoint &&
                pairOfLocation.distance < minimumDistance && 
                pairOfLocation.origin !== pairOfLocation.destination &&
                !route.includes(pairOfLocation.destination) 
                ){
                minimumDistance = pairOfLocation.distance
                temporaryMinDistancePoint = pairOfLocation
            }
        })
        route.push(temporaryMinDistancePoint.destination)
        previousPoint = temporaryMinDistancePoint.destination
        totalDistance += temporaryMinDistancePoint.distance
        minimumDistance = Infinity
    }

    // Return the distance between Last location and  Starting Point
    arrayData.map(pairOfLocation =>{
        if (pairOfLocation.origin === previousPoint &&
            pairOfLocation.destination === startingPoint
            ){
            totalDistance += pairOfLocation.distance
            return
        }
    })
    
    // Go back to the starting Point
    route.push(startingPoint)
    return {
        suggestRoute: route,
        totalDistance: totalDistance
    }
  }

// STARTING CODE //
function heuristicTSP(req, res){
    const { startingPoint } = req.body
    const { dropPoints } = req.body
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
            const { distance } = element;
            const destination = destinationPointsArray[destinationIndex].index;

            results.push({
              origin,
              destination,
              distance: distance.value,
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
    const result = tspCalculation(dataRow, startingPoint.index, locationPoints)
    res.json({
      suggestRoute: result.suggestRoute,
      totalDistance: result.totalDistance,
  })

//   Writing excel file to track the dataRow
//   const worksheet = xlsx.utils.json_to_sheet([
//     { Origin: 'Origin', Destination: 'Destination', Value: 'Value' },
//     ...dataRow
//   ]);

//   const workbook = xlsx.utils.book_new();
//   xlsx.utils.book_append_sheet(workbook, worksheet, 'Data');

//   const filePath = 'data.xlsx';
//   xlsx.writeFile(workbook, filePath);

//   console.log(`Data exported to ${filePath}`);

  })
  .catch(error => {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred' });
  });

}

module.exports = { 
    heuristicTSP
}