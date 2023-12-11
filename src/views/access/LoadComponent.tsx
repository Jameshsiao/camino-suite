import React, { useEffect, useRef, useState } from 'react'
import { mountAccessComponents } from 'wallet/mountAccessComponents'
import store from 'wallet/store'
import { useAppDispatch } from '../../hooks/reduxHooks'
import { useEffectOnce } from '../../hooks/useEffectOnce'
import { updateAccount, updateValues } from '../../redux/slices/app-config'
import { updateAuthStatus } from '../../redux/slices/utils'

const LoadComponent = ({ type, props }) => {
    const ref = useRef(null)
    const [updateStore, setUpdateStore] = useState(null)
    const dispatch = useAppDispatch()
    const setAccount = account => dispatch(updateAccount(account))
    async function updateAuth() {
        await store.dispatch('Platform/updateAddressStates')
        dispatch(updateAuthStatus(updateStore?.isAuth))
    }
    useEffect(() => {
        dispatch(updateValues(updateStore))
        if (updateStore?.isAuth) {
            updateAuth()
        }
    }, [updateStore]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffectOnce(() => {
        mountAccessComponents(ref.current, type, {
            ...props,
            setUpdateStore,
            setAccount,
        })
    }) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div ref={ref} />
        </div>
    )
}

export default LoadComponent
