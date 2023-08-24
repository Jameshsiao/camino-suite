import React, { useEffect, useState } from 'react'

import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { useNavigate } from 'react-router'

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export default function Links() {
    const [value, setValue] = useState(0)
    const navigate = useNavigate()
    const path = window.location.pathname
    const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue)
    useEffect(() => {
        if (path === '/settings') setValue(0)
        else if (path === '/settings/create-multisig') setValue(1)
        else setValue(0)
    }, [path])
    return (
        <Box sx={{ display: 'flex', cursor: 'pointer', width: '100%', maxWidth: '1536px' }}>
            <Tabs
                value={value}
                onChange={handleChange}
                textColor="secondary"
                sx={{ '& .MuiTabs-indicator': { display: 'none' }, height: '61px' }}
                scrollButtons="auto"
                variant="scrollable"
                allowScrollButtonsMobile
            >
                <Tab
                    className="tab"
                    disableRipple
                    label="Save account"
                    onClick={() => navigate('/settings')}
                    {...a11yProps(0)}
                    sx={{ '&::after': { display: value === 0 ? 'block' : 'none' } }}
                />
                <Tab
                    className="tab"
                    disableRipple
                    label="Multisignature Wallet"
                    onClick={() => navigate('create-multisig')}
                    {...a11yProps(1)}
                    sx={{ '&::after': { display: value === 1 ? 'block' : 'none' } }}
                />
            </Tabs>
        </Box>
    )
}
