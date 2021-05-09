import React, { useEffect, useState } from "react";
import AppDetailsHeader from "./AppDetailsHeader";
import AppInfo from "./AppInfo";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMyPublishedAppsAction } from "../../redux/action-reducers-epic/SnPublishAppAction";

const AppDetailsPage = ({toggle}) => {
  const { appId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyPublishedAppsAction()); 
  }, []);

  const { publishedAppsStore } = useSelector((state) => state.snPublishedAppsStore);
  const [data, setData] = useState();

  useEffect(() => {
    if (publishedAppsStore) {
      let appJSON = publishedAppsStore.find(appData => appData.id === appId);
      if(appJSON)
      {
        setData(appJSON);
      }
    }
  }, [publishedAppsStore, appId]); // if id or publishedAppsStore is changing run this method.

  {toggle ? document.body.className = "darkBodyColor" : document.body.className = "lightBodyColor"}

  return (
    <div>
      <AppDetailsHeader toggle={toggle} data={data} />
      <AppInfo toggle={toggle} data={data} appId={appId}/>
    </div>
  );
};

export default AppDetailsPage;
