import React, {useState} from 'react';
import {Button, theme} from 'antd';
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import DefaultContent from "../containers/defaultContent";
import MachineForm from "../forms/machineForm";
import MachineTable from "../tables/machineTable";

const MachineViewPage = () => {
    const [openMachineModal, setOpenMachineModal] = useState(false)

    const handleMachineModal = () => {
        setOpenMachineModal(true)
    }

    const breadcrumbList = [
        {title: 'ماشین‌ها', link: null},
    ]

    return (
        <DefaultContent breadCrumbList={breadcrumbList}>
            <Button shape="round"
                    className='btn-add'
                    icon={<FontAwesomeIcon icon={faPlus}/>}
                    onClick={handleMachineModal}
                    style={{marginBottom: '2rem'}}
                    size='large'>
                ثبت ماشین جدید
            </Button>

            <MachineTable/>

            {openMachineModal && <MachineForm openModal={openMachineModal} setOpenModal={setOpenMachineModal}/>}
        </DefaultContent>
    )
}
export default MachineViewPage;