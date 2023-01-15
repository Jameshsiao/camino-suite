import { mountAccessComponents } from "wallet/mountAccessComponents";
import React, { useRef, useEffect, useState } from "react";
import { updateAuthStatus, updateValues } from "../../redux/slices/app-config";
import { useAppDispatch } from "../../hooks/reduxHooks";

const LoadComponent = ({ type, props }) => {
  const ref = useRef(null);
  const [updateStore, setUpdateStore] = useState(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(updateValues(updateStore));
    if (updateStore?.isAuth) dispatch(updateAuthStatus(updateStore?.isAuth));
  }, [updateStore]);
  useEffect(() => {
    mountAccessComponents(ref.current, type, {
      ...props,
      setUpdateStore,
    });
  }, []);

  return (
    <div>
      <div ref={ref} />
    </div>
  );
};

export default LoadComponent;
