import React, {useState} from 'react';
import {Button, message} from 'antd';
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import DefaultContent from "../containers/defaultContent";
import MachineRequestForm from "../forms/machineRequestForm";
import MachineRequestTable from "../tables/machineRequestTable";


const MachineRequestPage = () => {
    const [openMachineRequestModal, setOpenMachineRequestModal] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate()

    const handleMachineRequestModal = () => {
        setOpenMachineRequestModal(!openMachineRequestModal)
    }

    const breadcrumbList = [
        {title: 'ماشین‌ها', link: () => navigate('/machine/view')},
        {title: 'درخواست ماشین‌آلات', link: null},
    ]

    return (
        <DefaultContent breadCrumbList={breadcrumbList}>
            {contextHolder}
            <Button shape="round"
                    className='btn-add'
                    icon={<FontAwesomeIcon icon={faPlus}/>}
                    onClick={handleMachineRequestModal}
                    style={{marginBottom: '2rem'}}
                    size='large'>
                درخواست ماشین‌آلات
            </Button>

            <MachineRequestTable/>

            {openMachineRequestModal &&
                <MachineRequestForm openModal={openMachineRequestModal} setOpenModal={setOpenMachineRequestModal}/>}
        </DefaultContent>
    )
}
export default MachineRequestPage;