export function updateMobileList(item) {
    return {
        type: 'UPDATE_MOBILE_LIST',
        payload: {
            newItem: item
        }
    }
}
