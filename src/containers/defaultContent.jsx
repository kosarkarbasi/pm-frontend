import React from "react";
import {Breadcrumb, Layout, theme} from "antd";
import {Content} from "antd/es/layout/layout";
import {useNavigate} from "react-router-dom";

const DefaultContent = ({breadCrumbList, children}) => {
    const {token: {colorBgContainer}} = theme.useToken();
    const navigate = useNavigate()
    return (
        <Layout
            style={{
                padding: '0 24px 24px',
            }}
        >
            <Breadcrumb
                style={{
                    margin: '16px 0',
                    direction: 'ltr'
                }}
            >
                <Breadcrumb.Item onClick={() => navigate('/home')}>خانه</Breadcrumb.Item>
                {breadCrumbList.map((breadCrumb, index) => (
                    <Breadcrumb.Item key={index} onClick={breadCrumb.link}>{breadCrumb.title}</Breadcrumb.Item>
                ))}
            </Breadcrumb>
            <Content
                style={{
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                    background: colorBgContainer,
                }}
            >
                {children}
            </Content>
        </Layout>
    )
}

export default DefaultContent;