import {addProductInPendingAPI} from "../http/api/pending";
import {useHistory} from "react-router-dom";


export function useAddInPending(){
    const history = useHistory();
    let addInPending = (slug_product) =>{
        addProductInPendingAPI(slug_product).then(() => {
            history.push("/in-pending/")
        }).catch(() =>{
            console.log('error')
        })
    }
    return {
        addInPending
    }
}