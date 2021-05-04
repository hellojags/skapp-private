import Apps from '../components/AppsComp/Apps'
import SubmitApp from '../components/SubmitApp/SubmitApp'
import EditPublishApp from '../components/SubmitApp/EditPublishApp'
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
import DescoverDev from '../components/DescoverDev/DescoverDev'
import AppStore from '../components/AppsComp/AppStore'
import Login from '../components/Auth/Login'
import EditSite from '../components/Hosting/EditSite'
import {
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { APPSTORE_PROVIDER_MASTER_PUBKEY } from "../utils/SnConstants";
import AddNewSite from '../components/Hosting/AddNewSite'
const SnRouter = ({toggle}) => (
   
        <Switch>
            <Route exact path='/'>
                  <AppStore toggle={toggle} />
            </Route>
            <Route exact path='/descoverdev'>
                  <DescoverDev toggle={toggle} />
            </Route>
            {/* <Route exact path="/">
                <Redirect to={`/login`}/>
                 <Redirect to={`/public-skapps/?provider=${APPSTORE_PROVIDER_MASTER_PUBKEY}`}/> */}
            {/* </Route> */}
            <Route exact path='/login'>
                  <Login toggle={toggle} />
            </Route>
            <Route exact path='/appdetail/:appId'>
                <AppDetailsPage toggle={toggle} />
            </Route>
            <Route path='/submitapp/:appId?'>
                <SubmitApp toggle={toggle} />
            </Route>
            <Route path='/editpublishapp/:appId'>
                <EditPublishApp toggle={toggle} />
            </Route>
            <Route exact path='/error'>
                <Error toggle={toggle} />
            </Route>
            <Route exact path='/noapp'>
                <NoApps toggle={toggle} />
            </Route>
            <Route exact path='/installedapps'>
                <InstalledApps toggle={toggle} />
            </Route>
            <Route exact path='/hosting'>
                <Hosting toggle={toggle} />
            </Route>
            <Route exact path='/submitsite'>
                <AddNewSite toggle={toggle} />
            </Route>
            <Route exact path='/editsite/:appId'>
                <EditSite toggle={toggle} />
            </Route>
            <Route exact path='/domains'>
                <Domains toggle={toggle} />
            </Route>
            {/* <Route exact path='/addnewdomain'>
  <AddNewDomain />
</Route>
<Route exact path='/adddomaintxt'>
  <AddNewDomainTXT />
</Route> */}
            <Route exact path='/nodomain'>
                <NoDomain toggle={toggle} />
            </Route>
            <Route exact path='/storagegateway'>
                <StorageGateway toggle={toggle} />
            </Route>
            <Route exact path='/usersettings'>
                <Settings toggle={toggle} />
            </Route>
            <Route exact path='/deploysite/:appId?'>
                <DeploySite toggle={toggle} />
            </Route>
            <Route exact path='/apps'>
                <Apps toggle={toggle} />
            </Route>
        </Switch>
  
)
export default SnRouter