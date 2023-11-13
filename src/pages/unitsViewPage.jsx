import React, {useState} from 'react';
import {Button, theme} from 'antd';
import {useNavigate} from "react-router-dom";
import UnitsTable from "../tables/unitsTable";
import UnitFrom from "../forms/unitFrom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import DefaultContent from "../containers/defaultContent";

const UnitsViewPage = () => {
    const [openUnitModal, setOpenUnitModal] = useState(false)
    const {token: {colorBgContainer}} = theme.useToken();
    const navigate = useNavigate()

    const breadcrumbList = [
        {title: 'واحد‌ها', link: ''},
    ]

    return (
        <DefaultContent breadCrumbList={breadcrumbList}>
            <Button shape="round"
                    className='btn-add'
                    icon={<FontAwesomeIcon icon={faPlus}/>}
                    onClick={() => setOpenUnitModal(true)}
                    style={{marginBottom: '2rem'}}
                    size='large'>
                ثبت واحد جدید
            </Button>

            <UnitsTable/>

            {openUnitModal && <UnitFrom openModal={openUnitModal} setOpenModal={setOpenUnitModal}/>}
        </DefaultContent>
    )
}
export default UnitsViewPage;