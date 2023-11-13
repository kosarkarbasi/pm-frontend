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

const MachineCategoryTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
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

    const [machineCategoryForm] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [currentRecord, setCurrentRecord] = useState({})
    const [editModal, setEditModal] = useState(false)

    const dispatch = useDispatch()
    const data = useSelector(selectMachineCategories)

    const handleDeleteMachineCategory = (key) => {
        dispatch(deleteMachineCategory({messageApi, key}))
    }

    const HandleEditModal = (record) => {
        setEditModal(!editModal)
        setCurrentRecord(record)
    }

    useEffect(() => {
        dispatch(getAllMachineCategories({messageApi}))
    }, [])

    const columns = [
        {
            title: 'نوع دستگاه',
            dataIndex: 'MachineType',
            key: 'machineType',
            columnSearch: true,
            fixed: 'left',
            ...getColumnSearchProps('MachineType')
        },
        {
            title: 'کد دستگاه',
            dataIndex: 'MachineCode',
            key: 'machineCode',
            ...getColumnSearchProps('MachineCode')
        },
        {
            title: 'نام دسته‌بندی',
            dataIndex: 'CategoryName',
            key: 'categoryName',
            ...getColumnSearchProps('CategoryName')
        },
        {
            title: 'کد دسته‌بندی',
            dataIndex: 'CategoryCode',
            key: 'categoryCode',
            ...getColumnSearchProps('CategoryCode')
        },
        {
            title: 'نام واحد بهره بردار',
            dataIndex: 'UnitName',
            key: 'unitName',
            ...getColumnSearchProps('UnitName')
        },
        {
            title: 'موثر بر زمان‌بندی',
            dataIndex: 'IsTimeEffective',
            key: 'isTimeEffective',
            render: (value) => <Checkbox checked={value}/>
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
                                onConfirm={() => handleDeleteMachineCategory(record.key)}
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

    const pmItemsColumns = [
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
            render: (value) => <Checkbox checked={value}></Checkbox>
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
    ]

    return (
        <>
            {contextHolder}
            <Form form={machineCategoryForm} component={false}>
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
                                <Table columns={pmItemsColumns} dataSource={record.MachineCategoryPMItems}></Table>
                            </div>
                        ),
                        rowExpandable: (record) => record && record.name !== 'Not Expandable',
                    }}
                    bordered
                    scroll={{
                        x: 'calc(700px + 50%)',
                    }}
                />
                {editModal && <MachineCategoryForm openModal={editModal} setOpenModal={setEditModal} edit={true}
                                                   record={currentRecord}/>}
            </Form>
        </>
    )
}

export default MachineCategoryTable;