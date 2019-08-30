import axios from 'axios'; //creating a global header

const setAuthToken = token => {
  //takes token as parameter
  if (token) {
    //local storeage
    axios.defaults.headers.common['x-auth-token'] = token; //sets to token passed in
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
