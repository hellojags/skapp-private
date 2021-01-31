import Apps from '../components/AppsComp/Apps'
import SubmitApp from '../components/SubmitApp/SubmitApp'
import Error from '../components/ErrorPage/Error'
import NoApps from '../components/NoApps/NoApps'
import InstalledApps from '../components/AppsComp/InstalledApps'
import Hosting from '../components/Hosting/Hosting'
import SubmitNewSite from '../components/Hosting/SubmitNewSite'
import NoDomain from '../components/Domain/NoDomain'
import Domains from '../components/Domain/Domains'
import StorageGateway from '../components/Hosting/StorageGateway'
import Settings from '../components/Setting/Settings'
import AppDetailsPage from '../components/AppDetails/AppDetailsPage'
import DeploySite from '../components/Hosting/DeploySite'
import SnLogin from '../components/Login/SnLogin'
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { APPSTORE_PROVIDER_MASTER_PUBKEY } from "../utils/SnConstants";
import AddNewSite from '../components/Hosting/AddNewSite'
const SnRouter = (props) => (
   
        <Switch>
            <Route exact path="/">
                <Redirect to={`/login`}/>
                {/* <Redirect to={`/public-skapps/?provider=${APPSTORE_PROVIDER_MASTER_PUBKEY}`}/> */}
            </Route>
            <Route exact path='/login'>
                <SnLogin />
            </Route>
            <Route exact path='/appdetail'>
                <AppDetailsPage />
            </Route>
            <Route exact path='/submitapp'>
                <SubmitApp />
            </Route>
            <Route exact path='/error'>
                <Error />
            </Route>
            <Route exact path='/noapp'>
                <NoApps />
            </Route>
            <Route exact path='/installedappps'>
                <InstalledApps />
            </Route>
            <Route exact path='/hosting'>
                <Hosting />
            </Route>
            <Route exact path='/submitsite'>
                <AddNewSite />
            </Route>
            <Route exact path='/domains'>
                <Domains />
            </Route>
            {/* <Route exact path='/addnewdomain'>
  <AddNewDomain />
</Route>
<Route exact path='/adddomaintxt'>
  <AddNewDomainTXT />
</Route> */}
            <Route exact path='/nodomain'>
                <NoDomain />
            </Route>
            <Route exact path='/storagegateway'>
                <StorageGateway />
            </Route>
            <Route exact path='/settings'>
                <Settings />
            </Route>
            <Route exact path='/deploysite/:appId'>
                <DeploySite />
            </Route>
            <Route exact path='/apps'>
                <Apps />
            </Route>
        </Switch>
  
)
export default SnRouter