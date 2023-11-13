import React, {useState} from 'react';
import {
    FormOutlined,
    LoginOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {Layout, Menu} from 'antd';
import UnitsViewPage from "../pages/unitsViewPage";
import MachineCategoryViewPage from "../pages/machineCategoryViewPage";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCarAlt, faCarSide, faClipboardList, faList, faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import MachineViewPage from "../pages/machineViewPage";
import MachineRequestPage from "../pages/machineRequestPage";

const {Header, Content, Sider} = Layout;

const navbarItems = [UserOutlined, LoginOutlined, SettingOutlined].map((icon, index) => {
    const key = String(index + 1);
    return {
        key: key,
        icon: React.createElement(icon),
        size: '32px'
    }
})

function getItem(label, key, icon, children, type, onClick) {
    return {
        key,
        icon,
        children,
        label,
        type,
        onClick,
    };
}

const App = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate()

    const sidebarItems = [
        getItem('اطلاعات پایه', '1', <FormOutlined/>, [
            getItem('واحدها', 'viewUnits', <FontAwesomeIcon icon={faList}/>, null, null, () => navigate('/unit/view')),
            getItem('دسته‌بندی‌ ماشین‌آلات', 'viewMachineCategories', <FontAwesomeIcon
                icon={faClipboardList}/>, null, null, () => navigate('/category/view')),
            getItem('ماشین‌آلات', 'machines', <FontAwesomeIcon
                icon={faCarSide}/>, null, null, () => navigate('/machine/view')),
        ]),
        getItem('درخواست‌ها', '2', <FontAwesomeIcon icon={faPenToSquare}/>, [
            getItem('درخواست ماشین‌آلات', 'machineRequest', <FontAwesomeIcon icon={faCarAlt}/>, null, null, () => navigate('/machine/request')),
            getItem()
        ])
    ];
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                className={'header-theme'}
            >
                <div className="demo-logo"/>
                <Menu theme="dark" mode="horizontal" items={navbarItems}/>
            </Header>
            <Layout>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
                       className='header-theme'
                       width={250}
                >
                    <div className="demo-logo-vertical"/>
                    <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={sidebarItems}/>
                </Sider>
                <Content>
                    <Routes>
                        <Route path="/unit/view" element={<UnitsViewPage/>}/>
                        <Route path="/category/view" element={<MachineCategoryViewPage/>}/>
                        <Route path="/machine/view" element={<MachineViewPage/>}/>
                        <Route path="/machine/request" element={<MachineRequestPage/>}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;