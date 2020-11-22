import { bindActionCreators } from "redux";
import { performSearch } from "../../reducers/actions/sn.search.action";
import { setLoaderDisplay } from "../../reducers/actions/sn.loader.action";
// import {setSkappDetail} from "../../reducers/actions/sn.app-detail.action";
export function matchDispatcherToProps(dispatcher) {
    return bindActionCreators(
        {
            performSearch,
            setLoaderDisplay,
            // setSkappDetail,
        },
        dispatcher
    );
}
export function mapStateToProps(state) {
    return {
        userSession: state.userSession,
        history: state.snHistory,
        person: state.person,
        skyapp: state.snAppDetail,
    };
}
