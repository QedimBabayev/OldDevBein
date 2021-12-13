import { API_BASE } from '../../config/env';
import { getToken } from '../../config/token';
import { getGroups } from '../getGroups-action';
import axios from 'axios';


export default function putData(controllerName, dataObject,isModal) {
    return dispatch => {
        dataObject.token = JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).Token : ''
        console.log(dataObject)
        dispatch({
            type: 'PUT_DATA',
            payload: axios.post(`${API_BASE}/` + controllerName + `/put.php`,
                dataObject
            ).then(result => result.data)
                .then(data => {
                    if (isModal) {
                        localStorage.setItem('newCusName',dataObject.name)
                    }
                    return data
                } )
        })
    }
}




