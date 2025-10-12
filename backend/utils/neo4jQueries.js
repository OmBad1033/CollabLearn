export const createUserQuery = `
    CREATE (u:User {
        id: $id,    
        name: $username, 
        email: $email, 
        followCount: 0, 
        followersCount: 0
    })
    RETURN u
`;
