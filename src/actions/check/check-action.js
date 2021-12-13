export  function getCheckPage(bool){
	return {
		type: 'CHECK_PAGE',
		payload: {
            show : bool
		}
	}
}
export function getLoginPage(bool) {
  return {
    type: "CHECK_LOGIN",
    payload: {
      show: bool,
    },
  };
}
;