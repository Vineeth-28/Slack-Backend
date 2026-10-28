export const internalErrorResponse =(error)=>{
    return {
        success:false,
        err:error,
        data:{},
        message:'Internal Server Error'
    }

}

export const customErrorResponse =(error) =>{
    if(!error.message && !error.explaination){
        return internalErrorResponse(error)
    }
    return {
        success:false,
        err:error.explaination,
        data:[],
        message:error.message
    }
}

export const successResponse =(data, message)=>{
    return {
        success:true,
        message:message,
        data,
        error:[]
    }
}