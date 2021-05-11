import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMyPublishedAppsAction } from "../../redux/action-reducers-epic/SnPublishAppAction";
import AppDetailsHeader from "./AppDetailsHeader";
import AppInfo from "./AppInfo";

const AppDetailsPage = ({ toggle }) => {
  const [data, setData] = useState();

  const { appId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyPublishedAppsAction());
  }, [dispatch]);

  const { publishedAppsStore } = useSelector(
    (state) => state.snPublishedAppsStore
  );

  useEffect(() => {
    if (publishedAppsStore) {
      let appJSON = publishedAppsStore.find((appData) => appData.id === appId);
      if (appJSON) {
        setData(appJSON);
      }
    }
  }, [publishedAppsStore, appId]); // if id or publishedAppsStore is changing run this method.

  toggle
    ? (document.body.className = "darkBodyColor")
    : (document.body.className = "lightBodyColor");

  return (
    <div>
      <AppDetailsHeader toggle={toggle} data={data} />
      <AppInfo toggle={toggle} data={data} appId={appId} />
    </div>
  );
};

export default AppDetailsPage;
