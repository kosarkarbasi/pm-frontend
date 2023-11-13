import React, {useEffect, useRef, useState} from "react";
import {Button, Col, Form, Input, message, Popconfirm, Row, Space, Table,} from "antd";
import {DeleteOutlined, EditOutlined, QuestionCircleOutlined, SearchOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {deleteUnit, getAllUnits, selectUnits, updateUnit} from "../features/unit/unitSlice";
import Highlighter from 'react-highlight-words';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBan, faCheck} from "@fortawesome/free-solid-svg-icons";
import EditableCell from "../components/editableCell";

const UnitsTable = () => {
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

    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const dispatch = useDispatch()
    const units = useSelector(selectUnits)

    const DeleteUnitHandler = (key) => {
        dispatch(deleteUnit({key, messageApi}))
    }

    const edit = (record) => {
        form.setFieldsValue({
            UnitName: '',
            ManagerName: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async () => {
        try {
            dispatch(updateUnit({
                id: form.getFieldValue('key'),
                updatedData: {
                    unitName: form.getFieldValue('UnitName'),
                    managerName: form.getFieldValue('ManagerName')
                },
                messageApi
            }))
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
        setEditingKey('');
    };

    const columns = [
        {
            title: 'نام واحد',
            dataIndex: 'UnitName',
            key: 'name',
            columnSearch: true,
            editable: true,
            width: '25%',
            fixed: 'left',
            ...getColumnSearchProps('UnitName')
        },
        {
            title: 'مدیر واحد',
            dataIndex: 'ManagerName',
            key: 'manager',
            editable: true,
            width: '25%',
        },
        {
            title: 'عملیات‌ها',
            dataIndex: '',
            key: 'x',
            width: '20%',
            render: (_, record) => {
                const editable = isEditing(record);
                console.log(record.key)
                console.log(editingKey)
                return (
                    <Row justify='center'>
                        <Col span={8} xs={{span: 24}} sm={{span: 24}} lg={{span: 12}}>
                            {editable ? (
                                <Row justify='space-between'>
                                    <Col>
                                        <Button className='btn-success' icon={<FontAwesomeIcon icon={faCheck}/>}
                                                title='ذخیره'
                                                onClick={() => save(record.key)}></Button>
                                    </Col>
                                    <Col>
                                        <Button className='btn-danger' title='لغو'
                                                icon={<FontAwesomeIcon icon={faBan}/>}
                                                onClick={cancel}></Button>
                                    </Col>
                                </Row>
                            ) : (
                                <Button disabled={editingKey !== ''} title='ویرایش' onClick={() => edit(record)}
                                        style={{color: 'orange', borderColor: 'orange'}}
                                        icon={<EditOutlined/>}></Button>
                            )
                            }
                        </Col>
                        <Col span={8} xs={{span: 24}} sm={{span: 24}} lg={{span: 12}}>
                            <Popconfirm
                                title="حذف واحد"
                                description="آیا از حذف این واحد مطمئنید؟"
                                okText='بله'
                                cancelText='خیر'
                                okButtonProps={{style: {order: 1}}}
                                okType='danger'
                                onConfirm={() => DeleteUnitHandler(record.key)}
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


    useEffect(() => {
            dispatch(getAllUnits({messageApi}));
        }
        , [])

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });


    return (
        <>
            {contextHolder}
            <Form form={form} component={false}>
                <Table
                    dataSource={units}
                    columns={mergedColumns}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                    scroll={{
                        x: 'calc(700px + 50%)',
                    }}
                />
            </Form>
        </>
    )
}

export default UnitsTable;