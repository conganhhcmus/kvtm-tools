const moment = require('moment')
import React, { useEffect, useState } from "react";
import { Col, Row, Select, Flex } from "antd";
import GameOptionsFilter from './gameFilter'
import styles from "./Filter.module.css"
import axios from 'axios';

const Filter = (props) => {
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [selectedGame, setSelectedGame] = useState('');
    const [devicesOption, setDevicesOption] = useState([]);
    const [listGameOption, setListGameOption] = useState([]);

    const refreshSettings = () => {
        axios.get('/api/settings').then(function (response) {
            setDevicesOption(response.data.listDevices);
            setListGameOption(response.data.listGameOption);
            setSelectedDevices(response.data.listDevices.filter(x => !x.disabled).map(x => x.value));
            setSelectedGame(response.data.listGameOption[0].key);
        })
    }

    useEffect(() => {
        refreshSettings()
    }, [props.refreshTime]);

    const onSelectedDevice = (value) => {
        setSelectedDevices(value)
    }

    const onSelectedGame = (value) => {
        setSelectedGame(value)
    }

    const runAuto = (gameOptions) => {
        if (selectedDevices.length <= 0) {
            alert('No devices selected!');
            return;
        }
        let payload = {
            selectedDevices,
            selectedGame,
            gameOptions
        }

        axios.post('/api/start', payload).then(response => {
            refreshSettings()
            props.setRefreshTime(moment().format('LTS'))
        })
    }

    return <>
        <Row gutter={[40, 0]}>
            <Col xs={24} xl={8}>
                <h3>Settings</h3>
                <Row justify={"left"} gutter={[40, 20]}>
                    <Col className="gutter-row" xs={24} xl={24}>
                        <Flex justify="space-between" gap="middle" align="center" vertical={false}>
                            <label>Devices</label>
                            <Select
                                style={{ width: '80%', }}
                                mode="multiple"
                                placeholder='Select Devices ...'
                                maxTagCount='responsive'
                                value={selectedDevices}
                                onChange={onSelectedDevice}
                                options={devicesOption.map((item) => ({
                                    value: item.value,
                                    label: item.label,
                                    disabled: item.disabled,
                                }))}
                            />
                        </Flex>
                    </Col>
                    <Col className="gutter-row" xs={24} xl={24}>
                        <Flex justify="space-between" gap="middle" align="center" vertical={false}>
                            <label>Game</label>
                            <Select
                                style={{ width: '80%', }}
                                showSearch
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                }
                                options={listGameOption.map(item => ({
                                    value: item.key, label: item.name
                                }))}
                                onChange={onSelectedGame}
                                value={selectedGame}
                            />
                        </Flex>
                    </Col>
                </Row>
            </Col>

            <GameOptionsFilter selectedGame={selectedGame} runAuto={runAuto} />
        </Row>
    </>
}

export default React.memo(Filter);