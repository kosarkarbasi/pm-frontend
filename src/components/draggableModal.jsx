import React, {useRef, useState} from 'react';
import Draggable from 'react-draggable';
import {Modal} from 'antd';

const DraggableModal = ({open, setOpen, modalTitle, handleOk, handleCancel, footer, okText, cancelText, children}) => {
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({
        left: 0, top: 0, bottom: 0, right: 0,
    });

    const draggleRef = useRef(null);


    const onStart = (_event, uiData) => {
        const {clientWidth, clientHeight} = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    return (<>
        <Modal
            title={<div
                style={{
                    width: '100%', cursor: 'move',
                }}
                onMouseOver={() => {
                    if (disabled) {
                        setDisabled(false);
                    }
                }}
                onMouseOut={() => {setDisabled(true);}}
                onFocus={() => {}}
                onBlur={() => {}}
            >
                {modalTitle}
            </div>}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={okText}
            footer={footer}
            cancelText={cancelText}
            modalRender={(modal) => (<Draggable
                disabled={disabled}
                bounds={bounds}
                nodeRef={draggleRef}
                onStart={(event, uiData) => onStart(event, uiData)}
            >
                <div ref={draggleRef}>{modal}</div>
            </Draggable>)}
        >
            {children}
        </Modal>
    </>);
};

export default DraggableModal;