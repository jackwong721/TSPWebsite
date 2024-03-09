// This function is saving the user's calculated route
const API_URL = ""

export default async function SaveRoute(routeData, suggestRouteWithFullInfo){

    const combinedData = {...routeData, sortedRoute: suggestRouteWithFullInfo}
    try {
        // Sending the list of locations
        const response = await fetch(`${API_URL}/history/save`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(combinedData)
        })

        if (!response.ok) {
            if (response.status === 401) {
              console.log('Unauthorized Error');
              return
              // You can perform further actions here, like displaying an error message to the user
            } else {
              console.log('Other Error');
              return
              // Handle other errors
            }
          }
        
        // Get back the suggest route after calculation
        return response.json()
    } catch(error) {
        console.error('Network Error:', error);
        return
    }

}