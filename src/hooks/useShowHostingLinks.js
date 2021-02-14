import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setShowHostingLinks } from '../redux/action-reducers-epic/SnShowHostingLinksAction';

export default function useShowHostingLinks() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setShowHostingLinks(true));
        return () => {
            dispatch(setShowHostingLinks(false));
        }
    }, [])
}