export const getUserInfo =  () => {
    let user =  localStorage.getItem('userData');
    if(!user) return null;
    let userInfo = JSON.parse(user);
    return userInfo.data;
}