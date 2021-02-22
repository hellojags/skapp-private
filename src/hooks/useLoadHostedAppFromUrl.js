import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setLoaderDisplay } from '../redux/action-reducers-epic/SnLoaderAction';
import { getMyHostedApps } from '../service/SnSkappService';



export function useLoadHostedAppFromUrl() {
    const [appDetail, setAppDetail] = useState();
    let { appId } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        appId && loadAppDetail();
    }, [appId]);

    const loadAppDetail = async ()=> {
        dispatch(setLoaderDisplay(true));
        const appDetail = (await getMyHostedApps([appId])).appDetailsList[appId];
        dispatch(setLoaderDisplay(false));
        setAppDetail(appDetail);
        return appDetail;
    };


    return [appDetail, setAppDetail];
}