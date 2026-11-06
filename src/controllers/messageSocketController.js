export default function messageSocketController(io, socket) {
 
  socket.on(NEW_MESSAGE_EVENT, createMessageHandler)
  
}
function createMessageHandler(data,cb){
   const messageResponse = await createMessageService(data);
   cb(
    success:true,
    message:'Message created successfully',
    data:messageResponse
   );
}