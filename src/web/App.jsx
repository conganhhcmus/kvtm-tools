const moment = require('moment')
import React, { useState } from "react";
import { Layout } from "antd";
const { Header, Content, Footer } = Layout;
import styles from './App.module.css'

import Filter from "./Filter";
import Table from "./Table";

const App = (props) => {
    const [refreshTime, setRefreshTime] = useState(moment().format('LTS'))

    return <Layout>
        <Header className={styles.header}>
            <h1>Welcome to Auto Tools!</h1>
        </Header>
        <Content className={styles.content}>
            <Filter refreshTime={refreshTime} setRefreshTime={setRefreshTime} />
            <Table refreshTime={refreshTime} setRefreshTime={setRefreshTime} />
        </Content>
        <Footer className={styles.footer}>
            <div>© Design by conganhhcmus</div>
        </Footer>
    </Layout>

}

export default App;