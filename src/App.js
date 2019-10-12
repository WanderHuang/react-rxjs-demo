import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import { Layout, Menu } from 'antd';
import AsyncDemo from './components/AsyncDemo';
import DragDemo from './components/DragDemo';
import CommunicateDemo from './components/CommunicateDemo';
const { Header, Sider } = Layout;

class App extends React.Component {
  render () {
    return (
      <Router>
        <Layout style={{ width: '100vw', height: '100vh' }}>
          <Header style={{color: '#aeaeae', textAlign: 'center', fontSize: '2em'}}>Rxjs 示例</Header>
          <Layout>
            <Sider>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                  <Link to="/example1">异步示例</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/example2">拖动示例</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link to="/example3">通信示例</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Switch>
                <Route path="/example1" component={AsyncDemo}></Route>
                <Route path="/example2" component={DragDemo}></Route>
                <Route path="/example3" component={CommunicateDemo}></Route>
              </Switch>
            </Layout>
          </Layout>
        </Layout>
      </Router>
    )
  }
}

export default App;
