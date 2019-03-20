export default function commonReducer(state ,action) {
    switch (action.type) {
        case "GET_PROMOCODE":
            return { ...state, promoCode: action.promocode };
        default:
            return state;
    }
    
}