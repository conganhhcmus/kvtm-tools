import React from "react";
import { listGameOption } from '../../const/game';
import SkyGarden from "./SkyGarden";

const GameOptionsFilter = (props) => {
    const { selectedGame } = props;
    switch (selectedGame) {
        case listGameOption[0].key:
            return <SkyGarden {...props} />

        default:
            return <h3>Don't support this game!</h3>
    }
}

export default React.memo(GameOptionsFilter);