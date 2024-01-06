import React, { useEffect, useState } from "react";
import { Checkbox, Col, Row, Select, Button, InputNumber, Flex } from "antd";
import styles from "./SkyGarden.module.css"
import axios from "axios";

const SkyGarden = (props) => {
    const { selectedGame } = props;
    const [selectedAuto, setSelectedAuto] = useState('');
    const [frequency, setFrequency] = useState(1);
    const [openGameAfter, setOpenGameAfter] = useState(1);
    const [gameOption, setGameOption] = useState([]);
    const [autoOption, setAutoOption] = useState([]);

    useEffect(() => {
        axios.get(`/api/gameOptions?game=${selectedGame}`).then((response) => {
            setAutoOption(response.data);
            setSelectedAuto(response.data[0].key);
        })
    }, [])

    const onSelectedAuto = (value) => {
        setSelectedAuto(value)
    }

    const onSelectedGameOption = (value) => {
        setGameOption(value)
    }

    const runAuto = () => {
        const data = {
            runAuto: selectedAuto,
            openGame: gameOption.includes('openGame'),
            hasEventTree: gameOption.includes('hasEventTree'),
            openChest: gameOption.includes('openChest'),
            openGameAfter,
            frequency
        }
        props.runAuto(data)
    }

    return <>
        <Col className="gutter-row" xs={24} xl={16}>
            <h3>Game Option</h3>
            <Row>
                <Checkbox.Group style={{ width: '100%' }} onChange={onSelectedGameOption}>
                    <Row gutter={[40, 20]}>
                        <Col className="gutter-row" xs={24} xl={12}>
                            <Flex justify="space-between" gap="middle" align="center" vertical={false}>
                                <label>Run Auto</label>
                                <Select
                                    style={{ width: '80%' }}
                                    showSearch
                                    placeholder="Search to Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={autoOption.map(item => ({
                                        value: item.key,
                                        label: item.name
                                    }))}
                                    onChange={onSelectedAuto}
                                    value={selectedAuto}
                                />
                            </Flex>
                        </Col>
                        <Col className="gutter-row" xs={18} xl={12}>
                            <Flex justify="space-between" gap="middle" align="center" vertical={false}>
                                <Checkbox value="openGame">Open Game</Checkbox>
                                <Checkbox value="hasEventTree">Has Event Tree</Checkbox>
                                <Checkbox value="openChest">Open Chest</Checkbox>
                            </Flex>
                        </Col>
                        <Col xs={8} xl={6}>
                            <Flex gap="middle" align="center" vertical={false}>
                                <label>Open Game After</label>
                                <InputNumber disabled={!gameOption.includes('openGame')} className={styles.inputNumber} min={1} max={99} value={openGameAfter} onChange={value => setOpenGameAfter(value)} />
                            </Flex>
                        </Col>
                        <Col xs={8} xl={5}>
                            <Flex gap="middle" align="center" vertical={false}>
                                <label>Frequency</label>
                                <InputNumber className={styles.inputNumber} min={1} max={99} value={frequency} onChange={value => setFrequency(value)} />
                            </Flex>
                        </Col>

                        <Col xs={6} xl={4}>
                            <Button type="primary" loading={false} onClick={runAuto}>
                                Run now!
                            </Button>
                        </Col>
                    </Row>
                </Checkbox.Group>
            </Row>
        </Col></>
}

export default React.memo(SkyGarden);