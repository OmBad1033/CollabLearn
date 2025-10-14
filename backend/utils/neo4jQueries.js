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

export const followUserQuery = `MATCH (follower:User {id: $followerId }), (following:User {id: $followingId }) MERGE (follower)-[r:FOLLOWS]->(following) RETURN r`;

export const unfollowQuery = `MATCH (follower:User {id:followerId})-[r:FOLLOWS]->(following:User {id:followingId}) DELETE r RETURN count(r) as deleted`;

export const followStatusQuery = `MATCH (follower:User {id: $followerId}) OPTIONAL MATCH (follower)-[r:FOLLOWS]->(following:User {id: $followingId}) RETURN r IS NOT NULL AS isFollowing`;
