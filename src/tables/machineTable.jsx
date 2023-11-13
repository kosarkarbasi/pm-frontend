import React, {useEffect} from "react";
import {Checkbox, Form, message, Table} from "antd";
import {useForm} from "antd/es/form/Form";
import moment from "jalali-moment";
import {useDispatch, useSelector} from "react-redux";
import {getAllMachines, selectMachines} from "../features/machine/machineSlice";


const MachineTable = () => {

    const [messageApi, contextHolder] = message.useMessage();
    const [machineForm] = useForm()
    const dispatch = useDispatch()

    const machinesData = useSelector(selectMachines)

    useEffect(() => {
        dispatch(getAllMachines({messageApi}))
    }, [])

    const machineColumns = [
        {
            title: 'نام دسته‌بندی',
            dataIndex: 'MachineCategory',
            key: 'MachineCategory',
            editable: true,
            type: 'text',
            fixed: 'left',
            width: 80
        },
        {
            title: 'نام دستگاه',
            dataIndex: 'MachineName',
            key: 'MachineName',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'کد دستگاه',
            dataIndex: 'MachineCode',
            key: 'MachineCode',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'پلاک',
            dataIndex: 'Plate',
            key: 'Plate',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'نام راننده',
            dataIndex: 'DriverName',
            key: 'DriverName',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'مدل وسیله نقلیه',
            dataIndex: 'Model',
            key: 'Model',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'شرکت سازنده',
            dataIndex: 'Company',
            key: 'Company',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'شماره سریال',
            dataIndex: 'SerialNumber',
            key: 'SerialNumber',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'شماره شاسی',
            dataIndex: 'ChassisNumber',
            key: 'ChassisNumber',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'نوع کارکرد',
            dataIndex: 'FunctionType',
            key: 'FunctionType',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'شماره موتور',
            dataIndex: 'MotorNumber',
            key: 'MotorNumber',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'رنگ',
            dataIndex: 'Color',
            key: 'Color',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'تاریخ ورود به شرکت',
            dataIndex: 'EntryDateTime',
            key: 'EntryDateTime',
            editable: true,
            type: 'text',
            width: 80,
            render: (value) => {
                if (value) return moment(new Date(value), 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm')
            },
        },
        {
            title: 'فعال',
            dataIndex: 'IsActive',
            key: 'IsActive',
            editable: true,
            width: 80,
            render: (value) => <Checkbox checked={value}></Checkbox>
        },
    ]

    const serviceColumns = [
        {
            title: 'جزء سرویس شونده',
            dataIndex: 'ServiceableComponent',
            key: 'ServiceableComponent',
            editable: true,
            type: 'text',
            width: 80,
        },
        {
            title: 'زمان تعویض',
            dataIndex: 'ReplacementTime',
            key: 'ReplacementTime',
            editable: true,
            type: 'checkbox',
            width: 80,
            render: (value) => <Checkbox checked={value}></Checkbox>
        },
        {
            title: 'استاندارد حجم',
            dataIndex: 'VolumeStandard',
            key: 'VolumeStandard',
            editable: true,
            type: 'text',
            width: 80,
            render: (value) => {
                if (value === 'undefined') return '-'
                return value
            }
        },
        {
            title: 'واحد کالا',
            dataIndex: 'CommodityUnit',
            key: 'CommodityUnit',
            editable: true,
            type: 'text',
            width: 80
        },
        {
            title: 'توضیحات',
            dataIndex: 'Description',
            key: 'Description',
            editable: true,
            type: 'text',
            width: 80,
            render: (value) => {
                if (value === 'undefined') return '-'
                return value
            }
        },
        {
            title: 'فعال',
            dataIndex: 'IsActive',
            key: 'IsActive',
            editable: true,
            type: 'checkbox',
            width: 80,
            render: (value) => <Checkbox checked={value}></Checkbox>
        },
    ]

    return (
        <>
            {contextHolder}
            <Form form={machineForm} component={false}>
                <Table
                    dataSource={machinesData}
                    columns={machineColumns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div
                                style={{
                                    margin: 0,
                                }}
                            >
                                <Table columns={serviceColumns} dataSource={record.MachineServices} scroll={{x: 'calc(700px + 50%)'}}></Table>
                            </div>
                        ),
                        rowExpandable: (record) => record && record.name !== 'Not Expandable',
                    }}
                    bordered
                    scroll={{
                        x: 'calc(700px + 50%)',
                    }}
                    size='middle'
                />
                {/*{editModal && <MachineCategoryForm openModal={editModal} setOpenModal={setEditModal} edit={true}*/}
                {/*                                   record={currentRecord}/>}*/}
            </Form>
        </>
    )
}

export default MachineTable;