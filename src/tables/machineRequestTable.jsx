import React, {useEffect, useRef, useState} from "react";
import {Button, Checkbox, Col, Form, Input, message, Popconfirm, Row, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined, QuestionCircleOutlined, SearchOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {
    deleteMachineCategory,
    getAllMachineCategories,
    selectMachineCategories,
} from "../features/machineCategory/machineCategorySlice";
import Highlighter from "react-highlight-words";
import MachineCategoryForm from "../forms/machineCategoryForm";
import {getAllMachineRequests, selectMachineRequests} from "../features/machineRequest/machineRequestSlice";
import moment from "jalali-moment";

const MachineRequestTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [machineRequestForm] = Form.useForm()

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        جستجو
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        ریست
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        فیلتر
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        بستن
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    const [messageApi, contextHolder] = message.useMessage();

    const [currentRecord, setCurrentRecord] = useState({})
    const [editModal, setEditModal] = useState(false)

    const dispatch = useDispatch()
    const data = useSelector(selectMachineRequests)

    const handleDeleteMachineRequest = (key) => {

    }

    const HandleEditModal = (record) => {
        setEditModal(!editModal)
        setCurrentRecord(record)
    }

    useEffect(() => {
        dispatch(getAllMachineRequests({messageApi}))
    }, [])

    const columns = [
        {
            title: 'شماره درخواست',
            dataIndex: 'RequestNumber',
            key: 'RequestNumber',
            columnSearch: true,
            fixed: 'left',
            ...getColumnSearchProps('MachineType')
        },
        {
            title: 'تاریخ درخواست',
            dataIndex: 'RequestDate',
            key: 'RequestDate',
            ...getColumnSearchProps('MachineCode'),
            render: (value) => {
                if (value) return moment(new Date(value), 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm')
            },
        },
        {
            title: 'نام درخواست دهنده',
            dataIndex: 'ApplicantName',
            key: 'ApplicantName',
            ...getColumnSearchProps('CategoryName')
        },
        {
            title: 'واحد درخواست دهنده',
            dataIndex: 'ApplicantUnit',
            key: 'ApplicantUnit',
            ...getColumnSearchProps('CategoryCode')
        },
        {
            title: 'نوع دستگاه',
            dataIndex: 'MachineCategory',
            key: 'MachineCategory',
            ...getColumnSearchProps('UnitName')
        },
        {
            title: 'از تاریخ',
            dataIndex: 'RequestFromDate',
            key: 'RequestFromDate',
            render: (value) => {
                if (value) return moment(new Date(value), 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm')
            },
        },
        {
            title: 'تا تاریخ',
            dataIndex: 'RequestToDate',
            key: 'RequestToDate',
            render: (value) => {
                if (value) return moment(new Date(value), 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm')
            },
        },
        {
            title: 'مدت زمان کار',
            dataIndex: 'RequestWorkTime',
            key: 'RequestWorkTime',
        },
        {
            title: 'محل انجام کار',
            dataIndex: 'WorkPlace',
            key: 'WorkPlace',
        },
        {
            title: 'نوع کار',
            dataIndex: 'WorkType',
            key: 'WorkType',
        },
        {
            title: 'دستگاه جایگزین',
            dataIndex: 'ReplaceMachine',
            key: 'ReplaceMachine',
            render: (value) => value ? (value.map(val => val.MachineCategory)).toString(): '-'
        },
        {
            title: 'عملیات‌ها',
            dataIndex: '',
            key: 'x',
            render: (_, record) => {
                return (
                    <Row justify='center'>
                        <Col xs={{span: 24}} sm={{span: 24}} lg={{span: 12}}>
                            {editModal ? () => HandleEditModal(record) : (
                                <Button disabled={editModal} title='ویرایش'
                                        onClick={() => HandleEditModal(record)}
                                        style={{color: 'orange', borderColor: 'orange'}}
                                        icon={<EditOutlined/>}></Button>
                            )
                            }
                        </Col>
                        <Col xs={{span: 24}} sm={{span: 24}} lg={{span: 12}}>
                            <Popconfirm
                                title="حذف واحد"
                                description="آیا از حذف این دسته‌بندی مطمئنید؟"
                                okText='بله'
                                cancelText='خیر'
                                okButtonProps={{style: {order: 1}}}
                                okType='danger'
                                onConfirm={() => handleDeleteMachineRequest(record.key)}
                                cancelButtonProps={{style: {order: 2}}}
                                icon={
                                    <QuestionCircleOutlined
                                        style={{
                                            color: 'red',
                                        }}
                                    />
                                }
                            >
                                <Button title='حذف' icon={<DeleteOutlined/>} danger></Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                )
            },
        },
    ];

    return (
        <>
            {contextHolder}
            <Form form={machineRequestForm} component={false}>
                <Table
                    dataSource={data}
                    columns={columns}
                    expandable={{
                        expandedRowRender: (record) => (
                            <div
                                style={{
                                    margin: 0,
                                }}
                            >
                                {record.WorkDescription}
                            </div>
                        ),
                        rowExpandable: (record) => record && record.name !== 'Not Expandable',
                    }}
                    bordered
                    scroll={{
                        x: 'calc(700px + 50%)',
                    }}
                />
                {/*{editModal && <MachineCategoryForm openModal={editModal} setOpenModal={setEditModal} edit={true}*/}
                {/*                                   record={currentRecord}/>}*/}
            </Form>
        </>
    )
}

export default MachineRequestTable;