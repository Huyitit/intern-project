

export const login = async (user: {username: string, password:string}) => {  
    try {
        const response = await fetch('http://localhost:3006/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(
                {
                    user:
                    {
                        username: user.username,
                        password: user.password
                    }
                }
            )
        })

        return response;
    } catch (error){
        console.log(error);
    }
}
