export default reducer=(store =0 ,action)=>{
if(action.type =='permissions'){
    return state+action.payload
}else{
    return state 
}
} 