import { API_LOGIN } from '../../config/env';
import axios from 'axios';



export function updateLogged(bool, mess) {
    return {
        type: 'UPDATE_LOGGED',
        payload: {
            loggedIn: bool,
            error: mess
        }
    }
}


export function putLogin(values) {
    return dispatch => {
        dispatch({
            type: 'PUT_LOGIN',
            payload: axios.post(`${API_LOGIN}/send.php`,
                values
            )
                .then(result => result.data)
                .then((data) => {
                    if (data.Headers.ResponseStatus === '0') {
                        localStorage.setItem("user", JSON.stringify(data.Body));
                        dispatch(updateLogged(true))
                    }
                    else if (data.Headers.ResponseStatus != '0') {
                        dispatch(updateLogged(false, 'wrong'))

                    }
                    return data
                })




        })
    }
}
