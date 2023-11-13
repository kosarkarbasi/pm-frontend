import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Space,} from 'antd';
import {useForm} from "antd/es/form/Form";
import {useDispatch, useSelector} from "react-redux";
import DraggableModal from "../components/draggableModal";
import {getAllMachineCategories, selectMachineCategories} from "../features/machineCategory/machineCategorySlice";
import {DatePicker as DatePickerJalali} from "antd-jalali";
import {addMachineRequest} from "../features/machineRequest/machineRequestSlice";
import TextArea from "antd/es/input/TextArea";
import {Option} from "antd/es/mentions";


const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const MachineRequestForm = ({openModal, setOpenModal}) => {

    const [dateRange, setDateRange] = useState()
    const [machineCategory, setMachineCategory] = useState('')
    const [machineRequestForm] = useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch()

    const machineCategories = useSelector(selectMachineCategories)
    const [machineCategoryList, setMachineCategoryList] = useState(machineCategories)

    const onFinish = (values) => {
        // console.log(machineRequestForm.getFieldsValue())
        dispatch(addMachineRequest({machineRequestForm, machineCategories, messageApi, setOpenModal}))
    };

    const handleCancel = () => {
        setOpenModal(false)
    }

    useEffect(() => {
        dispatch(getAllMachineCategories({messageApi}))
        console.log(machineCategoryList)
    }, [])


    useEffect(() => {
        // unit format ---> {value: '0', label: 'واحد ترابری'}
        setMachineCategoryList(machineCategories.map(machineCategory => ({
            value: machineCategory.MachineType,
            label: machineCategory.MachineType,
        })))
    }, [machineCategories])

    useEffect(() => {
        if (dateRange) {
            const diffDays = Math.abs(dateRange[0] - dateRange[1]) / 36e5;
            machineRequestForm.setFieldValue('RequestWorkTime', Math.floor(diffDays))
        }
    }, [dateRange])

    return (
        <>
            {contextHolder}
            <DraggableModal open={openModal}
                            setOpen={setOpenModal}
                            modalTitle={'درخواست ماشین‌آلات'}
                            handleOk={onFinish}
                            handleCancel={handleCancel}
                            footer={null}
                            okText='ثبت'
                            cancelText='لغو'
                            centered
            >
                <Form
                    name="machineRequestForm"
                    labelCol={{sm: {span: 24, offset: 0}, lg: {span: 8, offset: 3}}}
                    // wrapperCol={{span: 12,}}
                    style={{padding: '1rem', maxWidth: '90%', textAlign: 'center'}}
                    initialValues={{remember: true,}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={machineRequestForm}
                >
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="تاریخ درخواست"
                                name="RequestDate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا تاریخ درخواست را انتخاب نمایید',
                                    },
                                ]}
                            >
                                <DatePickerJalali style={{width: '100%'}} showTime/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="نام درخواست دهنده"
                                name="ApplicantName"
                            >
                                <Input readOnly/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="واحد درخواست دهنده"
                                name="ApplicantUnit"
                            >
                                <Input readOnly/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="نوع دستگاه"
                                name="MachineCategory"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا پلاک را وارد نمایید',
                                    },
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="انتخاب کنید"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    onChange={(value) => setMachineCategory(value)}
                                >
                                    {machineCategoryList.map((machineCat) => (
                                        <Option key={machineCat.label} value={machineCat.value}>
                                            {machineCat.value}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="از تاریخ - تا تاریخ"
                                name="RequestFromDateToDate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا نام راننده را وارد نمایید',
                                    },
                                ]}
                            >
                                <DatePickerJalali.RangePicker onChange={(value) => setDateRange(value)} showTime/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="مدت زمان کار"
                                name="RequestWorkTime"

                            >
                                <InputNumber style={{width: '100%'}} readOnly suffix="ساعت"/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="محل انجام کار"
                                name="WorkPlace"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا محل انجام کار را وارد نمایید'
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="نوع کار"
                                name="WorkType"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="دستگاه جایگزین"
                                name="ReplaceMachine"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder="انتخاب کنید"
                                    optionFilterProp="children"
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
                                    options={machineCategoryList.filter((o) => machineCategory !== o.value)}
                                ></Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row >
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item
                            label="شرح کار"
                            name="WorkDescription"
                            labelCol={{span: 5, offset: 0}}
                            rules={[
                                {
                                    required: false,
                                },
                            ]}
                        >
                            <TextArea rows={4} />
                        </Form.Item>
                        </Col>
                    </Row>

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
export default MachineRequestForm;