const API_URL = ''

export default async function GenerateRoute(locations){

    try {
        // Sending the list of locations
        const response = await fetch(`${API_URL}/route/brutal`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(locations)
        })
        
        // Get back the suggest route after calculation
        return await response.json()
    } catch (error) {
        console.error('Network Error:', error);
        return
    }

}