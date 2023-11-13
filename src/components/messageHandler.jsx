import React from 'react';
import { Button, message, Space } from 'antd';
const MessageHandler = ({type, message}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const success = () => {
        messageApi.open({
            type: 'success',
            content: {message},
        });
    };
    const error = () => {
        messageApi.open({
            type: 'error',
            content: {message},
        });
    };
    const warning = () => {
        messageApi.open({
            type: 'warning',
            content: {message},
        });
    };
    const info = () => {
        messageApi.open({
            type: 'info',
            content: {message},
        });
    };
    return (
        <>
            {contextHolder}
            <Space>
                { type === 'success' && <Button onClick={success}>Success</Button>}
                {type === 'error' && <Button onClick={error}>Error</Button>}
                {type === 'warning' && <Button onClick={warning}>Warning</Button>}
                {type === 'warning' && <Button onClick={warning}>Info</Button>}
            </Space>
        </>
    );
};