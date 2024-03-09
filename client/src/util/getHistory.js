const API_URL = ''

export default async function GetHistory(){

    try {
     // Rendering the history
        const response = await fetch(`${API_URL}/history`)

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
      
        return await response.json()
    } catch(error){
        console.error('Network Error:', error);
        return
        
    }


}