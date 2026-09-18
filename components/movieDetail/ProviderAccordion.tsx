import { Accordion, createStyles } from '@mantine/core'
import {
    IProviderDetails,
    IProviderResult,
} from 'pages/api/watchProviders/[id]'
import { IConfig } from 'pages/api/config'
import React from 'react'
import { BiCreditCard, BiMoviePlay } from 'react-icons/bi'
import { MdLiveTv } from 'react-icons/md'
import { SiHappycow } from 'react-icons/si'
import { ProviderItems } from './ProviderItem'

enum WatchKeys {
    ADS = 'Free with ads',
    BUY = 'To Buy',
    RENT = 'To Rent',
    FLATRATE = 'Streaming now',
}

interface IProviderAccordion {
    watchProviders: IProviderResult | void
    config: IConfig | void
    restrictWidth?: boolean
}

interface AConfigVals {
    title: WatchKeys
    value: WatchKeys
    icon: JSX.Element
    datakey: keyof IProviderResult
}

type AConfigType = Record<WatchKeys, AConfigVals>

const styles = createStyles(() => ({
    restrictedWidth: {
        width: '80%',
        maxWidth: 1024,
    },
}))

export const ProviderAccordion = ({
    watchProviders,
    config,
    restrictWidth = true,
}: IProviderAccordion) => {
    const { classes } = styles()
    const accordionConfig: AConfigType = {
        [WatchKeys.ADS]: {
            title: WatchKeys.ADS,
            value: WatchKeys.ADS,
            icon: <SiHappycow />,
            datakey: 'ads',
        },
        [WatchKeys.BUY]: {
            title: WatchKeys.BUY,
            value: WatchKeys.BUY,
            icon: <BiCreditCard />,
            datakey: 'buy',
        },
        [WatchKeys.FLATRATE]: {
            title: WatchKeys.FLATRATE,
            value: WatchKeys.FLATRATE,
            icon: <MdLiveTv />,
            datakey: 'flatrate',
        },
        [WatchKeys.RENT]: {
            title: WatchKeys.RENT,
            value: WatchKeys.RENT,
            icon: <BiMoviePlay />,
            datakey: 'rent',
        },
    }

    return watchProviders && config ? (
        <Accordion
            variant='contained'
            className={restrictWidth ? classes.restrictedWidth : ''}
        >
            {Object.entries(accordionConfig).map(([key, vals], i) =>
                watchProviders[vals.datakey] ? (
                    <Accordion.Item value={key} key={i}>
                        <Accordion.Control title={key} icon={vals.icon}>
                            {key}
                        </Accordion.Control>
                        <Accordion.Panel>
                            <ProviderItems
                                config={config}
                                providers={
                                    watchProviders[
                                        vals.datakey
                                    ] as IProviderDetails[]
                                }
                                link={watchProviders?.link}
                            />
                        </Accordion.Panel>
                    </Accordion.Item>
                ) : (
                    <React.Fragment key={key}></React.Fragment>
                )
            )}
        </Accordion>
    ) : (
        <></>
    )
}
