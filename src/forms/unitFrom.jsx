import React from 'react';
import {Button, Form, Input, message,} from 'antd';
import {useForm} from "antd/es/form/Form";
import {useDispatch} from "react-redux";
import {addUnit} from "../features/unit/unitSlice";
import DraggableModal from "../components/draggableModal";


const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const UnitFrom = ({openModal, setOpenModal}) => {
    const [unitForm] = useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch()

    const onFinish = (values) => {
        dispatch(addUnit({unitForm, messageApi}))
        setOpenModal(false)
    };

    const handleCancel = () => {
        setOpenModal(false)
    }

    return (
        <>
            {contextHolder}
            <DraggableModal open={openModal}
                            setOpen={setOpenModal}
                            modalTitle={'ثبت واحد جدید'}
                            handleOk={onFinish}
                            handleCancel={handleCancel}
                            footer={null}
                            okText='ثبت'
                            cancelText='لغو'
                            centered>
                <Form
                    name="unitForm"
                    labelCol={{span: 8,}}
                    wrapperCol={{span: 16,}}
                    style={{maxWidth: '90%',}}
                    initialValues={{remember: true,}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={unitForm}
                >
                    <Form.Item
                        label="نام واحد"
                        name="unitName"
                        rules={[
                            {
                                required: true,
                                message: 'لطفا نام واحد را وارد کنید',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="مدیر واحد"
                        name="managerName"
                        rules={[
                            {
                                required: true,
                                message: 'لطفا نام مدیر واحد را وارد کنید',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                    </Form.Item>
                    <div className='ant-modal-footer'>
                        <Button key="back" className='btn-danger' onClick={handleCancel}>
                            لغو
                        </Button>
                        <Button key='submit' type="primary" htmlType="submit" className='btn-success'
                        >
                            ذخیره
                        </Button>
                    </div>
                </Form>
            </DraggableModal>
        </>
    );
}
export default UnitFrom;