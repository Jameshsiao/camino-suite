import { mount } from "wallet/mountApp";
import React, { useRef, useEffect, useState } from "react";
import { useAppDispatch } from "../hooks/reduxHooks";
import { updateAuthStatus, updateValues } from "../redux/slices/app-config";

const LoadWallet = () => {
  const [updateStore, setUpdateStore] = useState(null);
  const [logOut, setLogOut] = useState(false);
  const dispatch = useAppDispatch();
  const ref = useRef(null);
  useEffect(() => {
    dispatch(updateValues(updateStore));
    if (updateStore) dispatch(updateAuthStatus(true));
  }, [updateStore]);
  useEffect(() => {
    dispatch(updateValues(updateStore));
  }, [logOut]);
  useEffect(() => {
    mount(ref.current, { setUpdateStore, setLogOut });
  }, []);

  return (
    <div>
      <div ref={ref} />
    </div>
  );
};

const Wallet = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LoadWallet />
    </React.Suspense>
  );
};

export default Wallet;
