const API_URL = ''

export default async function DeteleRoute(queryID){

    try {
        // Sending the list of locations
        const response = await fetch(`${API_URL}/history/delete`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({queryID: queryID})
        })
        
        // Get back the suggest route after calculation
        return await response.json()
        
    } catch (error) {
        console.error('Network Error:', error);
        return
    }

}