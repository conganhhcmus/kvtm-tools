const moment = require('moment')
import React, { useEffect, useState } from "react";
import { Divider, Table, Button, Flex, Row, Col, Popover } from 'antd';
import axios from "axios";
import styles from './Table.module.css'

const RunningTable = (props) => {
    const [runningDevice, setRunningDevice] = useState([]);
    const [selectedDevices, setSelectedDevices] = useState([]);
    const [logContent, setLogContent] = useState((<p>No Content</p>));

    const refreshData = () => {
        axios.get('/api/runningDevice').then(response => {
            setRunningDevice(response.data)
        })
    }
    useEffect(() => {
        const intervalId = setInterval(() => refreshData(), 60 * 1000);
        refreshData();
        return () => clearInterval(intervalId)
    }, [props.refreshTime])

    const stopDevice = (device) => {
        let payload = { device }
        axios.post('/api/stop', payload).then(response => {
            refreshData()
            setSelectedDevices([])
            props.setRefreshTime(moment().format('LTS'))
        })
    }

    const stopAllDevices = () => {
        let payload = { listDevices: selectedDevices }

        axios.post('/api/stopAll', payload).then(response => {
            refreshData()
            setSelectedDevices([])
            props.setRefreshTime(moment().format('LTS'))
        })
    }

    const viewLogsDevice = (device) => {
        axios.get(`/api/logs?device=${device}`).then(response => {
            let logs = response.data && response.data.logs
            logs = logs.replaceAll('\n', '<br/>')
            setLogContent(`<p>${logs}</p>`);
        })
    }

    const gameOptionContent = (gameOptions) => {
        let propertyNames = Object.getOwnPropertyNames(gameOptions).filter(x => x !== 'runAuto')
        return <div>
            {propertyNames.map(propertyName =>
                <p>{propertyName} : {gameOptions[propertyName].toString()}</p>
            )}
        </div>
    }

    const columns = [
        {
            title: 'Device',
            width: 200,
            dataIndex: 'device',
        },
        {
            title: 'Game',
            width: 300,
            dataIndex: 'game',
        },
        {
            title: 'Run Auto',
            width: 300,
            dataIndex: 'runAuto',
        },
        {
            title: 'Action',
            width: 250,
            dataIndex: '',
            render: (text, record) => <Row gutter={[20, 20]} justify="center" type="flex">
                <Col className="gutter-row" xs={24} sm={24} xl={8} xxl={8} style={{ textAlign: 'center' }}>
                    <Button type="primary" danger onClick={() => stopDevice(record.key)}>
                        Stop
                    </Button>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} xl={8} xxl={8} style={{ textAlign: 'center' }}>
                    <Popover
                        key={`log-${record.key}`}
                        rootClassName={styles.popupLogs}
                        placement="leftBottom"
                        content={<div dangerouslySetInnerHTML={{ __html: logContent }} />}
                        title={`Log of ${record.key}`}
                        trigger="click">
                        <Button type="primary" onClick={() => viewLogsDevice(record.key)}>Logs</Button>
                    </Popover>
                </Col>
                <Col className="gutter-row" xs={24} sm={24} xl={8} xxl={8} style={{ textAlign: 'center' }}>
                    <Popover
                        key={`detail-${record.key}`}
                        rootClassName={styles.popupDetail}
                        placement="leftBottom"
                        content={gameOptionContent(record.gameOptions)}
                        title={`Game Option of ${record.key}`}
                        trigger="click">
                        <Button type="primary">Detail</Button>
                    </Popover>
                </Col>
            </Row >,
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedDevices,
        type: 'checkbox',
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedDevices(selectedRowKeys);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            // Column configuration not to be checked
            name: record.name,
        }),
    };

    return <>
        <Divider></Divider>
        <Table
            title={() => <Flex gap="middle" justify="space-between" align="center" vertical={false}>
                <label style={{ fontSize: 20, fontWeight: 500 }}>Running Devices</label>
                <Button disabled={selectedDevices.length <= 0} type="primary" danger onClick={stopAllDevices}>
                    Stop All
                </Button>
            </Flex>}
            bordered={true}
            rowSelection={rowSelection}
            columns={columns}
            //scroll={{ x: 2000 }}
            dataSource={runningDevice.map(item => ({
                ...item,
                key: item.device
            }))}
            pagination={{ position: ['bottomCenter'], pageSize: 5 }}
        />
    </>
}

export default React.memo(RunningTable);