import { StatusCodes } from "http-status-codes";

class clientError extends Error {
    constructor(error){
        super();
        this.name='Client Error'
        this.measage=error.message
        this.explaination = error.explaination
        this.StatusCode = error.StatusCode ? error.statusCode : StatusCodes.BAD_REQUEST
    }
}

export default clientError