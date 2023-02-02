import React, { useEffect } from 'react'
import { useStore } from 'Explorer/useStore'
import { useAppSelector } from '../../hooks/reduxHooks'
import { getTheme } from '../../redux/slices/theme'
const Explorer = React.lazy(() => import('Explorer/Explorer'))

const ExplorerApp = () => {
    const { changeTheme } = useStore()
    const currentTheme = useAppSelector(getTheme)
    useEffect(() => {
        changeTheme(currentTheme)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <Explorer />
        </React.Suspense>
    )
}

export default ExplorerApp