import React, {useEffect, useState} from 'react';
import {Button, Checkbox, Form, Input, Select, message, Popconfirm, Space, Row, Col} from 'antd';
import DraggableModal from "../components/draggableModal";
import TextArea from "antd/es/input/TextArea";
import DefaultTable from "../tables/defaultTable";
import {DeleteOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {getAllUnits, selectUnits} from "../features/unit/unitSlice";
import {addMachineCategory, updateMachineCategory} from "../features/machineCategory/machineCategorySlice";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import UnitFrom from "./unitFrom";
import {getEnumCategory, selectEnum} from "../features/enum/enumSlice";

const MachineCategoryForm = ({openModal, setOpenModal, edit = false, record}) => {

    const [openPmModal, setOpenPmModal] = useState(false)
    const [pmItems, setPmItems] = useState([])
    const [keyCount, setKeyCount] = useState(0)
    const [unitList, setUnitList] = useState([])
    const [categoryNameList, setCategoryNameList] = useState([])
    const dispatch = useDispatch()
    const units = useSelector(selectUnits)
    const [openUnitModal, setOpenUnitModal] = useState(false)

    const [messageApi, contextHolder] = message.useMessage();

    const [machineCategoryForm] = Form.useForm();
    const [pmItemForm] = Form.useForm();

    const categoryNames = useSelector(selectEnum)

    useEffect(() => {
        machineCategoryForm.setFieldValue('machineCategoryPMItems', pmItems)
    }, [pmItems])

    useEffect(() => {
        dispatch(getAllUnits({messageApi}));
        dispatch(getEnumCategory({messageApi, category: 'دسته بندی ماشین آلات'}))
    }, [])

    useEffect(() => {
        if (edit) {
            machineCategoryForm.setFieldsValue(record)
            setPmItems(record.MachineCategoryPMItems)
        }
    }, [])

    useEffect(() => {
        // unit format ---> {value: '0', label: 'واحد ترابری'}
        setUnitList(units.map(unit => ({value: unit.UnitName, label: unit.UnitName})))
    }, [units])

    useEffect(() => {
        // unit format ---> {value: '0', label: 'واحد ترابری'}
        setCategoryNameList(categoryNames.map(category => ({value: category.Title, label: category.Title})))
    }, [categoryNameList])

    useEffect(() => {
        if (machineCategoryForm.getFieldValue('CategoryName')) {
            const code = categoryNames.find(cat => cat.Title === machineCategoryForm.getFieldValue('CategoryName')).Code
            machineCategoryForm.setFieldValue('CategoryCode', code)
        }
    }, [machineCategoryForm.getFieldValue('CategoryName')])


    const onFinishPmItem = () => {
        pmItemForm.validateFields()
            .then((values) => {
                const newPmItem = {
                    id: keyCount,
                    ItemName: pmItemForm.getFieldValue('ItemName'),
                    IsActive: pmItemForm.getFieldValue('IsActive'),
                    Description: pmItemForm.getFieldValue('Description')
                }
                setPmItems(oldValue => [...oldValue, newPmItem])
                pmItemForm.resetFields();

                setOpenPmModal(false);
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

    const onFinishFailedPmItem = (errorInfo) => {
        messageApi.open({
            type: 'error',
            content: 'عملیات با خطا مواجه شد',
        });
    };

    const handleDeletePmItem = (id) => {
        setPmItems(data => data.filter(item => item.id !== id));
    };

    const handlePMCancel = (e) => {
        setOpenPmModal(false);
    };

    const handleCancelOriginModal = () => {
        setOpenModal(false)
        setOpenPmModal(false)
        setOpenUnitModal(false)
    }

    const onFinish = (values) => {
        if (!edit) {
            dispatch(addMachineCategory({
                pmItems,
                machineCategoryForm,
                messageApi,
                setOpenModal
            }))
        } else {
            dispatch(updateMachineCategory({
                machineCategoryForm,
                messageApi,
                id: machineCategoryForm.getFieldValue('key')
            }))
        }
        setPmItems([])
        setOpenModal(false)
        setOpenPmModal(false)
        setOpenUnitModal(false)
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: 'نام آیتم',
            dataIndex: 'ItemName',
            editable: true,
            type: 'text'
        },
        {
            title: 'فعال',
            dataIndex: 'IsActive',
            editable: true,
            type: 'checkbox',
            render: (value) => <Checkbox defaultChecked={true} checked={value}></Checkbox>
        },
        {
            title: 'توضیحات',
            dataIndex: 'Description',
            editable: true,
            type: 'text',
            render: (value) => {
                if (value === 'undefined') return '-'
                return value
            }
        },
        {
            title: 'عملیات‌ها',
            dataIndex: 'actions',
            render: (_, record) =>
                pmItems.length >= 1 ? (
                    <Popconfirm title="مطمئنید؟"
                                okText='بله'
                                cancelText='لغو'
                                icon={
                                    <QuestionCircleOutlined
                                        style={{
                                            color: 'red',
                                        }}
                                    />
                                }
                                onConfirm={() => handleDeletePmItem(record.id)}>
                        <a style={{color: 'red'}} title='حذف'><DeleteOutlined/></a>
                    </Popconfirm>
                ) : null,
        },
    ]

    return (
        <>
            {contextHolder}
            <DraggableModal open={openModal}
                            setOpen={setOpenModal}
                            confirmLoading
                            modalTitle={edit ? 'ویرایش دسته‌بندی' : 'ثبت دسته‌بندی جدید'}
                            handleOk={onFinish}
                            handleCancel={handleCancelOriginModal}
                            footer={null}
                            okText='ثبت'
                            cancelText='لغو'
                            centered
            >
                <Form
                    name="machineCategoryForm"
                    labelCol={{span: 8,}}
                    wrapperCol={{span: 16,}}
                    style={{maxWidth: '90%',}}
                    initialValues={{remember: true,}}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    form={machineCategoryForm}
                >
                    <Form.Item
                        label="نوع دستگاه"
                        name="MachineType"
                        rules={[
                            {
                                required: true,
                                message: 'لطفا نوع دستگاه را وارد کنید',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>


                    <Form.Item
                        label="کد دستگاه"
                        name="MachineCode"
                        rules={[
                            {
                                required: true,
                                message: 'لطفا کد دستگاه را وارد کنید',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="نام دسته‌بندی"
                        name="CategoryName"
                        rules={[
                            {
                                required: true,
                                message: 'لطفا نام دسته‌بندی را وارد کنید',
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
                            options={categoryNameList}
                        />
                    </Form.Item>

                    <Form.Item
                        label="کد دسته‌بندی"
                        name="CategoryCode"
                        rules={[
                            {
                                required: true,
                                message: 'لطفا کد دسته‌بندی را وارد کنید',
                            },
                        ]}
                    >
                        <Input readOnly/>
                    </Form.Item>

                    <Form.Item
                        label="نام واحد بهره بردار"
                        style={{width: '100%'}}
                        name='Container'
                    >
                        <Space.Compact style={{width: '100%'}}>
                            <Form.Item
                                style={{width: '100%'}}
                                name="UnitName"
                                rules={[
                                    {
                                        required: true,
                                        message: 'لطفا نام واحد را انتخاب کنید',
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
                                    options={unitList}
                                />
                            </Form.Item>
                            <Button htmlType='reset' icon={<FontAwesomeIcon icon={faPlus}/>}
                                    onClick={() => setOpenUnitModal(true)} className='btn-success'></Button>
                            {openUnitModal && <UnitFrom openModal={openUnitModal} setOpenModal={setOpenUnitModal}/>}
                        </Space.Compact>
                    </Form.Item>

                    <Form.Item
                        label="موثر بر زمان‌بندی"
                        name="IsTimeEffective"
                        valuePropName="checked"
                        initialValue={false}
                        rules={[
                            {
                                required: false,
                                message: 'لطفا کد دسته‌بندی را وارد کنید',
                            },
                        ]}
                    >
                        <Checkbox/>
                    </Form.Item>

                    <Form.Item
                        label="آیتم‌های بازرسی PM"
                        name="MachineCategoryPMItems"
                        rules={[
                            {
                                required: false,
                                message: 'لطفا کد دسته‌بندی را وارد کنید',
                            },
                        ]}
                    >
                        <Button onClick={() => setOpenPmModal(true)} className='btn-add'>افزودن آیتم جدید</Button>
                        <DraggableModal open={openPmModal}
                                        setOpen={setOpenPmModal}
                                        modalTitle={'افزودن آیتم جدید'}
                                        handleOk={onFinishPmItem}
                                        handleCancel={handlePMCancel}
                                        okText='افزودن'
                                        cancelText='لغو'>
                            <Form
                                name="addPMItem"
                                labelCol={{span: 8,}}
                                wrapperCol={{span: 16,}}
                                style={{maxWidth: 600,}}
                                initialValues={{remember: true,}}
                                onFinish={onFinishPmItem}
                                onFinishFailed={onFinishFailedPmItem}
                                autoComplete="off"
                                form={pmItemForm}
                            >
                                <Form.Item
                                    label="نام آیتم"
                                    name="ItemName"
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
                                    label="فعال"
                                    name="IsActive"
                                    valuePropName="checked"
                                    initialValue={true}
                                >
                                    <Checkbox/>
                                </Form.Item>

                                <Form.Item
                                    label="توضیحات"
                                    name="Description"
                                >
                                    <TextArea/>
                                </Form.Item>
                            </Form>
                        </DraggableModal>
                        <div style={{marginTop: '2rem'}}>
                            <DefaultTable tableColumns={columns} data={pmItems} expandable={false}
                                          paginationPageSize='5' scrollSize={150} tableSize='middle'></DefaultTable>
                        </div>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit" className='btn-success'
                                style={{width: '100%'}}>
                            {edit ? 'ویرایش' : 'ذخیره'}
                        </Button>
                    </Form.Item>
                </Form>
            </DraggableModal>
        </>
    );
}

export default MachineCategoryForm;