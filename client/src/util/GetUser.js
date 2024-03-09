const API_URL = ''

export default async function GetUser () {
    try{
        const response = await fetch(`${API_URL}/user`)

        if (!response.ok) {
            if (response.status === 401){
                console.log("Unauthorized Error")
                return
            } else {
                console.log ('Other Error')
                return
            }
        }

        return await response.json()

    } catch(error){
        console.error('Network Error:', error);
        return
    }
    

    
};


