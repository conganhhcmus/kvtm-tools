import React from "react";
import { Col } from "antd";
import { listGameOption } from '../../const/game';
import SkyGarden from "./SkyGarden";

const GameOptionsFilter = (props) => {
    const { selectedGame } = props;
    switch (selectedGame) {
        case listGameOption[0].key:
            return <SkyGarden {...props} />

        default:
            return <Col className="gutter-row" xs={24} sm={24} xl={16} xxl={16}>
                <h3>Don't support this game!</h3>
            </Col>
    }
}

export default React.memo(GameOptionsFilter);