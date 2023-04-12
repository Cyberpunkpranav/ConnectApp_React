export default permissions=(permissions)=>{
    return(dispatch)=>{
        dispatch({
            type:'permissions',
            payload:permissions
        })
        
    }
}