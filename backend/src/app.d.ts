declare namespace Express {
    export interface Request {
        currentUser: User
    }

    type User = {
        role: String
    }
}
