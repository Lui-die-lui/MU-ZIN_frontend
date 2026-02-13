
// signin 이후 뒤로가기 했을때 다시 signin 화면이 뜨는 등의 상황을 막기위해 지정
// ProtectedRoute에서 넘겨준 location 지정
export type AuthRedirectState = {
    from?: Location;
}