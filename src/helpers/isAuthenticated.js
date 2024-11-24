export const IsAuthenticated = () => {
    if (localStorage.getItem("user"))
        return true;
    return false;
  }