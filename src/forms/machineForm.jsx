import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Space,} from 'antd';
import {useForm} from "antd/es/form/Form";
import {useDispatch, useSelector} from "react-redux";
import DraggableModal from "../components/draggableModal";
import {getAllMachineCategories, selectMachineCategories} from "../features/machineCategory/machineCategorySlice";
import TextArea from "antd/es/input/TextArea";
import DefaultTable from "../tables/defaultTable";
import DatePicker from "react-datepicker2";
import moment from "jalali-moment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {addMachine} from "../features/machine/machineSlice";
import {getEnumCategory, selectEnum} from "../features/enum/enumSlice";


const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const MachineForm = ({openModal, setOpenModal}) => {
    const [openServiceModal, setOpenServiceModal] = useState(false)
    const [keyCount, setKeyCount] = useState(0)
    const [machineServiceList, setMachineServiceList] = useState([])
    const [commodityUnitList, setCommodityUnitList] = useState([])
    const [entryDateTime, setEntryDateTime] = useState(moment(new Date()))

    const [machineForm] = useForm()
    const [machineServiceForm] = useForm()
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useDispatch()

    const machineCategories = useSelector(selectMachineCategories)
    const unitEnums = useSelector(selectEnum)
    const [machineCategoryList, setMachineCategoryList] = useState(machineCategories)


    const onFinishMachineService = () => {
        machineServiceForm.validateFields()
            .then(() => {
                const newMachineService = {
                    key: keyCount,
                    ServiceableComponent: machineServiceForm.getFieldValue('ServiceableComponent'),
                    ReplacementTime: machineServiceForm.getFieldValue('ReplacementTime'),
                    VolumeStandard: machineServiceForm.getFieldValue('VolumeStandard'),
                    CommodityUnit: machineServiceForm.getFieldValue('CommodityUnit'),
                    CommodityUnitID: machineServiceForm.getFieldValue('CommodityUnitID'),
                    IsActive: machineServiceForm.getFieldValue('IsActive'),
                    Description: machineServiceForm.getFieldValue('Description'),
                }
                setMachineServiceList(oldValue => [...oldValue, newMachineService])
                machineServiceForm.resetFields();

                setOpenServiceModal(false);
                setKeyCount(keyCount + 1)

                messageApi.open({
                    type: 'success',
                    content: 'آیتم جدید با موفقیت اضافه شد',
                });
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    };

    const onFinishFailedMachineService = () => {
        messageApi.open({
            type: 'error',
            content: 'خطا'
        })
    }

    const onFinish = (values) => {
        dispatch(addMachine({machineForm, messageApi, setOpenModal}))
    };

    const handleCancel = () => {
        setOpenModal(false)
    }

    useEffect(() => {
        dispatch(getAllMachineCategories({messageApi}))
        dispatch(getEnumCategory({messageApi, category: 'واحد کالا'}))
    }, [])


    useEffect(() => {
        // unit format ---> {value: '0', label: 'واحد ترابری'}
        setMachineCategoryList(machineCategories.map(machineCategory => ({
            value: machineCategory.MachineType,
            label: machineCategory.MachineType
        })))
    }, [machineCategories])

    useEffect(() => {
        setCommodityUnitList(unitEnums.map(unit => ({
            value: unit.Title,
            label: unit.Title,
        })))
    }, [unitEnums])

    useEffect(() => {
        machineForm.setFieldValue('EntryDateTime', entryDateTime)
    }, [entryDateTime])

    useEffect(() => {
        machineForm.setFieldValue('MachineServices', machineServiceList)
    }, [machineServiceList])

    const serviceColumns = [
        {
            title: 'جزء سرویس شونده',
            dataIndex: 'ServiceableComponent',
            editable: true,
            type: 'text',
            width: '20%',
            fixed: 'left'
        },
        {
            title: 'زمان تعویض',
            dataIndex: 'ReplacementTime',
            editable: true,
            type: 'text',
            width: '15%',
        },
        {
            title: 'استاندارد حجم',
            dataIndex: 'VolumeStandard',
            editable: true,
            type: 'text',
            width: '15%',
            render: (value) => {
                if (value === 'undefined') return '-'
                return value
            },
        },
        {
            title: 'واحد کالا',
            dataIndex: 'CommodityUnit',
            editable: true,
            type: 'text',
            width: '20%',
        },
        {
            title: 'توضیحات',
            dataIndex: 'Description',
            editable: true,
            type: 'text',
            render: (value) => {
                if (value === 'undefined') return '-'
                return value
            },
            width: '20%',
        },
        {
            title: 'فعال',
            dataIndex: 'IsActive',
            editable: true,
            type: 'checkbox',
            width: '10%',
            render: (value) => <Checkbox checked={value}></Checkbox>

        },
    ]

    return (
        <>
            {contextHolder}
            <DraggableModal open={openModal}
                            setOpen={setOpenModal}
                            modalTitle={'ثبت ماشین جدید'}
                            handleOk={onFinish}
                            handleCancel={handleCancel}
                            footer={null}
                            okText='ثبت'
                            cancelText='لغو'
                            centered
            >
                <Form
                    name="machineForm"
                    labelCol={{sm: {span: 24, offset: 0}, lg: {span: 10, offset: 4}}}
                    // wrapperCol={{span: 12,}}
                    style={{padding: '1rem', maxWidth: '90%', textAlign: 'center'}}
                    initialValues={{remember: true,}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={machineForm}
                >
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="نام دسته‌بندی"
                                name="MachineCategory"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا نام دسته‌بندی را انتخاب نمایید',
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
                                    options={machineCategoryList}
                                ></Select>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="نام دستگاه"
                                name="MachineName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا نام دستگاه را وارد نمایید',
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
                                label="کد دستگاه"
                                name="MachineCode"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا کد دستگاه را وارد نمایید',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="پلاک"
                                name="Plate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا پلاک را وارد نمایید',
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
                                label="نام راننده"
                                name="DriverName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا نام راننده را وارد نمایید',
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="مدل وسیله نقلیه"
                                name="Model"
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
                                label="شرکت سازنده"
                                name="Company"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="شماره سریال"
                                name="SerialNumber"
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
                                label="شماره شاسی"
                                name="ChassisNumber"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="نوع کارکرد"
                                name="FunctionType"
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
                                label="شماره موتور"
                                name="MotorNumber"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="رنگ"
                                name="Color"
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
                                label="تاریخ ورود به شرکت"
                                name="EntryDateTime"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <DatePicker persianDigits={true} isGregorian={false}
                                            timePicker={false}
                                            value={entryDateTime}
                                            name='entryDateTime'
                                            className='date-picker'
                                            onChange={(value) => setEntryDateTime(value)}/>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="فعال"
                                name="IsActive"
                                valuePropName="checked"
                                initialValue={true}
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Checkbox/>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
                            <Form.Item
                                label="سرویس‌ها"
                                name="MachineServices"
                                rules={[
                                    {
                                        required: false,
                                    },
                                ]}
                            >
                                <Button onClick={() => setOpenServiceModal(true)} className='btn-add'>افزودن سرویس
                                    جدید</Button>
                                <DraggableModal open={openServiceModal}
                                                setOpen={setOpenServiceModal}
                                                modalTitle={'افزودن سرویس جدید'}
                                                handleOk={onFinishMachineService}
                                                handleCancel={() => setOpenServiceModal(false)}
                                                okText='افزودن'
                                                cancelText='لغو'>
                                    <Form
                                        name="addMachineService"
                                        labelCol={{span: 8,}}
                                        wrapperCol={{span: 16,}}
                                        style={{maxWidth: 600,}}
                                        initialValues={{remember: true,}}
                                        onFinish={onFinishMachineService}
                                        onFinishFailed={onFinishFailedMachineService}
                                        autoComplete="off"
                                        form={machineServiceForm}
                                    >
                                        <Form.Item
                                            label="جزء سرویس شونده"
                                            name="ServiceableComponent"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'لطفا نام آبتم را وارد کنید',
                                                },
                                            ]}
                                        >
                                            <Input/>
                                        </Form.Item>

                                        <Form.Item
                                            label="زمان تعویض (ساعت)"
                                            name="ReplacementTime"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'لطفا نام آبتم را وارد کنید',
                                                },
                                            ]}
                                            style={{width: '100%'}}
                                        >
                                            <InputNumber style={{width: '100%'}}/>
                                        </Form.Item>

                                        <Form.Item
                                            label="استاندارد حجم"
                                            name="VolumeStandard"
                                        >
                                            <InputNumber style={{width: '100%'}}/>
                                        </Form.Item>
                                        <Form.Item
                                            label="واحد کالا"
                                            name="CommodityUnit"
                                        >
                                            <Select
                                                showSearch
                                                placeholder="انتخاب کنید"
                                                optionFilterProp="children"
                                                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                options={commodityUnitList}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="توضیحات"
                                            name="Description"
                                        >
                                            <TextArea/>
                                        </Form.Item>

                                        <Form.Item
                                            label="فعال"
                                            name="IsActive"
                                            valuePropName="checked"
                                            initialValue={true}
                                        >
                                            <Checkbox/>
                                        </Form.Item>
                                    </Form>
                                </DraggableModal>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{marginTop: '2rem', maxWidth: '100%', textAlign: "center"}}>
                        <DefaultTable tableColumns={serviceColumns} data={machineServiceList} expandable={false}
                                      paginationPageSize='5' scrollSize={100} tableSize='middle'></DefaultTable>
                    </div>

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
export default MachineForm;